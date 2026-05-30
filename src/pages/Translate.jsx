import { useState, useEffect, useRef, useCallback } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

const WS_URL =
  "wss://temanku-backend-70685098724.asia-southeast2.run.app/ws/predict";

const FRAME_INTERVAL_MS = 300;

const STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  ACTIVE: "active",
  STOPPING: "stopping",
  ERROR: "error",
};

const IconCamera = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconTranslate = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M5 8l6 6M4 6h7M7 4v2" />
    <path d="M2 21l7-7" />
    <path d="M12 21l5-11 5 11M14.5 17h5" />
  </svg>
);

const IconStop = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

function useTranslation() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [status, setStatus] = useState(STATUS.IDLE);
  const [translation, setTranslation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const cleanupWebSocket = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  }, []);

  const cleanupAll = useCallback(() => {
    cleanupWebSocket();
    cleanupCamera();
  }, [cleanupWebSocket, cleanupCamera]);

  const sendFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ws = wsRef.current;

    if (!video || !canvas || !ws || ws.readyState !== WebSocket.OPEN) return;
    if (video.readyState < 2) return;

    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg", 0.6).split(",")[1];

    // Backend menerima raw base64, bukan JSON.
    ws.send(base64);
  }, []);

  const start = useCallback(async () => {
    setErrorMsg("");
    setTranslation("");
    setConfidence(null);
    setStatus(STATUS.CONNECTING);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          setErrorMsg("Kamera berhenti atau sedang digunakan aplikasi lain.");
          setStatus(STATUS.ERROR);
          cleanupAll();
        };
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
      }

      setIsCameraActive(true);

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus(STATUS.ACTIVE);
        intervalRef.current = setInterval(sendFrame, FRAME_INTERVAL_MS);
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);

          const prediction = response.data?.prediction;
          const score = response.data?.confidence;
          const isDetected = response.data?.is_detected;

          if (isDetected && prediction) {
            setTranslation(prediction);
            setConfidence(score ?? null);
          } else {
            setTranslation("");
            setConfidence(null);
          }
        } catch {
          if (event.data && String(event.data).trim()) {
            setTranslation(String(event.data).trim());
            setConfidence(null);
          }
        }
      };

      ws.onerror = () => {
        setErrorMsg("Koneksi ke server gagal. Kamera tetap aktif.");
        setStatus(STATUS.ERROR);
        cleanupWebSocket();
      };

      ws.onclose = (event) => {
        cleanupWebSocket();

        if (event.code !== 1000) {
          setErrorMsg(`Koneksi WebSocket terputus. Code: ${event.code}`);
          setStatus(STATUS.ERROR);
        } else {
          setStatus(STATUS.IDLE);
        }
      };
    } catch (err) {
      const msg =
        err.name === "NotAllowedError"
          ? "Izin kamera ditolak. Aktifkan akses kamera di pengaturan browser."
          : err.name === "NotFoundError"
            ? "Kamera tidak ditemukan pada perangkat ini."
            : `Gagal mengakses kamera: ${err.message}`;

      setErrorMsg(msg);
      setStatus(STATUS.ERROR);
      cleanupAll();
    }
  }, [sendFrame, cleanupWebSocket, cleanupAll]);

  const stop = useCallback(() => {
    setStatus(STATUS.STOPPING);
    cleanupAll();

    setTimeout(() => {
      setStatus(STATUS.IDLE);
      setErrorMsg("");
      setTranslation("");
      setConfidence(null);
    }, 300);
  }, [cleanupAll]);

  useEffect(() => {
    return () => cleanupAll();
  }, [cleanupAll]);

  return {
    videoRef,
    canvasRef,
    status,
    translation,
    confidence,
    errorMsg,
    start,
    stop,
    isCameraActive,
    isActive: status === STATUS.ACTIVE,
    isLoading: status === STATUS.CONNECTING || status === STATUS.STOPPING,
  };
}

