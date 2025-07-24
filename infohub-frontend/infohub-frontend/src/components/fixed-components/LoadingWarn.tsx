import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";

interface LoadingWarnProps {}

const LoadingWarn: React.FC<LoadingWarnProps> = ({}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.25 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0 w-screen h-screen bg-black/80 backdrop-blur z-50 
    flex items-center justify-center"
    >
      <AiOutlineLoading3Quarters className="text-4xl text-white animate-spin" />
    </motion.div>
  );
};

export default LoadingWarn;
