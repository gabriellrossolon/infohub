import FormField from "../components/FormField";
import { FaCheck } from "react-icons/fa";
import { IDENTIFIER_TYPE } from "../types/identifiersType";
import SelectFormField from "../components/SelectFormField";
import { formatCpfOrCnpj } from "../utils/formatters";

interface CreateGroupProps {
  setNewGroupName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newGroupName: string;
  setNewGroupPhone: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newGroupPhone: string;
  setNewGroupEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newGroupEmail: string;
  setNewGroupDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  newGroupDescription: string;
  handleCreateNewGroup: (e: React.FormEvent<HTMLFormElement>) => void;
  newGroupIdentifierValue: string;
  setNewGroupIdentifierValue: (value: string) => void;
  newGroupIdentifierType: string;
  setNewGroupIdentifierType: (value: string) => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({
  setNewGroupName,
  newGroupName,
  newGroupPhone,
  setNewGroupPhone,
  newGroupEmail,
  setNewGroupEmail,
  newGroupDescription,
  setNewGroupDescription,
  handleCreateNewGroup,
  newGroupIdentifierValue,
  setNewGroupIdentifierValue,
  newGroupIdentifierType,
  setNewGroupIdentifierType,
}) => {
  const handleIdentifierValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatCpfOrCnpj(e.target.value, newGroupIdentifierType);
    setNewGroupIdentifierValue(formatted);
  };

  return (
    <form
      className="flex flex-col items-center justify-center h-screen bg-black/30 gap-12"
      onSubmit={handleCreateNewGroup}
    >
      <h2 className="text-gray-200 text-4xl font-bold">Novo Grupo</h2>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="px-4 py-2 flex items-center justify-start gap-2 bg-black/50 rounded-full">
          <div className="flex items-center justify-start gap-2 bg-white/5 p-1 rounded-full cursor-pointer">
            <img
              src="enterpriseicon.png"
              alt="Group Image"
              className="max-w-16"
            />
            <p className="text-gray-400 pr-4">
              clique para escolher a imagem do grupo
            </p>
          </div>

          <FormField
            name=""
            type="text"
            placeholder="Nome do Grupo (obrigatório)"
            value={newGroupName}
            onChangeFunc={setNewGroupName}
          />
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center">
          <div className="flex justify-between w-full">
            <FormField
              name=""
              type="text"
              placeholder="Digite o Telefone"
              value={newGroupPhone}
              onChangeFunc={setNewGroupPhone}
            />
            <FormField
              name=""
              type="text"
              placeholder="Digite o Email"
              value={newGroupEmail}
              onChangeFunc={setNewGroupEmail}
            />
          </div>
          <textarea
            className="text-white/80 py-1 px-2 border-1 rounded-md border-white/50 min-w-[25vw] bg-black/30 w-full"
            placeholder="Digite a Descrição do Grupo"
            value={newGroupDescription}
            onChange={setNewGroupDescription}
          />
          <SelectFormField
            name="Tipo do Grupo"
            value={newGroupIdentifierType}
            options={IDENTIFIER_TYPE}
            onChange={(e) => setNewGroupIdentifierType(e.target.value)}
          />
          {newGroupIdentifierType && (
            <div className="w-full">
              <FormField
                name=""
                type="text"
                placeholder={`${
                  newGroupIdentifierType === "CPF"
                    ? "Digite o CPF"
                    : newGroupIdentifierType === "CNPJ" && "Digite o CNPJ"
                }`}
                value={newGroupIdentifierValue}
                onChangeFunc={handleIdentifierValueChange}
              />
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center bg-green-500 text-black p-2 rounded-full 
        cursor-pointer hover:bg-green-600 duration-200 transition-colors"
      >
        <FaCheck className="text-4xl" />
      </button>
    </form>
  );
};

export default CreateGroup;
