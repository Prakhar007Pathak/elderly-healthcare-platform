import { motion } from "framer-motion";

const ErrorBox = ({ message }) => {
    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg"
        >
            {message}
        </motion.div>
    );
};

export default ErrorBox;