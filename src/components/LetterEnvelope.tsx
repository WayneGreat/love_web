import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import config from "../config";

const flapVariants = {
    closed: {
        rotateX: 0,
        transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.5 },
    },
    open: {
        rotateX: -180,
        transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.2 },
    },
};

const rootVariants = {
    hidden: { opacity: 0, transition: { duration: 0.6 } },
    visible: { opacity: 1, transition: { duration: 0.6 } },
};

const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.4 },
    },
};

const textLineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
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
                {config.letter.title}
            </h2>

            {/* Envelope container */}
            <div className="relative" style={{ perspective: 800 }}>
                {/* Envelope body */}
                <div className="w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-b from-pink-100 to-pink-200 rounded-xl shadow-2xl relative border-4 border-pink-300">
                    {/* Flap */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-[100px] sm:h-[110px] bg-gradient-to-b from-pink-400 to-pink-300 z-10 origin-top"
                        style={{
                            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                        }}
                        variants={flapVariants}
                        animate={isOpen ? "open" : "closed"}
                    />

                    {/* Open button */}
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.button
                                type="button"
                                onClick={handleOpen}
                                aria-expanded={isOpen}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.2, delay: 1.1 } }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-7 py-2.5 bg-rose-500 text-white rounded-full text-sm font-medium shadow-lg hover:bg-rose-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none z-30 cursor-pointer"
                            >
                                点击打开信封
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer text */}
            <p className="text-sm text-rose-500 italic tracking-wide mt-6">
                {config.letter.footer}
            </p>

            {/* Fullscreen letter overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-pink-50/90 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        />

                        {/* Letter card container */}
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                            initial={{ opacity: 0, scale: 0.3, y: 120 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.3, y: 120 }}
                            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.8 }}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-10 relative">
                                {/* Close button */}
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    aria-label="关闭信件"
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-md hover:scale-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none cursor-pointer transition-transform"
                                >
                                    ×
                                </button>

                                {/* Letter title */}
                                <h3 className="text-2xl sm:text-3xl font-bold text-rose-700 text-center mb-6 sm:mb-8 font-handwriting">
                                    {config.letter.title}
                                </h3>

                                {/* Letter body with staggered reveal */}
                                <motion.div
                                    className="font-handwriting text-rose-700 text-base sm:text-lg leading-relaxed text-center px-2"
                                    variants={textContainerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {config.letter.body.split("\n").map((line, i) => (
                                        <motion.p key={i} variants={textLineVariants} className="mb-1">
                                            {line || " "}
                                        </motion.p>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default LetterEnvelope;
