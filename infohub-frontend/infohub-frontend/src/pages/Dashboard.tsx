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
import { deleteGroup } from "../services/deleteGroup";
import LoadingWarn from "../components/fixed-components/LoadingWarn";

const Dashboard = () => {
  // Dados do usuário e empresa
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Grupos e seleção
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [searchedGroup, setSearchedGroup] = useState<string>("");
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchedGroup.toLowerCase())
  );
  const [creatingNewGroup, setCreatingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // Mensagens do grupo
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserData = async () => {
    const token = getValidToken();
    if (!token) return;

    try {
      // Busca nomes do usuário e empresa
      const { userName, companyName } = await getUserData(token);
      setUserName(userName);
      setCompanyName(companyName);

      // Busca grupos
      setGroups(await getMyGroups(token));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar grupos do usuário");
    }
  };

  useEffect(() => {
    fetchUserData();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleSelectGroup(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown); // limpeza necessária
    };
  }, []);

  const handleSetCreatingGroup = () => {
    handleSelectGroup(null);
    setCreatingNewGroup(!creatingNewGroup);
  };

  const handleCreateNewGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = getValidToken();
    if (!token || !newGroupName) return;

    setLoading(true);

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

      if (!response.ok) {
        throw new Error("Erro ao criar novo grupo.");
        setLoading(false);
      }

      setNewGroupName("");
      setCreatingNewGroup(false);
      setGroups(await getMyGroups(token));
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    const token = getValidToken();
    if (!token) return;

    const confirm = window.confirm("Tem certeza que deseja deletar o grupo?");
    if (!confirm) return;

    setLoading(true);

    try {
      await deleteGroup(token, groupId);
      setGroups(await getMyGroups(token));
      setSelectedGroup("");
    } catch (err) {
      console.error("Erro ao deletar o grupo: ", err);
      alert("Erro ao deletar o grupo");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGroup = async (group: any | null) => {
    const token = getValidToken();
    if (!token) return;

    if (!group) {
      setSelectedGroup(null);
      setSelectedGroupId(null);
      return;
    }

    setLoading(true);

    try {
      setGroupMessages(await getGroupMessages(token, group.id));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar mensagens do grupo");
    } finally {
      setSelectedGroup(group);
      setSelectedGroupId(group.id);
      setCreatingNewGroup(false);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = getValidToken();
    if (!token) return;
    if (!chatInputMessage || chatInputMessage === "") return;

    setLoading(true);

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
          messageContent: chatInputMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
        setLoading(false);
      }

      setGroupMessages(await getGroupMessages(token, selectedGroup.id));
      setChatInputMessage("");
      setSelectedMessageCategory("");
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    const token = getValidToken();
    if (!token) return;

    const confirm = window.confirm(
      "Tem certeza que deseja deletar a mensagem?"
    );
    if (!confirm) return;

    setLoading(true);

    try {
      await deleteMessage(token, messageId);
      setGroupMessages(await getGroupMessages(token, selectedGroup.id));
    } catch (err) {
      console.error("Erro ao deletar a mensagem", err);
      alert("Erro ao deletar a mensagem");
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="text-red-500 p-4 flex items-center justify-center h-screen">
        {error}
      </div>
    );

  return (
    <div className="grid grid-cols-3">
      {/* Seção de seleção de grupos e opções */}
      <div className="col-span-1 h-screen bg-black/40 text-white border-r-1 border-white/20 flex">
        {/* Barra lateral de opções */}
        <OptionsSideBar handleSelectGroup={() => handleSelectGroup(null)} />
        {/* Seleção de grupos */}
        <GroupsList
          companyName={companyName}
          userName={userName}
          groups={filteredGroups}
          handleSetCreatingGroup={handleSetCreatingGroup}
          handleSelectGroup={handleSelectGroup}
          selectedGroupId={selectedGroupId}
          searchedGroup={searchedGroup}
          setSearchedGroup={setSearchedGroup}
        />
      </div>

      {/* Seção chat de mensagens */}
      <div className="col-span-2 h-screen flex flex-col">
        {creatingNewGroup && !selectedGroup ? (
          <CreateGroup
            onChange={(e) => setNewGroupName(e.target.value)}
            newGroupName={newGroupName}
            onSubmit={(e) => handleCreateNewGroup(e)}
          />
        ) : selectedGroup ? (
          <GroupChatPanel
            selectedGroup={selectedGroup}
            groupMessages={groupMessages}
            handleDeleteGroup={handleDeleteGroup}
            handleSendMessage={handleSendMessage}
            handleDeleteMessage={handleDeleteMessage}
            chatInputMessage={chatInputMessage}
            setChatInputMessage={setChatInputMessage}
            selectedMessageCategory={selectedMessageCategory}
            setSelectedMessageCategory={setSelectedMessageCategory}
            availableMessagesCategories={availableMessageCategories}
            activeMessageId={activeMessageId}
            setActiveMessageId={setActiveMessageId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className=" text-gray-300">
              Selecione um grupo para visualizar as mensagens
            </p>
          </div>
        )}
      </div>
      {loading && <LoadingWarn />}
    </div>
  );
};

export default Dashboard;
