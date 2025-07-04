interface ButtonProps {
text: string;
onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({text, onClick}) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition cursor-pointer"
    >
      {text}
    </button>
  );
};

export default Button;
