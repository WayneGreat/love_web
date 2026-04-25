import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import config from "../config";

const flapVariants = {
    closed: {
        rotateX: 0,
        transition: { duration: 0.6, ease: "easeIn" as const, delay: 0.3 },
    },
    open: {
        rotateX: 180,
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

    return (
        <motion.div
            ref={ref}
            className="h-screen flex items-center justify-center px-6"
            variants={rootVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <div className="relative" style={{ perspective: 800 }}>
                {/* Envelope body */}
                <div className="w-80 h-56 sm:w-96 sm:h-64 bg-gradient-to-b from-rose-100 to-rose-200 rounded-lg shadow-xl relative overflow-visible">
                    {/* Flap */}
                    <motion.div
                        className="absolute -top-[80px] sm:-top-[96px] left-0 right-0 h-[80px] sm:h-[96px] bg-gradient-to-b from-rose-300 to-rose-200 rounded-t-lg z-10"
                        style={{
                            clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                            transformOrigin: "top",
                        }}
                        variants={flapVariants}
                        animate={isOpen ? "open" : "closed"}
                    />

                    {/* Seal */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-rose-600 cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none ${isOpen ? "z-0" : "z-20"}`}
                        aria-label="Open envelope"
                    >
                        <span className="block w-3 h-3 mx-auto mt-0.5 rounded-full border-2 border-rose-300" />
                    </button>

                    {/* Letter */}
                    <motion.div
                        className={`absolute left-2.5 right-2.5 top-4 bottom-2 bg-white rounded-md shadow-inner p-5 pt-8 overflow-y-auto max-h-[200px] ${isOpen ? "z-[15]" : "z-0"}`}
                        variants={letterVariants}
                        animate={isOpen ? "open" : "closed"}
                        aria-hidden={!isOpen}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
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
        </motion.div>
    );
}

export default LetterEnvelope;
