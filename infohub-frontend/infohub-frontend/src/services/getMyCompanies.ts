export async function getMyCompanies(token: string, companieId: number) {
  const response = await fetch(`https://localhost:7103/api/v1/company/${companieId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar companias");
  }

  return response.json();
}