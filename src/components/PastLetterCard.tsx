import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface PastLetterCardProps {
    date: string;
    body: string;
    isActive: boolean;
}

const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.3 },
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

function PastLetterCard({ date, body, isActive }: PastLetterCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.3 });
    const lines = body.split("\n");
    const shouldAnimate = isActive && isInView;

    return (
        <div
            ref={ref}
            className="w-[min(85vw,480px)] max-h-[70vh] overflow-y-auto bg-[#fffaf0] rounded-lg shadow-xl border border-black/5 p-8 sm:p-10 relative"
            style={{ transform: "rotate(-1deg)" }}
        >
            <div className="flex justify-end mb-4">
                <span className="text-sm text-rose-400 font-sans">{date}</span>
            </div>
            <div className="h-px bg-rose-100 mb-6" />
            {shouldAnimate ? (
                <motion.div
                    className="font-handwriting text-xl text-gray-700 leading-relaxed text-left"
                    variants={textContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {lines.map((line, i) => (
                        <motion.p key={i} variants={textLineVariants} className="mb-1">
                            {line || " "}
                        </motion.p>
                    ))}
                </motion.div>
            ) : (
                <div className="font-handwriting text-xl text-gray-700 leading-relaxed text-left opacity-60">
                    {lines.map((line, i) => (
                        <p key={i} className="mb-1">
                            {line || " "}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PastLetterCard;
