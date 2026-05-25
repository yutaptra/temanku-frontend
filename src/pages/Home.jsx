import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";

const USER_NAME = "Yusri Afta";
const STATS = [
  {
    id: "streak",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
        <path
          d="M17.657 18.657A8 8 0 0 1 6.343 7.343"
          stroke="#FBBF24"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 3c0 0-4 4-4 8a4 4 0 0 0 8 0c0-1.5-.5-3-1.5-4.5"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="15" r="2" fill="#FCD34D" />
      </svg>
    ),
    value: 7,
    label: "Rentetan Hari",
  },
  {
    id: "target",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#34D399" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" stroke="#34D399" strokeWidth="2" />
        <circle cx="12" cy="12" r="1.5" fill="#34D399" />
      </svg>
    ),
    value: 15,
    label: "Target Tercapai",
  },
  {
    id: "translate",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
        <path
          d="M8 21l3-3-3-3"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10V3l3 3-3 3"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="9"
          y="11"
          width="12"
          height="10"
          rx="1"
          stroke="#FCD34D"
          strokeWidth="2"
        />
      </svg>
    ),
    value: 50,
    label: "Terjemahan",
  },
];

const DAILY_TARGET = { current: 10, total: 15 };
const DAILY_PCT = Math.round((DAILY_TARGET.current / DAILY_TARGET.total) * 100);

function StatCard({ icon, value, label }) {
  return (
    <div
      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.28)",
      }}
    >
      {icon}
      <span className="text-white font-display font-bold text-xl leading-none">
        {value}
      </span>
      <span className="text-blue-100 text-[11px] font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const dk = useDarkMode();

  return (
    <div className={`flex flex-col min-h-full transition-colors duration-300`}>
      {/* Header — selalu biru, tidak berubah */}
      <div
        className="relative px-4 pt-12 pb-10"
        style={{
          background:
            "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.07)",
            transform: "translate(30%,-30%)",
          }}
        />
        <h1 className="font-display font-extrabold text-white text-3xl tracking-tight leading-none mb-1">
          TEMANKU
        </h1>
        <p className="text-blue-100 text-sm font-medium mb-6">
          Selamat datang, {USER_NAME}!
        </p>
        <div className="flex gap-2.5">
          {STATS.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </div>

      {/* Konten */}
      <div
        className={`flex-1 ${dk.page} pt-5 pb-8 flex flex-col gap-5 transition-colors duration-300`}
      >
        {/* Target Harian */}
        <div
          className={`mx-4 rounded-2xl ${dk.card} shadow-sm border p-4 transition-colors duration-300`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full ${dk.isDark ? "bg-primary-900/40" : "bg-blue-50"} flex items-center justify-center flex-shrink-0`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill="#3B7DFF"
                  stroke="#3B7DFF"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`font-semibold ${dk.textPrimary} text-sm`}>
                  Target Harian
                </span>
                <span className="font-bold text-primary-600 text-sm">
                  {DAILY_PCT}%
                </span>
              </div>
              <p className={`${dk.textSecondary} text-xs mb-3`}>
                {DAILY_TARGET.current}/{DAILY_TARGET.total} isyarat yang
                diterjemahkan
              </p>
              <div
                className={`h-2 ${dk.isDark ? "bg-neutral-700" : "bg-neutral-100"} rounded-full overflow-hidden`}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${DAILY_PCT}%`,
                    background: "linear-gradient(90deg,#3B7DFF,#1A5FE8)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aksi Cepat */}
        <div className="px-4">
          <h2 className={`font-bold ${dk.textPrimary} text-base mb-3`}>
            Aksi Cepat
          </h2>
          <div className="flex gap-3">
            {[
              {
                label: "Mulai Terjemah",
                to: "/translate",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                ),
              },
              {
                label: "Latihan SIBI",
                to: "/learning",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
            ].map(({ label, to, icon }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="flex-1 flex flex-col items-center justify-center gap-3 py-5 rounded-2xl font-semibold text-white text-sm active:scale-95 transition-transform duration-150"
                style={{
                  background: "linear-gradient(145deg,#3B7DFF,#1A5FE8)",
                  boxShadow: "0 4px 16px rgba(59,125,255,0.35)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {icon}
                </div>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
