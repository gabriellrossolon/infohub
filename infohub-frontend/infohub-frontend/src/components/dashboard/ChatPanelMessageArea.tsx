import { FiChevronDown } from "react-icons/fi";
import { CiCircleInfo, CiTrash } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { getUserDataById } from "../../services/getUserDataById";
import { getValidToken } from "../../utils/auth";
import { nameFormatter, parseUtcString } from "../../utils/formatters";

interface GroupChatPanelMessageAreaProps {
  groupMessages: any[];
  activeMessageId: number | null;
  setActiveMessageId: React.Dispatch<React.SetStateAction<number | null>>;
  userRole: string | null;
  handleDeleteMessage: (messageId: number) => void;
}

const GroupChatPanelMessageArea: React.FC<GroupChatPanelMessageAreaProps> = ({
  groupMessages,
  activeMessageId,
  setActiveMessageId,
  userRole,
  handleDeleteMessage,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
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

  const handleShowMessageInfo = async (groupMessage: any) => {
    const token = getValidToken();
    if (!token) return;

    const userData = await getUserDataById(token, groupMessage.userId);

    const messageSendTime = parseUtcString(groupMessage.sendTime);

    setActiveMessageId(null);
    alert(
      "O ID da mensagem é: " +
        groupMessage.id +
        "\nEnviada por: " +
        userData.name.toUpperCase() +
        "\nMensagem enviada em: " +
        (messageSendTime
          ? messageSendTime.toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "A mensagem não tem data de envio")
    );
  };

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

  const [userNamesById, setUserNamesById] = useState<Record<number, string>>(
    {}
  );
  useEffect(() => {
    const fetchUserNames = async () => {
      const token = getValidToken();
      if (!token) return;

      // Extrai os IDs únicos das mensagens
      const uniqueUserIds = [
        ...new Set(groupMessages.map((msg) => msg.userId)),
      ];

      // Filtra apenas os que ainda não estão no state
      const missingUserIds = uniqueUserIds.filter(
        (id) => !(id in userNamesById)
      );

      // Se não tiver nenhum novo, não faz nada
      if (missingUserIds.length === 0) return;

      const newUserNames: Record<number, string> = {};

      await Promise.all(
        missingUserIds.map(async (userId) => {
          try {
            const userData = await getUserDataById(token, userId);
            newUserNames[userId] = nameFormatter(userData.name);
          } catch (err) {
            newUserNames[userId] = "Usuário";
          }
        })
      );

      // Atualiza o state sem apagar os anteriores
      setUserNamesById((prev) => ({ ...prev, ...newUserNames }));
    };

    fetchUserNames();
  }, [groupMessages, userNamesById]);

  return (
    <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
      <div className="flex flex-col gap-2">
        {groupMessages
          .slice()
          .reverse()
          .map((groupMessage) => (
            <div key={groupMessage.id} className="flex px-1 ">
              {/* Categoria da Mensagem */}
              <div
                className="rounded-l-md flex items-center backdrop-blur"
                style={{
                  backgroundColor:
                    getCategoryColor(groupMessage.messageCategory) + "99",
                }}
              >
                <p className=" px-2 text-black font-semibold min-w-28">
                  {groupMessage.messageCategory}
                </p>
              </div>

              {/* Campo de dados da mensagem*/}
              <div className="bg-gray-700 rounded-r-md flex flex-col items-start justify-center group">
                {/* Nome do Usuário + Handler de opções  */}
                <div className="flex flex-row justify-between items-center w-full relative">
                  <p className="px-1 pt-1 text-gray-50 font-bold pr-8">
                    {userNamesById[groupMessage.userId] ?? "Carregando..."}
                  </p>

                  {/* Maldito Botão */}
                  <div className="absolute right-0 top-1">
                    <div className="px-1 h-full flex items-end relative">
                      <button
                        className="text-2xl text-gray-300 cursor-pointer 
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
                          className="absolute top-6 right-2 flex flex-col items-start bg-[#111111] p-2 rounded-md gap-1 z-5"
                        >
                          <button
                            onClick={() => handleShowMessageInfo(groupMessage)}
                            className="flex items-center justify-start text-white gap-1 cursor-pointer w-full py-1 px-2
                        hover:bg-white/10 rounded-md"
                          >
                            <CiCircleInfo className="text-xl" />
                            <span className="text-md">Dados</span>
                          </button>
                          {(userRole === "admin" || userRole === "manager") && (
                            <button
                              onClick={() =>
                                handleDeleteMessage(groupMessage.id)
                              }
                              className="flex items-center justify-start text-red-400 font-bold gap-1 cursor-pointer w-full py-1 px-2
                        hover:bg-white/10 rounded-md"
                            >
                              <CiTrash className="text-xl" />
                              <span className="text-md">Apagar</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conteúdo da Mensagem + Horario de Envio */}
                <div className="flex items-end justify-between w-full relative">
                  <div className="px-2 pb-2">
                    <p className="text-gray-200">
                      {groupMessage.messageContent}
                    </p>
                  </div>

                  <span className="text-gray-400 text-sm pr-1">
                    {parseUtcString(groupMessage.sendTime)?.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default GroupChatPanelMessageArea;
