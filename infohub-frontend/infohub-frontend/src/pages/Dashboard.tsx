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
import { getGroupFiles } from "../services/getGroupFiles";
import { getGroupFileByName } from "../services/getGroupFileByName";
import { deleteGroupFile } from "../services/deleteGroupFile";

const Dashboard = () => {
  // Dados do usuário e empresa
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Grupos e seleção
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [searchedGroup, setSearchedGroup] = useState<string>("");
  const normalize = (str: string) => str.replace(/\D/g, "").toLowerCase();
  const filteredGroups = groups.filter((group) => {
    const normalizedSearch = searchedGroup.toLowerCase();
    const normalizedIdentifier = normalize(group.identifierValue || "");
    const normalizedName = (group.name || "").toLowerCase();

    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedIdentifier.includes(normalize(searchedGroup))
    );
  });
  const [creatingNewGroup, setCreatingNewGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupIdentifierType, setNewGroupIdentifierType] =
    useState<string>("");
  const [newGroupIdentifierValue, setNewGroupIdentifierValue] =
    useState<string>("");

  // Mensagens do grupo
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [availableMessageCategories] = useState<string[]>([
    "Feedback",
    "Aviso",
    "Reclamação",
    "Solicitação",
  ]);
  const [selectedMessageCategory, setSelectedMessageCategory] =
    useState<string>("");
  const [chatInputMessage, setChatInputMessage] = useState<string>("");

  //Arquivos do grupo
  const [groupFiles, setGroupFiles] = useState<any>();
  const [showGroupFiles, setShowGroupFiles] = useState<boolean>(false);

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
    setShowGroupFiles(false);
    setNewGroupName("");
    setNewGroupIdentifierType("");
    setNewGroupIdentifierValue("");
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
          identifierType: newGroupIdentifierType,
          identifierValue: newGroupIdentifierValue,
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
      setGroupFiles(null);
      return;
    }

    setLoading(true);

    try {
      setGroupMessages(await getGroupMessages(token, group.id));
      setGroupFiles(await getGroupFiles(token, group.id));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar mensagens ou arquivos do grupo");
    } finally {
      setShowGroupFiles(false);
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
      setGroups(await getMyGroups(token));
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

  const handleDownloadFile = async (fileName: string) => {
    const token = getValidToken();
    if (!token || !selectedGroupId) return;

    setLoading(true);

    try {
      const blob = await getGroupFileByName(token, selectedGroupId, fileName);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert("Erro ao baixar arquivo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const token = getValidToken();
    if (!token || !selectedGroupId) return;

    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_ROUTES.GROUP_FILES(selectedGroupId)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      setGroupFiles(await getGroupFiles(token, selectedGroupId));

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }
    } catch (error) {
      setError("Falha no upload");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    const token = getValidToken();
    if (!token || !selectedGroupId) return;

    const confirm = window.confirm("Tem certeza que deseja deletar o arquivo?");
    if (!confirm) return;

    setLoading(true);

    try {
      await deleteGroupFile(token, selectedGroupId, fileName);
      setGroupFiles(await getGroupFiles(token, selectedGroupId));
    } catch (error) {
      setError("Erro ao deletar arquivo");
      console.error(error);
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
            setNewGroupName={(e) => setNewGroupName(e.target.value)}
            newGroupName={newGroupName}
            handleCreateNewGroup={(e) => handleCreateNewGroup(e)}
            newGroupIdentifierValue={newGroupIdentifierValue}
            setNewGroupIdentifierValue={setNewGroupIdentifierValue}
            newGroupIdentifierType={newGroupIdentifierType}
            setNewGroupIdentifierType={setNewGroupIdentifierType}
          />
        ) : selectedGroup ? (
          <GroupChatPanel
            selectedGroup={selectedGroup}
            groupMessages={groupMessages}
            groupFiles={groupFiles}
            handleDowloadFile={handleDownloadFile}
            handleUploadFile={handleUploadFile}
            handleDeleteFile={handleDeleteFile}
            setShowGroupFiles={setShowGroupFiles}
            showGroupFiles={showGroupFiles}
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
