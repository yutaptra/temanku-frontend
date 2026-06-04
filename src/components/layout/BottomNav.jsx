import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, GraduationCap, Home, Languages, User } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

const iconClass = "w-5 h-5";

const NAV_ITEMS = [
  { to: "/home", label: "Beranda", Icon: Home },
  { to: "/translate", label: "Terjemah", Icon: Languages },
  { to: "/dictionary", label: "Kamus", Icon: BookOpen },
  { to: "/learning", label: "Belajar", Icon: GraduationCap },
  { to: "/profile", label: "Profil", Icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const dk = useDarkMode();

  return (
    <nav
      className={`
        safe-bottom fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-mobile z-50
        border-t transition-colors duration-300
        ${dk.nav}
      `}
    >
      <div className="grid grid-cols-5 items-center px-1 pt-1.5 pb-2">
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
              <Icon className={iconClass} strokeWidth={2} />

              <span className="text-[10px] font-medium leading-tight">
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
