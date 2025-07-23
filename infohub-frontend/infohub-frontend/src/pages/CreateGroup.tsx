import FormField from "../components/FormField";
import { FaCheck } from "react-icons/fa";

interface CreateGroupProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newGroupName: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({
  onChange,
  newGroupName,
  onSubmit
}) => {
  return (
    <form className="flex flex-col items-center justify-center h-screen bg-black/30 gap-6" onSubmit={onSubmit}>
      <h2 className="text-gray-200 text-4xl font-bold">Criar Grupo</h2>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="p-1 flex items-center justify-start gap-2 bg-black/50 rounded-full cursor-pointer">
          <img src="user.png" alt="Group Image" className="max-w-16" />
          <p className="text-gray-400 pr-4">
            clique para escolher a imagem do grupo
          </p>
        </div>
        <FormField
          name=""
          type="text"
          placeholder="Nome do Grupo (obrigatório)"
          value={newGroupName}
          onChangeFunc={onChange}
        ></FormField>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center bg-green-500 text-black p-2 rounded-full 
        cursor-pointer hover:bg-green-600 duration-200 transition-colors"
      >
        <FaCheck className="text-4xl"/>
      </button>
    </form>
  );
};

export default CreateGroup;
