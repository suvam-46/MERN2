

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

export default function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Controls for background animation
  const bgControls = useAnimation();

  // Start background pulse animation loop on mount
  useEffect(() => {
    bgControls.start({
      backgroundColor: ["#ffffff", "#e6f0ff", "#ffffff"],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    });
  }, [bgControls]);

  return (
    <motion.div
      className="flex h-screen w-full flex-col items-center justify-center"
      animate={bgControls}
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Logo with bounce + slow rotate */}
      <motion.img
        src="/images/Logo.png"
        alt="Logo"
        className="mb-10 w-28"
        initial={{ opacity: 0, scale: 0.8, rotate: 0, y: 0 }}
        animate={{
          opacity: 1,
          scale: [1, 1.1, 1],
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />

      {/* Loading Bar with pulse on background + filling */}
      <motion.div
        className="h-2 w-56 overflow-hidden rounded-full"
        initial={{ backgroundColor: "#cfe3ff" }}
        animate={{
          backgroundColor: ["#cfe3ff", "#a2bfff", "#cfe3ff"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
