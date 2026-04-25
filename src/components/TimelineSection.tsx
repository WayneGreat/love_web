import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { TimelineEntry } from "../config";

interface TimelineSectionProps {
    entry: TimelineEntry;
    index: number;
    onInView: (index: number) => void;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: "easeIn" as const },
    },
};

const imageVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3, ease: "easeIn" as const },
    },
};

function TimelineSection({ entry, index, onInView }: TimelineSectionProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });

    useEffect(() => {
        if (isInView) onInView(index);
    }, [isInView, index, onInView]);

    return (
        <motion.section
            ref={ref}
            className="h-screen snap-start flex items-center justify-center px-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.5 }}
        >
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <motion.div
                    className="flex-1 text-center md:text-left"
                    variants={containerVariants}
                >
                    <motion.p
                        className="text-sm text-rose-300 mb-2"
                        variants={itemVariants}
                    >
                        {entry.date}
                    </motion.p>
                    <motion.h2
                        className="text-3xl font-handwriting text-rose-600 mb-4"
                        variants={itemVariants}
                    >
                        {entry.title}
                    </motion.h2>
                    <motion.p
                        className="text-rose-400 leading-relaxed"
                        variants={itemVariants}
                    >
                        {entry.desc}
                    </motion.p>
                </motion.div>
                <motion.div
                    className="flex-1 w-full"
                    variants={imageVariants}
                >
                    <img
                        src={entry.image}
                        alt={entry.title}
                        className="w-full max-h-[60vh] object-cover rounded-xl shadow-lg"
                    />
                </motion.div>
            </div>
        </motion.section>
    );
}

export default TimelineSection;
