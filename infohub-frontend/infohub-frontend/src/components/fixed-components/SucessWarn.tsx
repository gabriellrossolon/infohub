import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface SucessWarnProps {
  text: string | null;
  setSucess: (value: string | null) => void;
  duration?: number;
}

const SucessWarn: React.FC<SucessWarnProps> = ({
  text,
  setSucess,
  duration = 2000,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSucess(null);
    }, duration);

    return () => clearTimeout(timeout);
  }, [text, setSucess, duration]);

  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, -5, 5, -3, 3, -1, 1, 0] }}
      transition={{ duration: 0.6 }}
      className="fixed flex items-center justify-center gap-1 bg-black/80 py-3 px-2 rounded-xl backdrop-blur top-25"
    >
      <IoMdCheckmarkCircleOutline className="text-green-400 text-2xl" />
      <p className="text-green-400 text-md">{text}</p>
    </motion.div>
  );
};

export default SucessWarn;
