interface ButtonProps {
text?: string;
children?: React.ReactNode;
onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({text, onClick, children}) => {
  return (
    <button
      onClick={onClick}
      className="hover:bg-white/20 rounded-full duration-300 p-2 cursor-pointer"
    >
      {text}
      {children}
    </button>
  );
};

export default Button;
