import { useEffect, useState, useRef } from "react";
import { getMyGroups } from "../services/getMyGroups";
import { isTokenValid } from "../utils/auth";
import { getUserData } from "../services/getUserData";
import LogoutButton from "../fixed-components/LogoutButton";

import ToRegisterButton from "../fixed-components/ToRegisterButton";
import ToDashboardButton from "../fixed-components/ToDashboardButton";
import ToSettingsButton from "../fixed-components/ToSettingsButton";
import { getGroupMessages } from "../services/getGroupMessages";
import SelectFormField from "../components/SelectFormField";
import { BiMessageAdd } from "react-icons/bi";
import CreateGroup from "./CreateGroup";

const Dashboard = () => {
  //Exibições no lado esquerdo (grupos e opções)
  const [groups, setGroups] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");

  //Exibições no lado direito (overview e mensagens)
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [groupMessages, setGroupMessages] = useState<any[]>([]);

  const [availeMessageCategories, setAvaibleMessageCategories] = useState<
    string[]
  >([]);
  const [selectedMessageCategory, setSelectedMessageCategory] =
    useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");

  //Controles gerais
  const [creatingNewGroup, setCreatingNewGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSetCreatingGroup = () => {
    setSelectedGroup("");
    setCreatingNewGroup(!creatingNewGroup);
  };

  const handleCreateNewGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) return;

    if (!newGroupName) {
      return;
    }

    const userData = await getUserData(token);

    const groupData = {
      name: newGroupName,
      companyId: userData.companyId,
    };

    try {
      const response = await fetch("https://localhost:7103/api/v1/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar novo grupo.");
      }

      setNewGroupName("");
      setCreatingNewGroup(false);

      const data = await getMyGroups(token);
      setGroups(data);
      
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleSelectGroup = async (group: any) => {
    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) return;

    setSelectedGroup(group);
    setCreatingNewGroup(false);

    try {
      // Busca mensagens do grupo selecionado
      const data = await getGroupMessages(token, group.id);
      setGroupMessages(data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar mensagens do grupo");
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) return;

    if (!inputMessage || inputMessage === "") {
      alert("Não é possivel enviar mensagem sem conteúdo!");
      return;
    }

    const userData = await getUserData(token);

    const messageData = {
      groupId: selectedGroup.id,
      userId: userData.userId,
      messageCategory: selectedMessageCategory,
      messageContent: inputMessage,
    };

    try {
      const response = await fetch("https://localhost:7103/api/v1/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      try {
        // Busca mensagens do grupo selecionado
        const data = await getGroupMessages(token, selectedGroup.id);
        setGroupMessages(data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar mensagens do grupo");
      }

      // Limpa input
      setInputMessage("");
      setSelectedMessageCategory("");
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  useEffect(() => {
    setAvaibleMessageCategories([
      "Feedback",
      "Aviso",
      "Reclamação",
      "Solicitação",
    ]);

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
        setError("Erro ao carregar grupos do usuário");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="grid grid-cols-3">
      {/* Seção de seleção de grupos e opções */}
      <div className="col-span-1 h-screen bg-black/50 text-white border-r-1 border-white/20 flex">
        {/* Barra de opções */}
        <div className="bg-black/70 flex flex-col items-center justify-between p-1">
          <div className="flex flex-col items-center justify-center gap-2">
            <ToDashboardButton
              onClick={() => setSelectedGroup("")}
            ></ToDashboardButton>
            <ToRegisterButton></ToRegisterButton>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <ToSettingsButton></ToSettingsButton>
            <LogoutButton></LogoutButton>
          </div>
        </div>
        {/* Seleção de grupos */}
        <div className="flex flex-col items-start w-full">
          <div className="flex flex-col items-center justify-center border-b border-white/20 p-1 w-full relative">
            <h1 className="text-3xl font-bold">{companyName.toUpperCase()}</h1>
            <h1 className="text-gray-200">{userName.toUpperCase()}</h1>
            <button
              className="absolute top-2 right-2 text-white/80 
              hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
              title="Adicionar"
              onClick={() => handleSetCreatingGroup()}
            >
              <BiMessageAdd className="text-5xl"></BiMessageAdd>
            </button>
          </div>
          <div className="w-full">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-start gap-2 p-1 m-1 rounded-xl cursor-pointer hover:bg-black/30 w=full"
                onClick={() => handleSelectGroup(group)}
              >
                <img src="user.png" alt="Foto do Grupo" className="max-h-16" />
                <div className="flex flex-col">
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-gray-300">Implementar last message...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de mensagens */}
      <div className="col-span-2 h-screen flex flex-col">
        {creatingNewGroup && !selectedGroup ? (
          <CreateGroup
            onChange={(e) => setNewGroupName(e.target.value)}
            newGroupName={newGroupName}
            onSubmit={(e) => handleCreateNewGroup(e)}
          ></CreateGroup>
        ) : selectedGroup ? (
          <div className="flex flex-col h-full">
            {/* Header do grupo */}
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

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <div className="flex flex-col gap-2">
                {groupMessages
                  .slice()
                  .reverse()
                  .map((groupMessage) => (
                    <div key={groupMessage.id} className="flex w-fit px-1">
                      <div className="bg-white/60 rounded-l-md flex items-center">
                        <p className="py-1 px-2 text-black font-semibold">
                          {groupMessage.messageCategory}
                        </p>
                      </div>
                      <div className="flex items-end bg-gray-700 rounded-r-md">
                        <p className="text-gray-200 py-1 px-2">
                          {groupMessage.messageContent}
                        </p>
                        <span className="text-gray-400 text-sm px-1 self-end">
                          {new Date(groupMessage.sendTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input de Mensangens */}
            <form
              onSubmit={(e) => handleSendMessage(e)}
              className=" p-2 border-t border-white/10 bg-black/50 flex items-center justify-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                required
                placeholder="Digite sua mensagem..."
                className="flex-1 py-2 px-4 rounded-full bg-white/60 text-black"
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <div className="">
                <SelectFormField
                  name=""
                  value={selectedMessageCategory}
                  onChange={(e) => setSelectedMessageCategory(e.target.value)}
                  options={availeMessageCategories}
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-xl cursor-pointer"
              >
                Enviar
              </button>
            </form>
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
