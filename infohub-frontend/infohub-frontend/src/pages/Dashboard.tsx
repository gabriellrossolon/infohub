import { useEffect, useState } from "react";
import { getMyGroups } from "../services/getMyGroups";
import { isTokenValid } from "../utils/auth";
import { getUserData } from "../services/getUserData";
import LogoutButton from "../fixed-components/LogoutButton";

import { FiSettings, FiLogOut, FiMessageSquare } from "react-icons/fi"; // Feather Icons
import ToRegisterButton from "../fixed-components/ToRegisterButton";

const Dashboard = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !isTokenValid(token)) {
        setError("Usuário não autenticado");
        return;
      }

      try {
        // Busca nomes do usuário e empresa
        const { userName, companyName } = await getUserData(token);
        setUserName(userName);
        setCompanyName(companyName);

        // Busca grupos
        const data = await getMyGroups(token);
        setGroups(data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados do usuário");
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="grid grid-cols-3">
      {/* Seção de seleção de grupos e opções */}
      <div className="col-span-1 h-screen bg-black/50 text-white border-r-1 border-white/20 flex">
        {/* Barra de opções */}
        <div className="bg-black/70 flex flex-col items-center justify-between p-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <FiMessageSquare className="text-3xl text-gray-200 cursor-pointer"></FiMessageSquare>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <FiSettings className="text-3xl text-gray-200 cursor-pointer"></FiSettings>
            <FiLogOut className="text-3xl text-red-500 cursor-pointer"></FiLogOut>
          </div>
        </div>
        {/* Seleção de grupos */}
        <div>
          <div className="flex flex-col items-center justify-center border-b-1 border-white/20 p-1">
            <h1 className="text-3xl font-bold">{companyName.toUpperCase()}</h1>
            <h1 className="text-gray-200">{userName.toUpperCase()}</h1>
          </div>
          <div>
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-start gap-2 p-1 m-2 rounded-xl cursor-pointer hover:bg-black/30"
              >
                <img src="user.png" alt="Foto do Grupo" className="max-h-16" />
                <div className="flex flex-col">
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-gray-300">
                    Gabriell: Olá pessoas! Isto é uma mensagem...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Seção de mensagens */}
      <div className="col-span-2">
        <LogoutButton></LogoutButton>
        <ToRegisterButton></ToRegisterButton>
      </div>
    </div>
  );
};

export default Dashboard;
