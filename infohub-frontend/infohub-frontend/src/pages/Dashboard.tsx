import ToRegisterButton from "../fixed-components/ToRegisterButton";
import LogoutButton from "../fixed-components/LogoutButton";
import { useEffect, useState } from "react";
import { getMyGroups } from "../services/getMyGroups";
const Dashboard = () => {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await getMyGroups(token);
        setGroups(data);
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <LogoutButton />
      <ToRegisterButton />
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-bold text-white">Meus Grupos</h1>
        {groups.length === 0 ? (
          <p className="text-gray-300">Nenhum grupo encontrado.</p>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-gray-100 rounded p-2 w-full max-w-md shadow"
            >
              <p className="font-semibold">{group.name}</p>
              {/* Se quiser mostrar mais info do group, coloque aqui */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
