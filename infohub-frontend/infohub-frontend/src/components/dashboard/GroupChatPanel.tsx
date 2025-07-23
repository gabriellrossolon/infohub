import GroupChatPanelMessageArea from "./ChatPanelMessageArea";
import GroupChatPanelMessageInput from "./ChatPanelMessageInput";
import GroupChatPanelHeader from "./ChatPanelHeader";
import { useUserRole } from "../../hooks/useUserRole";

interface GroupChatPanelProps {
  selectedGroup: any;
  groupMessages: any[];
  handleDeleteGroup: (groupId: number) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteMessage: (messageId: number) => void;
  chatInputMessage: string;
  setChatInputMessage: (value: string) => void;
  selectedMessageCategory: string;
  setSelectedMessageCategory: (value: string) => void;
  availableMessagesCategories: string[];
  activeMessageId: number | null;
  setActiveMessageId: React.Dispatch<React.SetStateAction<number | null>>;
}

const GroupChatPanel: React.FC<GroupChatPanelProps> = ({
  selectedGroup,
  groupMessages,
  handleDeleteGroup,
  handleSendMessage,
  handleDeleteMessage,
  chatInputMessage,
  setChatInputMessage,
  selectedMessageCategory,
  setSelectedMessageCategory,
  availableMessagesCategories,
  activeMessageId,
  setActiveMessageId,
}) => {

  const userRole = useUserRole();

  return (
    <div className="flex flex-col h-full">
      {/* Header do grupo */}
      <GroupChatPanelHeader
        selectedGroup={selectedGroup}
        handleDeleteGroup={handleDeleteGroup}
        userRole={userRole ?? null}
      />

      {/* Área de Mensagens */}
      <GroupChatPanelMessageArea
        groupMessages={groupMessages}
        activeMessageId={activeMessageId}
        setActiveMessageId={setActiveMessageId}
        userRole={userRole ?? null}
        handleDeleteMessage={handleDeleteMessage}
      />

      {/* Input de Mensangens */}
      <GroupChatPanelMessageInput
        handleSendMessage={handleSendMessage}
        chatInputMessage={chatInputMessage}
        setChatInputMessage={setChatInputMessage}
        selectedMessageCategory={selectedMessageCategory}
        setSelectedMessageCategory={setSelectedMessageCategory}
        availableMessagesCategories={availableMessagesCategories}
      />
    </div>
  );
};

export default GroupChatPanel;
