import { useState, useEffect, useRef, useCallback } from "react";

// ── Konstanta ─────────────────────────────────────────────────
const WS_URL =
  "wss://temanku-backend-70685098724.asia-southeast2.run.app/ws/predict";
const FRAME_INTERVAL_MS = 150; // kirim ~6-7 frame/detik

// ── Status koneksi ────────────────────────────────────────────
const STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  ACTIVE: "active",
  STOPPING: "stopping",
  ERROR: "error",
};

// ── Ikon SVG ──────────────────────────────────────────────────
const IconCamera = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
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

const IconWifi = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
  </svg>
);

// ── Hook utama: kamera + WebSocket ───────────────────────────
function useTranslation() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [status, setStatus] = useState(STATUS.IDLE);
  const [translation, setTranslation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]); // riwayat terjemahan

  // ── Bersihkan semua resource ────────────────────────────────
  const cleanup = useCallback(() => {
    // Hentikan interval pengiriman frame
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Tutup WebSocket
    if (wsRef.current) {
      wsRef.current.onclose = null; // hindari trigger handler
      wsRef.current.close();
      wsRef.current = null;
    }
    // Matikan stream kamera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    // Reset video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // ── Kirim frame via canvas → base64 → WebSocket ─────────────
  const sendFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ws = wsRef.current;

    if (!video || !canvas || !ws || ws.readyState !== WebSocket.OPEN) return;
    if (video.readyState < 2) return; // video belum siap

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;

    // Mirror horizontal (selfie mode)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Ambil base64 JPEG (kualitas 0.6 untuk hemat bandwidth)
    const base64 = canvas.toDataURL("image/jpeg", 0.6).split(",")[1];
    ws.send(JSON.stringify({ frame: base64 }));
  }, []);

  // ── Mulai penerjemahan ───────────────────────────────────────
  const start = useCallback(async () => {
    setErrorMsg("");
    setStatus(STATUS.CONNECTING);

    try {
      // 1. Akses kamera — gunakan kamera default perangkat
      // (kamera depan/webcam di laptop, kamera default di smartphone)
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
          setErrorMsg("Kamera berhenti atau digunakan aplikasi lain.");
          setStatus(STATUS.ERROR);
          cleanup();
        };

        track.onmute = () => {
          setErrorMsg("Kamera tidak mengirim video.");
          setStatus(STATUS.ERROR);
          cleanup();
        };
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
      }

      // 2. Buka WebSocket
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus(STATUS.ACTIVE);
        // 3. Mulai kirim frame secara berkala
        intervalRef.current = setInterval(sendFrame, FRAME_INTERVAL_MS);
      };

      // 4. Terima hasil prediksi dari backend
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const text = data.hasil_teks ?? data.text ?? data.result ?? "";
          if (text && text.trim()) {
            setTranslation(text.trim());
            setHistory((prev) => {
              const entry = { id: Date.now(), text: text.trim() };
              // Hindari duplikat berurutan
              if (prev[0]?.text === text.trim()) return prev;
              return [entry, ...prev].slice(0, 20); // max 20 riwayat
            });
          }
        } catch {
          // Abaikan pesan non-JSON
        }
      };

      ws.onerror = () => {
        setErrorMsg("Koneksi ke server gagal. Periksa jaringan kamu.");
        setStatus(STATUS.ERROR);
        cleanup();
      };

      ws.onclose = (e) => {
        cleanup();

        if (e.code !== 1000) {
          setErrorMsg("Koneksi WebSocket terputus dari server.");
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
      cleanup();
    }
  }, [sendFrame, cleanup, status]);

  // ── Akhiri penerjemahan ──────────────────────────────────────
  const stop = useCallback(() => {
    setStatus(STATUS.STOPPING);

    if (wsRef.current) {
      wsRef.current.close(1000);
    }

    cleanup();
    setTimeout(() => setStatus(STATUS.IDLE), 300);
  }, [cleanup]);

  // ── Cleanup saat unmount (pindah halaman) ────────────────────
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    videoRef,
    canvasRef,
    status,
    translation,
    errorMsg,
    history,
    start,
    stop,
    isActive: status === STATUS.ACTIVE,
    isLoading: status === STATUS.CONNECTING || status === STATUS.STOPPING,
  };
}

