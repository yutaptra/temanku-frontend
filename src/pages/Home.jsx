import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { BookOpen, Flame, Languages, Monitor, Target, Zap } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

const STATS = [
  {
    id: "streak",
    icon: <Flame className="w-7 h-7 text-yellow-300" strokeWidth={2.2} />,
    value: 7,
    label: "Rentetan Hari",
  },
  {
    id: "target",
    icon: <Target className="w-7 h-7 text-emerald-300" strokeWidth={2.2} />,
    value: 15,
    label: "Target Tercapai",
  },
  {
    id: "translate",
    icon: <Languages className="w-7 h-7 text-yellow-200" strokeWidth={2.2} />,
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
  const { state } = useApp();

  const USER_NAME = state.user?.name || "Pengguna";

  return (
    <div
      className="
        flex flex-col min-h-full overflow-x-hidden
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div
        className="relative px-4 pt-12 pb-10"
        style={{
          background:
            "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
        }}
      >
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

      {/* Content */}
      <div
        className={`flex-1 ${dk.page} pt-5 pb-8 flex flex-col gap-5 transition-colors duration-300`}
      >
        {/* Target Harian */}
        <div
          className={`mx-4 rounded-2xl ${dk.card} shadow-sm border p-4 transition-colors duration-300`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full ${
                dk.isDark ? "bg-primary-900/40" : "bg-blue-50"
              } flex items-center justify-center flex-shrink-0`}
            >
              <Zap
                className="w-5 h-5 text-primary-500"
                fill="#3B7DFF"
                strokeWidth={2}
              />
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
                className={`h-2 ${
                  dk.isDark ? "bg-neutral-700" : "bg-neutral-100"
                } rounded-full overflow-hidden`}
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
                  <Monitor className="w-6 h-6 text-white" strokeWidth={2} />
                ),
              },
              {
                label: "Latihan SIBI",
                to: "/learning",
                icon: (
                  <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
                ),
              },
            ].map(({ label, to, icon }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="
                  flex-1 flex flex-col items-center justify-center gap-3
                  py-5 rounded-2xl font-semibold text-white text-sm
                  active:scale-95 transition-transform duration-150
                "
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
