import { FaRegFileArchive, FaFolderPlus } from "react-icons/fa";

interface GroupFilesProps {
  groupFiles: any[];
  handleDowloadFile: (filaName: string) => void;
  handleUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GroupFiles: React.FC<GroupFilesProps> = ({
  groupFiles,
  handleDowloadFile,
  handleUploadFile,
}) => {
  return (
    <div
      className={`bg-white/10 h-full p-2 flex-1 overflow-y-auto no-scrollbar ${
        groupFiles.length === 0
          ? "flex items-center justify-center"
          : "grid grid-cols-5 gap-2 content-start"
      }`}
    >
      {groupFiles.length === 0 ? (
        <p className="text-gray-200 col-span-5 text-center font-bold">
          Não há arquivos neste grupo
        </p>
      ) : (
        groupFiles.map((file, index) => (
          <div
            key={index}
            className="bg-black/60 aspect-square rounded-md flex flex-col justify-between p-2 cursor-pointer
            hover:bg-black/90 transition-all duration-300
            "
            title={file.fileName}
            onClick={() => handleDowloadFile(file.fileName)}
          >
            <div className="flex-1 flex items-center justify-center">
              <FaRegFileArchive className="text-9xl text-gray-100" />
            </div>
            <p className="text-gray-100 truncate w-full text-center">
              {file.fileName}
            </p>
          </div>
        ))
      )}
      <label
        className="fixed right-5 bottom-5 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer 
      hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <FaFolderPlus className="text-4xl" />
        <span className="text-gray-100 font-bold text-xl">Enviar</span>
        <input type="file" className="hidden" onChange={handleUploadFile} />
      </label>
    </div>
  );
};

export default GroupFiles;