// ── Komponen indikator status ─────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    [STATUS.IDLE]: {
      color: "bg-neutral-200 text-neutral-500",
      dot: "bg-neutral-400",
      label: "Siap",
    },
    [STATUS.CONNECTING]: {
      color: "bg-yellow-100 text-yellow-700",
      dot: "bg-yellow-400",
      label: "Menghubungkan…",
    },
    [STATUS.ACTIVE]: {
      color: "bg-green-100 text-green-700",
      dot: "bg-green-500",
      label: "Live",
    },
    [STATUS.STOPPING]: {
      color: "bg-neutral-100 text-neutral-500",
      dot: "bg-neutral-400",
      label: "Menghentikan…",
    },
    [STATUS.ERROR]: {
      color: "bg-red-100 text-red-600",
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

// ── Halaman Terjemah ──────────────────────────────────────────
export default function Translate() {
  const {
    videoRef,
    canvasRef,
    status,
    translation,
    errorMsg,
    history,
    start,
    stop,
    isActive,
    isLoading,
  } = useTranslation();

  return (
    <div className="flex flex-col min-h-full">
      {/* ── HEADER ──────────────────────────────────────────── */}
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

      {/* ── KONTEN ──────────────────────────────────────────── */}
      <div className="flex-1 bg-neutral-50 px-4 py-4 flex flex-col gap-4">
        {/* Card utama kamera */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          {/* Header card */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-50">
            <div className="flex items-center gap-2 text-primary-600">
              <IconCamera className="w-4 h-4" />
              <span className="text-sm font-semibold text-primary-600">
                Terjemah dari Bahasa Isyarat ke Teks
              </span>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Viewport kamera */}
          <div
            className="relative w-full bg-neutral-900"
            style={{ aspectRatio: "4/3" }}
          >
            {/* Elemen video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              style={{ transform: "scaleX(-1)" }} // mirror selfie
            />

            {/* Canvas tersembunyi untuk capture frame */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay saat IDLE / CONNECTING */}
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                {/* Kotak panduan tangan */}
                <div
                  className="relative w-44 h-28 flex items-center justify-center"
                  style={{
                    border: "2px dashed rgba(255,255,255,0.5)",
                    borderRadius: 12,
                  }}
                >
                  {/* Sudut kotak */}
                  {[
                    "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                    "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                    "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                    "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                  ].map((cls, i) => (
                    <span
                      key={i}
                      className={`absolute w-4 h-4 border-white ${cls}`}
                    />
                  ))}

                  {/* Ikon kamera tengah */}
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    {isLoading ? (
                      <svg
                        className="animate-spin w-7 h-7 text-white"
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
                    ) : (
                      <IconCamera className="w-7 h-7 text-white" />
                    )}
                  </div>
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {isLoading ? "Membuka kamera…" : "Posisikan tangan di sini"}
                </p>
              </div>
            )}

            {/* Overlay scanning saat ACTIVE */}
            {isActive && (
              <>
                {/* Garis scan animasi */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-primary-400/60"
                  style={{ animation: "scan 2s ease-in-out infinite" }}
                />
                {/* Badge LIVE */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              </>
            )}

            {/* Error overlay */}
            {status === STATUS.ERROR && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900/80 px-6">
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-red-400"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-white text-xs text-center leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            )}
          </div>

          {/* Kotak hasil terjemahan */}
          <div className="px-4 py-3">
            <div
              className={`
                w-full min-h-[52px] rounded-xl border px-4 py-3
                flex items-center transition-all duration-300
                ${
                  translation
                    ? "border-primary-200 bg-primary-50"
                    : "border-neutral-200 bg-neutral-50"
                }
              `}
            >
              {translation ? (
                <p className="text-neutral-800 font-semibold text-base leading-snug w-full">
                  {translation}
                </p>
              ) : (
                <p className="text-neutral-400 text-sm italic">
                  Terjemahannya akan muncul di sini...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tombol aksi utama */}
        {!isActive ? (
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

        {/* Riwayat terjemahan */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-50">
              <div className="flex items-center gap-2">
                <IconWifi className="w-4 h-4 text-neutral-400" />
                <span className="text-sm font-semibold text-neutral-700">
                  Riwayat Sesi
                </span>
              </div>
              <span className="text-xs text-neutral-400">
                {history.length} kata
              </span>
            </div>
            <div className="divide-y divide-neutral-50 max-h-48 overflow-y-auto scrollbar-hide">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2.5 flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  <span className="text-neutral-700 text-sm font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animasi garis scan CSS */}
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
