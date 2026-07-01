import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  FileText,
  ScanSearch,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLearning } from "../hooks/useLearning";
import { useDictionary } from "../hooks/useDictionary";

const QUICK_ACTIONS = [
  {
    id: "translate",
    label: "Terjemahkan Isyarat",
    desc: "Gunakan kamera untuk menerjemahkan bahasa isyarat secara langsung.",
    to: "/translate",
    icon: ScanSearch,
  },
];

// TODO: ganti dengan link Google Drive setelah Buku Panduan Aplikasi TEMANKU dibuat
const PANDUAN_URL =
  "https://drive.google.com/file/d/1HCHwnSw_Q8bBB6ev12VVxxRCxM-In84S/view?usp=sharing";

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
  const { quizzes } = useLearning();
  const { dictionary } = useDictionary();

  const userName = state.user?.name || "Pengguna";

  const totalDictionary = dictionary.length;
  const totalPaket = quizzes.length;
  const totalSoal = quizzes.reduce(
    (acc, q) => acc + (q.totalQuestions || 0),
    0,
  );

  const STATS = [
    {
      id: "dictionary",
      icon: <BookOpen className="w-7 h-7 text-yellow-200" strokeWidth={2.2} />,
      value: totalDictionary,
      label: "Kamus SIBI",
    },
    {
      id: "paket",
      icon: (
        <ClipboardList className="w-7 h-7 text-orange-300" strokeWidth={2.2} />
      ),
      value: totalPaket,
      label: "Paket Latihan",
    },
    {
      id: "soal",
      icon: (
        <FileQuestion className="w-7 h-7 text-emerald-300" strokeWidth={2.2} />
      ),
      value: totalSoal,
      label: "Soal Latihan",
    },
  ];

  return (
    <div className="flex flex-col min-h-full overflow-x-hidden transition-colors duration-300">
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
          Selamat datang, {userName}!
        </p>

        <div className="flex gap-2.5">
          {STATS.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </div>

      <div
        className={`flex-1 ${dk.page} pt-5 pb-24 flex flex-col gap-5 transition-colors duration-300`}
      >
        <section className="px-4">
          <h2 className={`font-bold ${dk.textPrimary} text-base mb-3`}>
            Aksi Cepat
          </h2>

          <div className="flex flex-col gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.to)}
                className={`${dk.card} border w-full flex items-center gap-4 p-5 rounded-3xl text-left active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(145deg,#3B7DFF,#1A5FE8)",
                    boxShadow: "0 6px 18px rgba(59,125,255,0.30)",
                  }}
                >
                  <action.icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`font-bold ${dk.textPrimary} text-base`}>
                    {action.label}
                  </p>

                  <p
                    className={`${dk.textSecondary} text-sm leading-relaxed mt-1`}
                  >
                    {action.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4">
          <a
            href={PANDUAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${dk.card} border rounded-3xl p-4 flex gap-3 items-start shadow-sm active:scale-[0.98] transition-all duration-150`}
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-500" strokeWidth={2.3} />
            </div>

            <div>
              <h3 className={`font-bold ${dk.textPrimary} text-sm mb-1`}>
                Baca Panduan
              </h3>
              <p className={`${dk.textSecondary} text-xs leading-relaxed`}>
                Pelajari cara menggunakan TEMANKU lebih lengkap lewat Buku
                Panduan Aplikasi.
              </p>
            </div>
          </a>
        </section>
      </div>
    </div>
  );
}
