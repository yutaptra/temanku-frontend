import { NavLink, useLocation } from "react-router-dom";

// ── SVG Icons inline (tanpa dependency tambahan) ─────────────
const HomeOutline = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[22px] h-[22px]"
  >
    <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
  </svg>
);
const HomeSolid = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
    <path
      d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0
      1.06-1.061l-8.69-8.69a2.25 2.25 0 0 0-3.18 0l-8.69 8.69a.75.75
      0 1 0 1.06 1.06l8.69-8.689Z"
    />
    <path
      d="m12 5.432 8.16 8.159c.03.03.06.058.091.086v6.198c0
      1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75
      0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0
      1-.75.75H5.625A1.875 1.875 0 0 1 3.75 19.875v-6.198l.091-.086L12
      5.432Z"
    />
  </svg>
);

const BookOutline = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[22px] h-[22px]"
  >
    <path
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168
      5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5
      1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477
      4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746
      0-3.332.477-4.5 1.253"
    />
  </svg>
);
const BookSolid = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
    <path
      d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0
      0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1
      .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25
      1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966
      0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0
      0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0
      0-5.25 1.533v16.103Z"
    />
  </svg>
);

const TranslateOutline = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[22px] h-[22px]"
  >
    <path
      d="M3 5h8M7 3v2m4 0A14.28 14.28 0 0 1 9.3 11M3 5a14.28
      14.28 0 0 0 2 6.3M9.3 11a14.41 14.41 0 0 1-3 2.2M9.3
      11A14.41 14.41 0 0 0 12 13"
    />
    <path d="m14 21 1.5-4m0 0L17 13l1.5 4m-3 0h3m3 4-6-13" />
  </svg>
);

const GradCapOutline = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[22px] h-[22px]"
  >
    <path
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.63
      48.63 0 0 1 12 20.904a48.63 48.63 0 0 1 8.232-4.41 60.46
      60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0
      0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903
      0 0 1 10.399 5.84 50.621 50.621 0 0
      0-2.658.814m-15.482 0A50.717 50.717 0 0 1 12
      13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1
      0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1
      12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75
      15.75v-1.5"
    />
  </svg>
);
const GradCapSolid = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
    <path
      d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1
      22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0
      0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707
      0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614
      54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129
      56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859
      1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0
      1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z"
    />
    <path
      d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134
      1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878
      47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877
      47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4
      48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0
      0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434
      1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0
      0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25
      2.25 0 0 0 2.12 0Z"
    />
  </svg>
);

const UserOutline = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[22px] h-[22px]"
  >
    <path
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5
      0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"
    />
  </svg>
);
const UserSolid = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5
      0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0
      0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786
      0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);

// ── Config tab ────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    to: "/home",
    label: "Beranda",
    Outline: HomeOutline,
    Solid: HomeSolid,
  },
  {
    to: "/dictionary",
    label: "Kamus",
    Outline: BookOutline,
    Solid: BookSolid,
  },
  {
    to: "/translate",
    label: "Terjemah",
    Outline: TranslateOutline,
    Solid: TranslateOutline, // CTA pakai outline, di-highlight via bg
    isCTA: true,
  },
  {
    to: "/learning",
    label: "Belajar",
    Outline: GradCapOutline,
    Solid: GradCapSolid,
  },
  {
    to: "/profile",
    label: "Profil",
    Outline: UserOutline,
    Solid: UserSolid,
  },
];

export default function BottomNav() {
  const location = useLocation();

  // Sembunyikan Bottom Nav di halaman Setelan
  // (akses dari Profil, bukan tab sendiri)
  const hideOn = ["/settings"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav
      className="
        safe-bottom fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-mobile z-50
        bg-white/90 backdrop-blur-md
        border-t border-neutral-100
      "
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ to, label, Outline, Solid, isCTA }) => {
          const isActive = location.pathname === to;

          if (isCTA) {
            return (
              <NavLink
                key={to}
                to={to}
                className="
                  relative -top-4 flex flex-col items-center justify-center
                  w-14 h-14 rounded-full shadow-lg transition-transform
                  active:scale-95
                  bg-primary-600 text-white
                  shadow-primary-300/60
                "
                style={
                  isActive
                    ? {
                        boxShadow:
                          "0 0 0 4px #bfdbfe, 0 8px 24px rgba(59,130,246,0.35)",
                      }
                    : {}
                }
              >
                <Outline />
              </NavLink>
            );
          }

          return (
            <NavLink
              key={to}
              to={to}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1
                rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "text-primary-600"
                    : "text-neutral-400 active:text-neutral-600"
                }
              `}
            >
              {isActive ? <Solid /> : <Outline />}
              <span
                className={`
                  text-[10px] font-semibold leading-tight
                  ${isActive ? "text-primary-600" : "text-neutral-400"}
                `}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
