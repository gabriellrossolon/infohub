export async function getGroupMessages(token: string, groupId: number) {
  const response = await fetch(`https://localhost:7103/api/v1/message/group/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar mensagens do grupo");
  }

  return response.json();
}