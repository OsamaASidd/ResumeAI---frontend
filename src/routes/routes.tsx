import AppLayout from "../components/layout/app-layout";
import AiChatPage from "../pages/ai-chat";
import EnhanceResumePage from "../pages/enhance-resume";
import NewresumePage from "../pages/new-resume";
import SettingsPage from "../pages/settings";
import HomePage from "../pages/home";
import UploadfilePage from "../pages/upload-files";
import { ROUTE_CONSTANTS } from "./route-constants";
import { Route, Routes, Navigate } from "react-router-dom";
import MarketPlacePage from "../pages/market-place";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to={ROUTE_CONSTANTS.HOME} />} />
        <Route path={ROUTE_CONSTANTS.HOME} element={<HomePage />} />

        <Route
          path={ROUTE_CONSTANTS.MARKET_PLACE}
          element={<MarketPlacePage />}
        />

        <Route path={ROUTE_CONSTANTS.NEW_RESUME} element={<NewresumePage />} />
        <Route
          path={ROUTE_CONSTANTS.ENHANCE_RESUME}
          element={<EnhanceResumePage />}
        />
        <Route
          path={ROUTE_CONSTANTS.UPLOAD_FILES}
          element={<UploadfilePage />}
        />
        <Route path={ROUTE_CONSTANTS.AI_CHAT} element={<AiChatPage />} />
        <Route path={ROUTE_CONSTANTS.SETTINGS} element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};
