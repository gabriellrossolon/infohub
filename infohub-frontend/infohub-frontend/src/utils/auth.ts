import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  userId?: string;
  companyId?: string;
  role?: string;
  [key: string]: any;
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

export const getTokenData = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};
