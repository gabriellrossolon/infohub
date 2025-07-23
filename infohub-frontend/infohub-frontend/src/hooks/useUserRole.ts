// hooks/useUserRole.ts
import { useEffect, useState } from "react";
import { getTokenData, getValidToken } from "../utils/auth"; // ajuste o caminho conforme seu projeto

export function useUserRole(): string | null {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getValidToken();
    if (!token) return;

    const data = getTokenData(token);
    setUserRole(data?.role ?? null);
  }, []);

  return userRole;
}
