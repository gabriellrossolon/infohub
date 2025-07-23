import { API_ROUTES } from "../api/apiRoutes";

export async function getUserDataById(token: string, userId : number) {
  const response = await fetch(API_ROUTES.USER_BY_ID(userId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar companias");
  }

  return response.json();
}