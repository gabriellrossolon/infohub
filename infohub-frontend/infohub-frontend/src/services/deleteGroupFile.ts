import { API_ROUTES } from "../api/apiRoutes";

export async function deleteGroupFile(token: string, groupId: number, fileName: string) {
  const url = API_ROUTES.GROUP_FILE_BY_NAME(groupId, encodeURIComponent(fileName));

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar arquivo");
  }
}