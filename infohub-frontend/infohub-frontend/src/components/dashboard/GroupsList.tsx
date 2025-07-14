import { BiMessageAdd } from "react-icons/bi";

interface GroupsListProps {
  companyName: string,
  userName: string,
  groups: any[]; 
  handleSetCreatingGroup: () => void,
  handleSelectGroup: (group: any) => void,
}

const GroupsList: React.FC<GroupsListProps> = ({companyName, userName,groups ,handleSelectGroup, handleSetCreatingGroup}) => {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col items-center justify-center border-b border-white/20 p-1 w-full relative">
        <h1 className="text-3xl font-bold">{companyName.toUpperCase()}</h1>
        <h1 className="text-gray-200">{userName.toUpperCase()}</h1>
        <button
          className="absolute top-2 right-2 text-white/80 
              hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
          title="Adicionar"
          onClick={() => handleSetCreatingGroup()}
        >
          <BiMessageAdd className="text-5xl"></BiMessageAdd>
        </button>
      </div>
      <div className="w-full">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-start gap-2 p-1 m-1 rounded-xl cursor-pointer hover:bg-black/30 w=full"
            onClick={() => handleSelectGroup(group)}
          >
            <img src="user.png" alt="Foto do Grupo" className="max-h-16" />
            <div className="flex flex-col">
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-gray-300">Implementar last message...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