function StatusBadge({ status }) {
  const config = {
    [STATUS.IDLE]: {
      color:
        "bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300",
      dot: "bg-neutral-400",
      label: "Siap",
    },
    [STATUS.CONNECTING]: {
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      dot: "bg-yellow-400",
      label: "Menghubungkan…",
    },
    [STATUS.ACTIVE]: {
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      dot: "bg-green-500",
      label: "Live",
    },
    [STATUS.STOPPING]: {
      color:
        "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300",
      dot: "bg-neutral-400",
      label: "Menghentikan…",
    },
    [STATUS.ERROR]: {
      color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
      dot: "bg-red-500",
      label: "Error",
    },
  };

  const c = config[status] ?? config[STATUS.IDLE];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${c.color}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === STATUS.ACTIVE ? "animate-pulse" : ""}`}
      />
      {c.label}
    </span>
  );
}

export default function Translate() {
  const {
    videoRef,
    canvasRef,
    status,
    translation,
    confidence,
    errorMsg,
    start,
    stop,
    isCameraActive,
    isActive,
    isLoading,
  } = useTranslation();

  const dk = useDarkMode();
  const confidencePercent =
    typeof confidence === "number" ? Math.round(confidence * 100) : null;

  return (
    <div
      className={`flex flex-col min-h-full ${dk.page} transition-colors duration-300`}
    >
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
        }}
      >
        <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
          Terjemah
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        <div
          className={`${dk.card} rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300`}
        >
          <div
            className={`flex items-center justify-between px-4 py-3 border-b ${
              dk.isDark ? "border-neutral-800" : "border-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 text-primary-600">
              <IconCamera className="w-4 h-4" />
              <span className={`text-sm font-semibold ${dk.textPrimary}`}>
                Terjemah dari Bahasa Isyarat ke Teks
              </span>
            </div>

            <StatusBadge status={status} />
          </div>

          <div className="px-4 pt-4">
            <div
              className="relative w-full max-w-[420px] mx-auto bg-neutral-900 rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />

              <canvas ref={canvasRef} className="hidden" />

              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <IconCamera className="w-7 h-7 text-white" />
                  <p className="text-white/80 text-sm font-medium">
                    {isLoading ? "Membuka kamera…" : "Posisikan tangan di sini"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="px-4 pt-3">
              <p className="text-xs text-red-500 text-center leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          <div className="px-4 py-3">
            <div
              className={`
              w-full min-h-[58px] rounded-xl border px-4 py-3
              flex items-center transition-all duration-300
              ${
                translation
                  ? dk.isDark
                    ? "border-blue-800 bg-blue-950/40"
                    : "border-blue-200 bg-blue-50"
                  : dk.isDark
                    ? "border-neutral-700 bg-neutral-800"
                    : "border-neutral-200 bg-neutral-50"
              }
            `}
            >
              {translation ? (
                <p className={`font-semibold text-base ${dk.textPrimary}`}>
                  {translation}
                  {confidencePercent !== null && (
                    <span className="ml-2 text-sm font-medium text-blue-600">
                      ({confidencePercent}%)
                    </span>
                  )}
                </p>
              ) : (
                <p className={`${dk.textMuted} text-sm italic`}>
                  Terjemahannya akan muncul di sini...
                </p>
              )}
            </div>
          </div>
        </div>

        {!isCameraActive ? (
          <button
            onClick={start}
            disabled={isLoading}
            className="
              w-full flex items-center justify-center gap-2.5
              py-4 rounded-2xl font-semibold text-white text-sm
              transition-all duration-200 active:scale-95
              disabled:opacity-60 disabled:active:scale-100
            "
            style={{
              background: "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
              boxShadow: "0 4px 16px rgba(59,125,255,0.4)",
            }}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                  />
                </svg>
                Menghubungkan...
              </>
            ) : (
              <>
                <IconTranslate className="w-5 h-5" />
                Mulai Penerjemahan
              </>
            )}
          </button>
        ) : (
          <button
            onClick={stop}
            className="
              w-full flex items-center justify-center gap-2.5
              py-4 rounded-2xl font-semibold text-white text-sm
              transition-all duration-200 active:scale-95
              bg-red-500 hover:bg-red-600
            "
            style={{ boxShadow: "0 4px 16px rgba(239,68,68,0.35)" }}
          >
            <IconStop className="w-4 h-4" />
            Akhiri Penerjemahan
          </button>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0%   { top: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
