import SelectFormField from "../SelectFormField";
import { useRef, useEffect } from "react";

interface GroupChatPanelProps {
  selectedGroup: any;
  groupMessages: any[];
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void,
  chatInputMessage: string,
  setChatInputMessage: (value: string) => void,
  selectedMessageCategory: string
  setSelectedMessageCategory: (value: string) => void,
  availableMessagesCategories: string[]
}

const GroupChatPanel: React.FC<GroupChatPanelProps> = ({
  selectedGroup,
  groupMessages,
  handleSendMessage,
  chatInputMessage,
  setChatInputMessage,
  selectedMessageCategory,
  setSelectedMessageCategory,
  availableMessagesCategories
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header do grupo */}
      <div className="p-1 flex items-center justify-start gap-2 bg-black/50 rounded-full">
        <img src="user.png" alt="Group Image" className="max-w-16" />
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">{selectedGroup.name}</h2>
          <p className="text-gray-400">clique para mostrar dados do grupo</p>
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
                    {new Date(groupMessage.sendTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
          value={chatInputMessage}
          required
          placeholder="Digite sua mensagem..."
          className="flex-1 py-2 px-4 rounded-full bg-white/60 text-black"
          onChange={(e) => setChatInputMessage(e.target.value)}
        />
        <div className="">
          <SelectFormField
            name=""
            value={selectedMessageCategory}
            onChange={(e) => setSelectedMessageCategory(e.target.value)}
            options={availableMessagesCategories}
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
  );
};

export default GroupChatPanel;
