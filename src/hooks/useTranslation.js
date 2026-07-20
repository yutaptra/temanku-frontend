import { useState, useEffect, useRef, useCallback } from "react";

const API_PREDICT_URL = import.meta.env.VITE_API_PREDICT_URL;
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
  const streamRef = useRef(null);
  const loopTimeoutRef = useRef(null);
  const isSendingRef = useRef(false);
  const isRunningRef = useRef(false); // guard untuk stop loop async

  const [status, setStatus] = useState(STATUS.IDLE);
  const [translation, setTranslation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const cleanupLoop = useCallback(() => {
    isRunningRef.current = false;
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
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
    cleanupLoop();
    cleanupCamera();
  }, [cleanupLoop, cleanupCamera]);

  // Ambil 1 frame dari video, convert ke Blob, POST ke /ml/predict
  const sendFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.readyState < 2) return;
    if (isSendingRef.current) return; // hindari request menumpuk

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 320;
    canvas.height = 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.4),
    );
    if (!blob) return;

    isSendingRef.current = true;
    try {
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      const res = await fetch(API_PREDICT_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server merespons dengan status ${res.status}`);
      }

      const data = await res.json();

      // TODO: sesuaikan dengan struktur response asli dari tim backend.
      // Asumsi sementara: { is_detected, prediction, confidence }
      if (data?.is_detected && data?.prediction) {
        setTranslation(data.prediction);
        setConfidence(data.confidence ?? null);
      } else {
        setTranslation("");
        setConfidence(null);
      }

      if (status !== STATUS.ACTIVE) setStatus(STATUS.ACTIVE);
    } catch (err) {
      setErrorMsg(`Gagal menghubungi server prediksi: ${err.message}`);
      setStatus(STATUS.ERROR);
    } finally {
      isSendingRef.current = false;
    }
  }, [status]);

  // Loop kirim frame tiap FRAME_INTERVAL_MS, menunggu response sebelum jadwalkan berikutnya
  const runLoop = useCallback(() => {
    if (!isRunningRef.current) return;
    sendFrame().finally(() => {
      if (isRunningRef.current) {
        loopTimeoutRef.current = setTimeout(runLoop, FRAME_INTERVAL_MS);
      }
    });
  }, [sendFrame]);

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
      setStatus(STATUS.ACTIVE);

      isRunningRef.current = true;
      runLoop();
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
  }, [runLoop, cleanupAll]);

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
