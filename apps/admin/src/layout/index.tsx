// components/layout/AdminLayout.tsx
import { Outlet } from "@tanstack/react-router";
import { AppDock } from "./app-dock";

const AdminLayout = () => {
    return (
        <main className="fixed inset-0 flex flex-col items-center justify-end bg-linear-to-b from-blue-400 to-blue-600 pb-4">
            {/* The Outlet renders the Dashboard content */}
            <div className="flex w-full flex-1 items-center justify-center overflow-hidden">
                <Outlet />
            </div>
            <AppDock />
        </main>
    );
};

export default AdminLayout;
