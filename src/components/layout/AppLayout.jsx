import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
