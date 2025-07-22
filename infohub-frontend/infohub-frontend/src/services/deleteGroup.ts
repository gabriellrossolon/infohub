import { API_ROUTES } from "../api/apiRoutes";

export async function deleteGroup(token: string, groupId: number) {
  const response = await fetch(API_ROUTES.GROUP_BY_ID(groupId), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar grupo");
  }
}