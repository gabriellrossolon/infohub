import { API_ROUTES } from "../api/apiRoutes";

export async function getMyGroups(token: string) {
  const response = await fetch(API_ROUTES.MY_GROUPS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar grupos");
  }

  return response.json();
}