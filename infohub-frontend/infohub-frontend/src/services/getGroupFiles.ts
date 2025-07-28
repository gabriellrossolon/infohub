import { API_ROUTES } from "../api/apiRoutes";

export async function getGroupFiles(token: string, groupId: number) {
  const response = await fetch(API_ROUTES.GROUP_FILES(groupId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    // Retorna array vazio se não tem arquivos
    return [];
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar arquivos do grupo");
  }

  return response.json();
}
