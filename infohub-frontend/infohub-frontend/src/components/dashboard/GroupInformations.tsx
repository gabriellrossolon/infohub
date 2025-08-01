import { formatCpfOrCnpj, formatPhoneNumber } from "../../utils/formatters";
import { IoCopy } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

interface GroupInformationsProps {
  selectedGroup: any;
  setShowGroupInfo: (value: boolean) => void;
}

const GroupInformations: React.FC<GroupInformationsProps> = ({
  selectedGroup,
  setShowGroupInfo,
}) => {
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div
      className="h-full bg-black/70 flex flex-col items-center text-gray-50 mx-8 my-4 p-8 rounded-xl gap-4 
      overflow-hidden relative"
    >
      <button
        className="absolute right-3 top-3 cursor-pointer p-1 rounded-full
      hover:bg-white/10 transition-colors duration-300"
        onClick={() => setShowGroupInfo(false)}
      >
        <IoMdClose className="text-5xl text-red-600" />
      </button>

      {/* Imagem e Nome do Grupo */}
      <div className="flex flex-row items-center justify-center gap-2 bg-white/10 rounded-full p-2">
        <img
          src={`${
            selectedGroup.identifierType === "CPF"
              ? "usericon.png"
              : selectedGroup.identifierType === "CNPJ" && "enterpriseicon.png"
          }`}
          alt="Icone do Grupo"
          className="max-w-20"
        />
        <div className="flex flex-row items-center justify-center">
          <h2 className="text-gray-200 text-4xl font-semibold px-2">
            {selectedGroup.name}
          </h2>
          <IoCopy
            className="text-4xl cursor-pointer text-blue-500 hover:text-blue-600 transition-all duration-300"
            onClick={() => handleCopy(selectedGroup.name)}
          />
        </div>
      </div>

      {/* Informações do Grupo */}
      <div className="min-w-124">
        <table className="min-w-full text-sm rounded-xl overflow-hidden">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-2 text-start">Campo</th>
              <th className="px-4 py-2 text-start">Valor</th>
              <th className="px-4 py-2 text-center">Copiar</th>
            </tr>
          </thead>
          <tbody className="bg-white/5 divide-y divide-white/10">
            <tr>
              <td className="px-4 py-2">{selectedGroup.identifierType}</td>
              <td className="px-4 py-2 ">
                {formatCpfOrCnpj(selectedGroup.identifierValue)}
              </td>
              <td className="px-4 py-2 flex justify-center">
                <IoCopy
                  className="text-xl cursor-pointer text-blue-500 hover:text-blue-600 transition-all duration-300"
                  onClick={() =>
                    handleCopy(formatCpfOrCnpj(selectedGroup.identifierValue))
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Telefone</td>
              <td className="px-4 py-2">
                {formatPhoneNumber(selectedGroup.phone)}
              </td>
              <td className="px-4 py-2 flex justify-center">
                <IoCopy
                  className="text-xl cursor-pointer text-blue-500 hover:text-blue-600 transition-all duration-300"
                  onClick={() =>
                    handleCopy(formatPhoneNumber(selectedGroup.phone) || "")
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Email</td>
              <td className="px-4 py-2">{selectedGroup.email}</td>
              <td className="px-4 py-2 flex justify-center">
                <IoCopy
                  className="text-xl cursor-pointer text-blue-500 hover:text-blue-600 transition-all duration-300"
                  onClick={() => handleCopy(selectedGroup.email)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Descrição do Grupo */}
      <div className="flex flex-col items-start flex-1 overflow-y-auto px-2 w-full">
        <p className="bg-white/10 w-full rounded-t-md p-1 font-semibold">
          Descrição do Grupo:
        </p>
        <p className="text-justify text-gray-300 bg-white/5 w-full rounded-b-md p-2 whitespace-pre-line">
          {selectedGroup.description}
        </p>
      </div>
    </div>
  );
};

export default GroupInformations;
