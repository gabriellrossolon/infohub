import { API_ROUTES } from "../api/apiRoutes";

export async function getMyCompanies(token: string, companyId: number) {
  const response = await fetch(API_ROUTES.COMPANY_BY_ID(companyId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar companias");
  }

  return response.json();
}