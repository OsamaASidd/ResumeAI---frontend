// src/pages/auth/welcome.tsx
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/endpoints/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["get-database-sync-status"],
    queryFn: authApi.getDatabaseSyncStatus,
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 1000;
    },
  });

  useEffect(() => {
    if (data?.isSynced) {
      navigate("/profile");
    }
  }, [data, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-4 h-8 w-8 animate-spin">⟳</div>
        <p className="text-lg">Syncing your account data, please wait...</p>
      </div>
    </div>
  );
};

export default WelcomePage;