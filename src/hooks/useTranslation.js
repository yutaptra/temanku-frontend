import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = import.meta.env.VITE_WS_PREDICT_URL;
const FRAME_INTERVAL_MS = 500;

export const STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  ACTIVE: "active",
  STOPPING: "stopping",
  ERROR: "error",
};

export function useTranslation() {
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
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  }, []);

  const cleanupAll = useCallback(() => {
    cleanupWebSocket();
    cleanupCamera();
  }, [cleanupWebSocket, cleanupCamera]);

  const sendFrame = useCallback(() => {
    const video = videoRef.current,
      canvas = canvasRef.current,
      ws = wsRef.current;
    if (!video || !canvas || !ws || ws.readyState !== WebSocket.OPEN) return;
    if (video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 320;
    canvas.height = 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ws.send(canvas.toDataURL("image/jpeg", 0.4).split(",")[1]);
  }, []);

  const start = useCallback(async () => {
    setErrorMsg("");
    setTranslation("");
    setConfidence(null);
    setStatus(STATUS.CONNECTING);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
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
          const { data } = JSON.parse(event.data);
          if (data?.is_detected && data?.prediction) {
            setTranslation(data.prediction);
            setConfidence(data.confidence ?? null);
          } else {
            setTranslation("");
            setConfidence(null);
          }
        } catch {
          const text = String(event.data).trim();
          if (text) {
            setTranslation(text);
            setConfidence(null);
          }
        }
      };

      ws.onerror = () => {
        setErrorMsg("Koneksi ke server gagal. Kamera tetap aktif.");
        setStatus(STATUS.ERROR);
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
    setStatus(STATUS.IDLE);
    setErrorMsg("");
    setTranslation("");
    setConfidence(null);
  }, [cleanupAll]);

  useEffect(() => () => cleanupAll(), [cleanupAll]);

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
