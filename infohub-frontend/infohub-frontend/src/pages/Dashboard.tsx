import { useEffect, useState } from "react";
import { getMyGroups } from "../services/getMyGroups";
import { isTokenValid } from "../utils/auth";
import { getUserData } from "../services/getUserData";
import { getGroupMessages } from "../services/getGroupMessages";
import CreateGroup from "./CreateGroup";
import OptionsSideBar from "../components/dashboard/OptionsSideBar";
import GroupsList from "../components/dashboard/GroupsList";
import GroupChatPanel from "../components/dashboard/GroupChatPanel";

const Dashboard = () => {
  // Dados do usuário e empresa
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Grupos e seleção
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [creatingNewGroup, setCreatingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // Mensagens do grupo
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [availableMessageCategories] = useState<string[]>([
    "Feedback",
    "Aviso",
    "Reclamação",
    "Solicitação",
  ]);
  const [selectedMessageCategory, setSelectedMessageCategory] = useState("");
  const [chatInputMessage, setChatInputMessage] = useState("");

  // UI e erros
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSetCreatingGroup = () => {
    setSelectedGroup("");
    setCreatingNewGroup(!creatingNewGroup);
  };

  const handleCreateNewGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) return;

    if (!newGroupName) return;

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

    if (!chatInputMessage || chatInputMessage === "") {
      alert("Não é possivel enviar mensagem sem conteúdo!");
      return;
    }

    const userData = await getUserData(token);

    const messageData = {
      groupId: selectedGroup.id,
      userId: userData.userId,
      messageCategory: selectedMessageCategory,
      messageContent: chatInputMessage,
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
      setChatInputMessage("");
      setSelectedMessageCategory("");
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="grid grid-cols-3">
      {/* Seção de seleção de grupos e opções */}
      <div className="col-span-1 h-screen bg-black/50 text-white border-r-1 border-white/20 flex">
        {/* Barra lateral de opções */}
        <OptionsSideBar onClick={() => setSelectedGroup("")}></OptionsSideBar>
        {/* Seleção de grupos */}
        <GroupsList
          companyName={companyName}
          userName={userName}
          groups={groups}
          handleSetCreatingGroup={handleSetCreatingGroup}
          handleSelectGroup={handleSelectGroup}
        ></GroupsList>
      </div>

      {/* Seção chat de mensagens */}
      <div className="col-span-2 h-screen flex flex-col">
        {creatingNewGroup && !selectedGroup ? (
          <CreateGroup
            onChange={(e) => setNewGroupName(e.target.value)}
            newGroupName={newGroupName}
            onSubmit={(e) => handleCreateNewGroup(e)}
          ></CreateGroup>
        ) : selectedGroup ? (
          <GroupChatPanel
            selectedGroup={selectedGroup}
            groupMessages={groupMessages}
            handleSendMessage={handleSendMessage}
            chatInputMessage={chatInputMessage}
            setChatInputMessage={setChatInputMessage}
            selectedMessageCategory={selectedMessageCategory}
            setSelectedMessageCategory={setSelectedMessageCategory}
            availableMessagesCategories={availableMessageCategories}
          ></GroupChatPanel>
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
