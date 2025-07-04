export async function getMyGroups(token: string) {
  const response = await fetch("https://localhost:7103/api/v1/group/my-groups", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar grupos");
  }

  return response.json();
}