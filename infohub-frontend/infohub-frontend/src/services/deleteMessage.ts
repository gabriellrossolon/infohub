import { API_ROUTES } from "../api/apiRoutes";

export async function deleteMessage(token: string, messageId: number) {
  const response = await fetch(API_ROUTES.MESSAGE_BY_ID(messageId), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar mensagem");
  }
}