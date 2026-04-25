import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

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
                愿我们的故事一直继续下去 ✨
            </p>
        </motion.div>
    );
}

export default LetterEnvelope;
