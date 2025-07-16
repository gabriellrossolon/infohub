import { API_ROUTES } from "../api/apiRoutes";

export async function getCompanies(token: string) {
  const response = await fetch(API_ROUTES.COMPANY, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar companias");
  }

  return response.json();
}