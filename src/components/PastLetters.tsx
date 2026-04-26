import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { PastLetter } from "../config";
import PastLetterCard from "./PastLetterCard";

interface PastLettersProps {
    letters: PastLetter[];
    index: number;
    onInView: (index: number) => void;
}

function PastLetters({ letters, index, onInView }: PastLettersProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (isInView) onInView(index);
    }, [isInView, index, onInView]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isInView) return;
            if (e.key === "ArrowLeft") {
                setActiveIndex((prev) => Math.max(0, prev - 1));
            } else if (e.key === "ArrowRight") {
                setActiveIndex((prev) => Math.min(letters.length - 1, prev + 1));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isInView, letters.length]);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goNext = useCallback(() => {
        setActiveIndex((prev) => Math.min(letters.length - 1, prev + 1));
    }, [letters.length]);

    const handleDragEnd = useCallback(
        (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
            if (info.offset.x > 50) {
                goPrev();
            } else if (info.offset.x < -50) {
                goNext();
            }
        },
        [goPrev, goNext]
    );

    return (
        <div
            ref={ref}
            className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        >
            {/* Title */}
            <motion.h2
                className="text-3xl sm:text-4xl font-bold text-rose-700 mb-10 font-handwriting tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
            >
                那些年的信
            </motion.h2>

            {/* Carousel area */}
            <div className="relative w-full max-w-4xl flex items-center justify-center">
                {/* Left arrow */}
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    aria-label="上一封信"
                    className="absolute left-0 sm:left-4 z-10 w-10 h-10 rounded-full border-2 border-rose-300 text-rose-400 flex items-center justify-center hover:scale-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-transform"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {/* Cards */}
                <motion.div
                    className="relative w-[min(85vw,480px)] h-[60vh] flex items-center justify-center"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                >
                    {letters.map((letter, i) => {
                        const offset = i - activeIndex;
                        const isActive = offset === 0;

                        return (
                            <motion.div
                                key={letter.date}
                                className="absolute"
                                initial={false}
                                animate={{
                                    x: offset * 320,
                                    scale: isActive ? 1 : 0.9,
                                    opacity: Math.abs(offset) <= 1 ? (isActive ? 1 : 0.5) : 0,
                                    rotate: isActive ? -1 : offset < 0 ? -3 : 3,
                                    pointerEvents: isActive ? "auto" : "none",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <PastLetterCard
                                    date={letter.date}
                                    body={letter.body}
                                    isActive={isActive}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Right arrow */}
                <button
                    type="button"
                    onClick={goNext}
                    disabled={activeIndex === letters.length - 1}
                    aria-label="下一封信"
                    className="absolute right-0 sm:right-4 z-10 w-10 h-10 rounded-full border-2 border-rose-300 text-rose-400 flex items-center justify-center hover:scale-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-transform"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            {/* Dots */}
            <div className="flex gap-2.5 mt-8" role="tablist">
                {letters.map((letter, i) => (
                    <button
                        key={letter.date}
                        type="button"
                        role="tab"
                        aria-selected={i === activeIndex}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none ${
                            i === activeIndex
                                ? "bg-rose-500 scale-125"
                                : "bg-rose-200 hover:bg-rose-300"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default PastLetters;
