import { getTokenData } from "../utils/auth";

export async function getUserData(token: string) {
  const tokenData = getTokenData(token);
  if (!tokenData || !tokenData.userId || !tokenData.companyId) {
    throw new Error("Token inválido ou incompleto");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const userResponse = await fetch(`https://localhost:7103/api/v1/user/${tokenData.userId}`, { headers });
  if (!userResponse.ok) throw new Error("Erro ao buscar usuário");
  const user = await userResponse.json();

  const companyResponse = await fetch(`https://localhost:7103/api/v1/company/${tokenData.companyId}`, { headers });
  if (!companyResponse.ok) throw new Error("Erro ao buscar empresa");
  const company = await companyResponse.json();

  return {
    userId: user.id,
    userName: user.name,
    companyName: company.name,
  };
}
