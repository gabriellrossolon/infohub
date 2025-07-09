import { useEffect, useState } from "react";
import { getMyGroups } from "../services/getMyGroups";
import { isTokenValid } from "../utils/auth";
import { getUserData } from "../services/getUserData";
import LogoutButton from "../fixed-components/LogoutButton";

import ToRegisterButton from "../fixed-components/ToRegisterButton";
import ToDashboardButton from "../fixed-components/ToDashboardButton";
import ToSettingsButton from "../fixed-components/ToSettingsButton";

const Dashboard = () => {
  //Exibições no lado esquerdo (grupos e opções)
  const [groups, setGroups] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");

  //Exibições no lado direito (overview e mensagens)
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !isTokenValid(token)) return;

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
        <div className="bg-black/70 flex flex-col items-center justify-between p-1">
          <div className="flex flex-col items-center justify-center gap-2">
            <ToDashboardButton></ToDashboardButton>
            <ToRegisterButton></ToRegisterButton>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <ToSettingsButton></ToSettingsButton>
            <LogoutButton></LogoutButton>
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
                onClick={() => setSelectedGroup(group)}
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
      <div className="col-span-2 h-screen flex flex-col">
        {/* Header do grupo */}
        {selectedGroup ? (
          <div className="flex flex-col h-full">
            <div className="p-1 flex items-center justify-start gap-2 bg-black/50 rounded-full">
              <img src="user.png" alt="Group Image" className="max-w-16" />
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white">
                  {selectedGroup.name}
                </h2>
                <p className="text-gray-400">
                  clique para mostrar dados do grupo
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 ">
              <div className="flex items-end bg-gray-700 w-fit rounded-md gap-2 py-0 px-1">
                <p className="text-gray-200 py-1 px-2">
                  Eu sou uma mensagem
                </p>
                <span className="text-gray-400 text-sm">14:35</span>
              </div>
            </div>

            <div className="p-2 border-t border-white/10 bg-black/50 flex items-center gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 py-2 px-4 rounded-full bg-white/60 text-black"
              />
              <button className="bg-green-500 text-white px-4 py-2 rounded-xl">
                Enviar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className=" text-gray-300">
              Selecione um grupo para visualizar as mensagens
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
