import { motion } from "motion/react";

interface TextRevealProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}

export default function TextReveal({
  text,
  className = "",
  tag = "h2",
  delay = 0
}: TextRevealProps) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // cinematic cubic-bezier easing
      },
    },
  };

  const Tag = tag;

  return (
    <Tag className={`sr-only-fallback ${className}`}>
      {/* Screen reader helper */}
      <span className="sr-only">{text}</span>
      
      {/* Visual animated blocks */}
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px -15% 0px" }}
        className="inline-flex flex-wrap aria-hidden:true"
        aria-hidden="true"
      >
        {words.map((word, idx) => (
          <span key={idx} className="relative overflow-hidden mr-[0.25em] py-1 inline-block">
            <motion.span
              variants={wordVariants}
              className="inline-block origin-bottom font-inherit"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
