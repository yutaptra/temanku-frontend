import {
  Camera,
  Languages,
  Square,
  LoaderCircle,
  Lightbulb,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useTranslation, STATUS } from "../hooks/useTranslation";

const STATUS_CONFIG = {
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

// ─── Sub-components ───────────────────────────────────────────

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG[STATUS.IDLE];
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

function TranslationBox({ translation, confidence, dk }) {
  const confidencePercent =
    typeof confidence === "number" ? Math.round(confidence * 100) : null;
  return (
    <div
      className={`w-full min-h-[58px] rounded-xl border px-4 py-3 flex items-center transition-all duration-300 ${
        translation
          ? dk.isDark
            ? "border-blue-800 bg-blue-950/40"
            : "border-blue-200 bg-blue-50"
          : dk.isDark
            ? "border-neutral-700 bg-neutral-800"
            : "border-neutral-200 bg-neutral-50"
      }`}
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
  );
}

// ─── Main ──────────────────────────────────────────────────────

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
    isLoading,
  } = useTranslation();
  const dk = useDarkMode();

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
              <Camera className="w-4 h-4" />
              <span className={`text-sm font-semibold ${dk.textPrimary}`}>
                Terjemah dari Bahasa Isyarat ke Teks
              </span>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="px-4 pt-4">
            <div className="relative w-full mx-auto h-[300px] sm:h-[340px] md:h-[360px] max-w-[500px] bg-neutral-900 rounded-2xl overflow-hidden">
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
                  <Camera className="w-7 h-7 text-white" />
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
            <TranslationBox
              translation={translation}
              confidence={confidence}
              dk={dk}
            />
          </div>
        </div>

        {!isCameraActive ? (
          <button
            onClick={start}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:active:scale-100"
            style={{
              background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
              boxShadow: "0 4px 16px rgba(23,106,195,0.4)",
            }}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Menghubungkan...
              </>
            ) : (
              <>
                <Languages className="w-5 h-5" />
                Mulai Penerjemahan
              </>
            )}
          </button>
        ) : (
          <button
            onClick={stop}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white text-sm transition-all duration-200 active:scale-95 bg-red-500 hover:bg-red-600"
            style={{
              boxShadow: "0 4px 16px rgba(239,68,68,0.35)",
            }}
          >
            <Square className="w-4 h-4 fill-current" />
            Akhiri Penerjemahan
          </button>
        )}

        <div
          className={`${dk.card} border rounded-3xl p-4 flex gap-3 items-start shadow-sm`}
        >
          <div className="w-10 h-10 rounded-2xl bg-yellow-100 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-yellow-500" strokeWidth={2.3} />
          </div>

          <div>
            <h3 className={`font-bold ${dk.textPrimary} text-sm mb-1`}>
              Tips Terjemah
            </h3>

            <p className={`${dk.textSecondary} text-xs leading-relaxed`}>
              Gunakan kamera di tempat terang dan pastikan tangan terlihat jelas
              agar hasil deteksi lebih akurat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
