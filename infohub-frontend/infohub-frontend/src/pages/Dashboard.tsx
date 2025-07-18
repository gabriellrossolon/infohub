import { useEffect, useState } from "react";
import { getMyGroups } from "../services/getMyGroups";
import { getValidToken } from "../utils/auth";
import { getUserData } from "../services/getUserData";
import { getGroupMessages } from "../services/getGroupMessages";
import CreateGroup from "./CreateGroup";
import OptionsSideBar from "../components/dashboard/OptionsSideBar";
import GroupsList from "../components/dashboard/GroupsList";
import GroupChatPanel from "../components/dashboard/GroupChatPanel";
import { API_ROUTES } from "../api/apiRoutes";
import { deleteMessage } from "../services/deleteMessage";

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
    const token = getValidToken();
    if (!token) return;

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

    const token = getValidToken();
    if (!token || !newGroupName) return;

    try {
      const userData = await getUserData(token);

      const response = await fetch(API_ROUTES.GROUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGroupName,
          companyId: userData.companyId,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar novo grupo.");

      setNewGroupName("");
      setCreatingNewGroup(false);
      setGroups(await getMyGroups(token));
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleSelectGroup = async (group: any) => {
    const token = getValidToken();
    if (!token) return;

    setSelectedGroup(group);
    setCreatingNewGroup(false);

    try {
      setGroupMessages(await getGroupMessages(token, group.id));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar mensagens do grupo");
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = getValidToken();
    if (!token) return;
    if (!chatInputMessage || chatInputMessage === "") return;

    try {
      const userData = await getUserData(token);
      const response = await fetch(API_ROUTES.MESSAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId: selectedGroup.id,
          userId: userData.userId,
          messageCategory: selectedMessageCategory,
          messageContent: chatInputMessage
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar mensagem");

      setGroupMessages(await getGroupMessages(token, selectedGroup.id));
      setChatInputMessage("");
      setSelectedMessageCategory("");
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    const token = getValidToken();
    if (!token) return;

    try {
      await deleteMessage(token, messageId);
      setGroupMessages(await getGroupMessages(token, selectedGroup.id))
    } catch (err) {
      console.error("Erro ao deletar a mensagem", err);
      alert("Erro ao deletar a mensagem");
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
            handleDeleteMessage={handleDeleteMessage}
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
