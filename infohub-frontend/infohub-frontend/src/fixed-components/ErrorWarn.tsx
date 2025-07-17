import { MdErrorOutline } from "react-icons/md";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface ErrorWarnProps {
  text: string | null;
  setError: (value: string | null) => void;
  duration?: number;
}

const ErrorWarn: React.FC<ErrorWarnProps> = ({
  text,
  setError,
  duration = 2000,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, duration);

    return () => clearTimeout(timeout);
  }, [text, setError, duration]);

  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, -5, 5, -3, 3, -1, 1, 0] }}
      transition={{ duration: 0.6 }}
      className="fixed flex items-center justify-center gap-1 bg-black/80 py-3 px-2 rounded-xl backdrop-blur top-25"
    >
      <MdErrorOutline className="text-red-400 text-2xl" />
      <p className="text-red-400 text-md">{text}</p>
    </motion.div>
  );
};

export default ErrorWarn;
