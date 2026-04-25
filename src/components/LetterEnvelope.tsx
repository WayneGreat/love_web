import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import config from "../config";

const flapVariants = {
    closed: {
        rotateX: 0,
        transition: { duration: 0.6, ease: "easeIn" as const, delay: 0.3 },
    },
    open: {
        rotateX: -180,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
};

const letterVariants = {
    closed: {
        y: 0,
        opacity: 0,
        transition: { duration: 0.4, ease: "easeIn" as const, delay: 0.1 },
    },
    open: {
        y: -120,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const, delay: 0.4 },
    },
};

const textContainerVariants = {
    closed: {
        opacity: 1,
        transition: { duration: 0.2 },
    },
    open: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.6 },
    },
};

const rootVariants = {
    hidden: { opacity: 0, transition: { duration: 0.6 } },
    visible: { opacity: 1, transition: { duration: 0.6 } },
};

const textLineVariants = {
    closed: { opacity: 0 },
    open: {
        opacity: 1,
        transition: { duration: 0.3 },
    },
};

interface LetterEnvelopeProps {
    index: number;
    onInView: (index: number) => void;
}

function LetterEnvelope({ index, onInView }: LetterEnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });

    useEffect(() => {
        if (isInView) onInView(index);
    }, [isInView, index, onInView]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <motion.div
            ref={ref}
            className="h-screen flex flex-col items-center justify-center px-6 relative"
            variants={rootVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-rose-700 mb-10 font-handwriting tracking-wide">
                给你的一封信
            </h2>

            {/* Envelope container */}
            <div className="relative" style={{ perspective: 800 }}>
                {/* Envelope body */}
                <div className="w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-b from-pink-100 to-pink-200 rounded-xl shadow-2xl relative border-4 border-pink-300 overflow-visible">
                    {/* Flap */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-[100px] sm:h-[110px] bg-gradient-to-b from-pink-400 to-pink-300 z-10"
                        style={{
                            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                            transformOrigin: "top",
                        }}
                        variants={flapVariants}
                        animate={isOpen ? "open" : "closed"}
                    />

                    {/* Open button */}
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.button
                                onClick={handleOpen}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.2, delay: 1.1 } }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-rose-500 text-white rounded-full shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none z-20"
                            >
                                点击打开信封
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Letter */}
                    <motion.div
                        className={`absolute left-3 right-3 top-6 bottom-3 bg-white rounded-md shadow-inner p-5 pt-8 overflow-y-auto ${isOpen ? "z-[15]" : "z-0"}`}
                        variants={letterVariants}
                        animate={isOpen ? "open" : "closed"}
                        aria-hidden={!isOpen}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            tabIndex={isOpen ? 0 : -1}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center text-rose-500 text-xs font-bold focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                            aria-label="Close envelope"
                        >
                            ✕
                        </button>

                        {/* Letter text */}
                        <motion.div
                            className="font-handwriting text-rose-700 text-sm sm:text-base leading-relaxed whitespace-pre-line"
                            variants={textContainerVariants}
                            animate={isOpen ? "open" : "closed"}
                        >
                            {config.letter.split("\n").map((line, i) => (
                                <motion.p key={i} variants={textLineVariants}>
                                    {line || " "}
                                </motion.p>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Footer text */}
            <p className="text-sm text-rose-500 italic tracking-wide mt-6">
                愿我们的故事一直继续下去 ✨
            </p>
        </motion.div>
    );
}

export default LetterEnvelope;
