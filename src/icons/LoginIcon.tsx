import { motion } from "framer-motion";
import type { SVGProps } from "react";

interface LoginIconProps extends SVGProps<SVGSVGElement> {
  isLoggedIn?: boolean;
}

export const LoginIcon = ({ isLoggedIn = false, ...props }: LoginIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    {isLoggedIn ? (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <motion.path
          d="M16 17l5-5-5-5"
          animate={{ x: isLoggedIn ? [0, -3, 0] : [0, 3, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M16 12H4"
          animate={{ x: isLoggedIn ? [0, -3, 0] : [0, 3, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </>
    ) : (
      <>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <motion.path
          d="M10 17l5-5-5-5"
          animate={{ x: [0, 3, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <path d="M15 12H3" />
      </>
    )}
  </svg>
);