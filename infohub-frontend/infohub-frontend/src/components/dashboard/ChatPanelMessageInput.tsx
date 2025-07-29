import SelectFormField from "../SelectFormField";

interface GroupChatPanelMessageInputs {
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  chatInputMessage: string;
  setChatInputMessage: (value: string) => void;
  selectedMessageCategory: string;
  setSelectedMessageCategory: (value: string) => void;
  availableMessagesCategories: string[];
}

const GroupChatPanelMessageInput: React.FC<GroupChatPanelMessageInputs> = ({
  handleSendMessage,
  chatInputMessage,
  setChatInputMessage,
  selectedMessageCategory,
  setSelectedMessageCategory,
  availableMessagesCategories,
}) => {
  return (
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
        className="bg-blue-500 text-white px-4 py-2 rounded-xl cursor-pointer"
      >
        Enviar
      </button>
    </form>
  );
};

export default GroupChatPanelMessageInput;
