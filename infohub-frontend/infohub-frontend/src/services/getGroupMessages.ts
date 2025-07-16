import { API_ROUTES } from "../api/apiRoutes";

export async function getGroupMessages(token: string, groupId: number) {
  const response = await fetch(API_ROUTES.GROUP_MESSAGES(groupId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar mensagens do grupo");
  }

  return response.json();
}