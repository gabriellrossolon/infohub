export const getMyEnterprises = async (token: string) => {
  const response = await fetch("https://localhost:7103/api/v1/enterprise/my-enterprises", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar enterprises");
  }

  return response.json();
};