import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useDarkMode } from "../../hooks/useDarkMode";

export default function AppLayout() {
  const dk = useDarkMode();

  return (
    <div className={`app-shell min-h-screen ${dk.page}`}>
      <main
        className={`
          flex-1 overflow-y-auto scrollbar-hide pb-20
          ${dk.page}
        `}
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
