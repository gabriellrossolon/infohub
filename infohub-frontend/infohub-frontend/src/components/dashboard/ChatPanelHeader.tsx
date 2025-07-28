import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiCircleInfo, CiTrash } from "react-icons/ci";
import { FaArchive } from "react-icons/fa";

interface GroupChatPanelHeaderProps {
  selectedGroup: any;
  handleDeleteGroup: (groupId: number) => void;
  userRole: string | null;
  showGroupFiles: boolean;
  setShowGroupFiles: (value: boolean) => void;
}

const GroupChatPanelHeader: React.FC<GroupChatPanelHeaderProps> = ({
  selectedGroup,
  handleDeleteGroup,
  userRole,
  showGroupFiles,
  setShowGroupFiles,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [showGroupOptions, setShowGroupOptions] = useState<boolean>(false);

  const handleShowGroupInfo = (selectedGroup: any) => {
    setShowGroupOptions(false);
    alert(
      "O ID do grupo é: " +
        selectedGroup.id +
        "\nGrupo criado em: " +
        new Date(selectedGroup.creationDate).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowGroupOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowGroupOptions(false);
  }, [selectedGroup]);

  return (
    <div className=" bg-[#111111] rounded-full flex items-center justify-between">
      <div className="p-1 flex items-center justify-start gap-2">
        <img src="user.png" alt="Group Image" className="max-w-16" />
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">{selectedGroup.name}</h2>
          <p className="text-gray-400 cursor-pointer">
            clique para mostrar dados do grupo
          </p>
        </div>
      </div>
      <div
        className="min-w-16 relative flex items-center justify-center"
        ref={menuRef}
      >
        <button
          className="cursor-pointer p-3 rounded-full  text-white
        hover:text-blue-500 hover:bg-white/10 transition-all duration-300
        flex items-center justify-center gap-1"
        onClick={() => setShowGroupFiles(!showGroupFiles)}
        > 
          <span className="text-xl font-semibold">Arquivos</span>
          <FaArchive className="text-3xl"/>
        </button>

        <button
          className="cursor-pointer p-3 rounded-full text-3xl text-white
        hover:bg-white/10 transition-all duration-300"
          onClick={() => setShowGroupOptions(!showGroupOptions)}
        >
          <BsThreeDotsVertical />
        </button>
        {showGroupOptions && (
          <div
            className="absolute right-10 top-full text-white 
        bg-[#111111] p-2 rounded-b-xl z-10 min-w-48 space-y-1"
          >
            <button
              className="flex items-center justify-start gap-1 py-2 px-3 rounded-md
          hover:bg-white/10 transition-colors duration-300 w-full cursor-pointer"
              onClick={() => handleShowGroupInfo(selectedGroup)}
            >
              <CiCircleInfo className="text-2xl" />
              <span className="text-md">Dados do grupo</span>
            </button>
            {(userRole === "admin" || userRole === "manager") && (
              <button
                className="flex items-center justify-start gap-1 py-2 px-3 rounded-md
          hover:bg-white/10 transition-colors duration-300 w-full cursor-pointer text-red-400 font-bold"
                onClick={() => handleDeleteGroup(selectedGroup.id)}
              >
                <CiTrash className="text-2xl" />
                <span className="text-md">Apagar grupo</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChatPanelHeader;
