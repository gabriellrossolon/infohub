import { getTokenData } from "../utils/auth";
import { API_ROUTES } from "../api/apiRoutes";

export async function getUserData(token: string) {
  const tokenData = getTokenData(token);
  if (!tokenData || !tokenData.userId || !tokenData.companyId) {
    throw new Error("Token inválido ou incompleto");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const userResponse = await fetch(API_ROUTES.USER_BY_ID(tokenData.userId), { headers });
  if (!userResponse.ok) throw new Error("Erro ao buscar usuário");
  const user = await userResponse.json();

  const companyResponse = await fetch(API_ROUTES.COMPANY_BY_ID(tokenData.companyId), { headers });
  if (!companyResponse.ok) throw new Error("Erro ao buscar empresa");
  const company = await companyResponse.json();

  return {
    userId: user.id,
    userName: user.name,
    companyName: company.name,
    companyId: company.id
  };
}
