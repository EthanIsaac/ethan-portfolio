import { motion } from "framer-motion";
import { LayoutContainer } from "./styled";

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.5, type: "linear" }}
      >
        {children}
      </motion.main>
    </LayoutContainer>
  );
};

export default Layout;
