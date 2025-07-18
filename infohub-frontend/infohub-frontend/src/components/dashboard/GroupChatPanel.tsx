import SelectFormField from "../SelectFormField";
import { useRef, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { CiCircleInfo, CiTrash } from "react-icons/ci";

interface GroupChatPanelProps {
  selectedGroup: any;
  groupMessages: any[];
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteMessage: (messageId: number) => void;
  chatInputMessage: string;
  setChatInputMessage: (value: string) => void;
  selectedMessageCategory: string;
  setSelectedMessageCategory: (value: string) => void;
  availableMessagesCategories: string[];
}

const GroupChatPanel: React.FC<GroupChatPanelProps> = ({
  selectedGroup,
  groupMessages,
  handleSendMessage,
  handleDeleteMessage,
  chatInputMessage,
  setChatInputMessage,
  selectedMessageCategory,
  setSelectedMessageCategory,
  availableMessagesCategories,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function getCategoryColor(category: string): string {
    switch (category) {
      case "Feedback":
        return "#4caf50"; // verde
      case "Aviso":
        return "#ff9800"; // laranja
      case "Reclamação":
        return "#f44336"; // vermelho
      case "Solicitação":
        return "#2196f3"; // azul
      default:
        return "#9e9e9e"; // cinza padrão pra categoria desconhecida
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMessageId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <div key={groupMessage.id} className="flex px-1 group">
                <div
                  className="rounded-l-md flex items-center"
                  style={{
                    backgroundColor:
                      getCategoryColor(groupMessage.messageCategory) + "99",
                  }}
                >
                  <p className=" px-2 text-black font-semibold min-w-28">
                    {groupMessage.messageCategory}
                  </p>
                </div>
                <div className="flex items-center bg-gray-700 rounded-r-md">
                  <div className="px-1 py-1">
                    <p className="text-gray-200">
                      {groupMessage.messageContent}
                    </p>
                  </div>
                  <div className="px-1 h-full flex items-end relative">
                    <button
                      className="absolute top-1 right-1 text-xl text-gray-300 cursor-pointer 
                      hidden group-hover:block transition-opacit"
                      onClick={() =>
                        setActiveMessageId((prev) =>
                          prev === groupMessage.id ? null : groupMessage.id
                        )
                      }
                    >
                      <FiChevronDown />
                    </button>
                    {activeMessageId === groupMessage.id && (
                      <div
                        ref={menuRef}
                        className="absolute top-4 right-1 flex flex-col items-start bg-gray-800 py-1 px-2 rounded-md gap-1 z-5"
                      >
                        <button
                          onClick={() =>
                            alert(
                              "O ID da mensagem é: " +
                                groupMessage.id +
                                "\nE ela foi enviada em: " +
                                new Date(groupMessage.sendTime).toLocaleString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                            )
                          }
                          className="flex items-center justify-center text-white gap-1 cursor-pointer"
                        >
                          <CiCircleInfo className="text-xl" />
                          <span className="text-md">Dados</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(groupMessage.id)}
                          className="flex items-center justify-center text-red-400 gap-1 font-bold cursor-pointer"
                        >
                          <CiTrash className="text-xl" />
                          <span className="text-md">Apagar</span>
                        </button>
                      </div>
                    )}
                    <span className="text-gray-400 text-sm">
                      {new Date(groupMessage.sendTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
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
