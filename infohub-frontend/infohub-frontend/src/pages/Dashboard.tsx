import ToRegisterButton from "../fixed-components/ToRegisterButton";
import LogoutButton from "../fixed-components/LogoutButton";
import { useEffect, useState } from "react";
import { getMyEnterprises } from "../services/getMyEnterprises";

const Dashboard = () => {
  const [enterprises, setEnterprises] = useState([]);

  useEffect(() => {
    const fetchEnterprises = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await getMyEnterprises(token);
        setEnterprises(data);
      } catch (error) {
        console.error("Erro ao buscar enterprises:", error);
      }
    };

    fetchEnterprises();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <LogoutButton></LogoutButton>
      <ToRegisterButton></ToRegisterButton>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-bold text-white">Minhas Enterprises</h1>
        {enterprises.length === 0 ? (
          <p className="text-gray-300">Nenhuma enterprise encontrada.</p>
        ) : (
          enterprises.map((enterprise: any) => (
            <div
              key={enterprise.id}
              className="bg-gray-100 rounded p-2 w-full max-w-md shadow"
            >
              <p className="font-semibold">{enterprise.name}</p>
              <p className="text-sm text-white">
                Criada em:{" "}
                {new Date(enterprise.creationDate).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
