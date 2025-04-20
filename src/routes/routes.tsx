// src/routes/routes.tsx
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
import SignInPage from "../pages/auth/sign-in";
import SignUpPage from "../pages/auth/sign-up";
import WelcomePage from "../pages/auth/welcome";
import ProfilePage from "../pages/profile";
import ProfileCreatePage from "../pages/profile/create";
import ProfileEditPage from "../pages/profile/edit";
import { ProtectedRoute } from "../auth/protected-route";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes (outside main layout) */}
      <Route path={ROUTE_CONSTANTS.SIGN_IN} element={<SignInPage />} />
      <Route path={ROUTE_CONSTANTS.SIGN_UP} element={<SignUpPage />} />
      <Route path={ROUTE_CONSTANTS.WELCOME} element={<WelcomePage />} />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTE_CONSTANTS.HOME} />} />
        <Route path={ROUTE_CONSTANTS.HOME} element={<HomePage />} />
        <Route path={ROUTE_CONSTANTS.MARKET_PLACE} element={<MarketPlacePage />} />
        <Route path={ROUTE_CONSTANTS.NEW_RESUME} element={<NewresumePage />} />
        <Route path={ROUTE_CONSTANTS.ENHANCE_RESUME} element={<EnhanceResumePage />} />
        <Route path={ROUTE_CONSTANTS.UPLOAD_FILES} element={<UploadfilePage />} />
        <Route path={ROUTE_CONSTANTS.AI_CHAT} element={<AiChatPage />} />
        <Route path={ROUTE_CONSTANTS.SETTINGS} element={<SettingsPage />} />
        
        {/* Profile routes */}
        <Route path={ROUTE_CONSTANTS.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTE_CONSTANTS.PROFILE_CREATE} element={<ProfileCreatePage />} />
        <Route path={`${ROUTE_CONSTANTS.PROFILE_EDIT}/:id`} element={<ProfileEditPage />} />
      </Route>
    </Routes>
  );
};