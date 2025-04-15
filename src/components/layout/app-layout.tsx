
/**
 * 
 * header
 * sidebar
 * children
 */


import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./side-bar";

const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col font-[--font-primary] bg-[--color-primary] text-[--color-text]">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
