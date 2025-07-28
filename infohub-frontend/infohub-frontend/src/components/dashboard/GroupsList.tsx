import { BiMessageAdd } from "react-icons/bi";
import { IoMdSearch } from "react-icons/io";

interface GroupsListProps {
  companyName: string;
  userName: string;
  groups: any[];
  handleSetCreatingGroup: () => void;
  handleSelectGroup: (group: any) => void;
  selectedGroupId: number | null;
  searchedGroup: string;
  setSearchedGroup: (value: string) => void;
}

const GroupsList: React.FC<GroupsListProps> = ({
  companyName,
  userName,
  groups,
  handleSelectGroup,
  handleSetCreatingGroup,
  selectedGroupId,
  searchedGroup,
  setSearchedGroup,
}) => {
  return (
    <div className="flex flex-col items-start w-full backdrop-blur select-none">
      <div className="flex flex-col items-center justify-center border-b border-white/20 p-1 w-full relative">
        <h1 className="text-3xl font-bold text-gray-100">
          Info<strong className="text-blue-500">HUB</strong>
        </h1>
        <h2 className="text-gray-200 text-center tracking-wide uppercase">
          {userName + " - " + companyName}
        </h2>
        <button
          className="absolute top-2 right-2 text-white/80 
              hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
          title="Adicionar"
          onClick={() => handleSetCreatingGroup()}
        >
          <BiMessageAdd className="text-5xl" />
        </button>
        <div className="relative w-full max-w-md">
          <IoMdSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl 
          text-gray-500 pointer-events-none"
          />
          <input
            value={searchedGroup}
            onChange={(e) => setSearchedGroup(e.target.value)}
            type="text"
            placeholder="Pesquisar por grupo"
            className="w-full rounded-full py-2 pl-12 pr-4 bg-white/5 text-white focus:outline-none"
          />
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-auto no-scrollbar p-1 space-y-1">
        {groups.length === 0 && (
          <p className="text-gray-400 text-center mt-4">
            Nenhum grupo encontrado
          </p>
        )}
        {groups.map((group) => {
          const isSelected = group.id === selectedGroupId;
          return (
            <div
              key={group.id}
              className={`flex items-center justify-start gap-2 rounded-xl p-1 cursor-pointer 
              hover:bg-white/10 w-full ${isSelected ? "bg-white/20" : ""}`}
              onClick={() => handleSelectGroup(group)}
            >
              <img src="user.png" alt="Foto do Grupo" className="max-h-16" />
              <div className="flex flex-col">
                <h3 className="font-semibold">{group.name}</h3>
                <p className="text-gray-300">Implementar last message...</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupsList;
