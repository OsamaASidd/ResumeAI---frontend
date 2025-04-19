
/**
 * 
 * header
 * sidebar
 * children
 */


import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";
import Sidebar from "./side-bar";
import { useState } from "react";
import { ROUTE_CONSTANTS } from "../../routes/route-constants";

const AppLayout = () => {
  const location = useLocation();
  const [ showSidebar , setShowSidebar] = useState(false);
  const shouldHideSidebar = location.pathname === ROUTE_CONSTANTS.MARKET_PLACE;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
      {!shouldHideSidebar && <Sidebar isOpen={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />}

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
