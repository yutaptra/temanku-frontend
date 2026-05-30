import { NavLink, useLocation } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";

const iconClass = "w-[22px] h-[22px]";

const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
  >
    <path d="M3 12L12 3l9 9" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const TranslateIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
  >
    <path d="M4 5h7" />
    <path d="M7.5 3v2" />
    <path d="M10.5 5c-.7 2.3-2.1 4.3-4.2 6" />
    <path d="M5 8c1.2 2 2.8 3.5 5 4.5" />
    <path d="M15 19l3-8 3 8" />
    <path d="M16 16h4" />
  </svg>
);

const BookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
  >
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
    <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5v-16Z" />
  </svg>
);

const LearningIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
  >
    <path d="M22 10L12 5 2 10l10 5 10-5Z" />
    <path d="M6 12.5V17c1.8 1.4 3.8 2 6 2s4.2-.6 6-2v-4.5" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
  >
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const NAV_ITEMS = [
  { to: "/home", label: "Beranda", Icon: HomeIcon },
  { to: "/translate", label: "Terjemah", Icon: TranslateIcon },
  { to: "/dictionary", label: "Kamus", Icon: BookIcon },
  { to: "/learning", label: "Belajar", Icon: LearningIcon },
  { to: "/profile", label: "Profil", Icon: UserIcon },
];

export default function BottomNav() {
  const location = useLocation();
  const dk = useDarkMode();

  const hideOn = ["/settings"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav
      className={`
        safe-bottom fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-mobile z-50
        border-t transition-colors duration-300
        ${dk.nav}
      `}
    >
      <div className="grid grid-cols-5 items-center px-1 pt-2 pb-3">
        {NAV_ITEMS.map(({ to, label, Icon }) => {
          const isActive = location.pathname === to;

          return (
            <NavLink
              key={to}
              to={to}
              className={`
    flex flex-col items-center justify-center gap-0.5
    rounded-xl py-1 transition-all duration-200 active:scale-95
    ${isActive ? dk.navActive : dk.navInactive}
  `}
            >
              <Icon />
              <span className="text-[11px] font-semibold leading-tight">
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
