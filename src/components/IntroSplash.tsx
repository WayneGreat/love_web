import { useEffect } from "react";
import { motion } from "framer-motion";
import config from "../config";

interface IntroSplashProps {
    onExit: () => void;
}

function IntroSplash({ onExit }: IntroSplashProps) {
    useEffect(() => {
        let touchStartY = 0;

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                onExit();
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            if (deltaY > 30) {
                onExit();
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [onExit]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100 cursor-pointer select-none"
            onClick={onExit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" as const }}
        >
            {/* Floating heart decorations */}
            <span className="absolute top-[15%] left-[10%] text-rose-400 text-2xl animate-float-heart">
                ♥
            </span>
            <span className="absolute top-[25%] right-[12%] text-rose-300 text-xl animate-float-heart-delay">
                ♥
            </span>
            <span className="absolute bottom-[20%] left-[15%] text-rose-300 text-lg animate-float-heart">
                ♥
            </span>
            <span className="absolute bottom-[30%] right-[10%] text-rose-400 text-2xl animate-float-heart-delay">
                ♥
            </span>

            {/* Center text */}
            <h1 className="text-5xl md:text-7xl font-bold text-rose-500 mb-6 tracking-wider drop-shadow-sm">
                {config.intro.title}
            </h1>
            <p className="text-xl md:text-2xl text-rose-400 tracking-wide">
                {config.intro.subtitle}
            </p>

            {/* Bottom hint + arrow */}
            <div className="absolute bottom-12 flex flex-col items-center gap-2">
                <p className="text-sm text-rose-400 tracking-widest">
                    {config.intro.hint}
                </p>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                    }}
                    className="text-rose-400 text-xl"
                >
                    ↓
                </motion.div>
            </div>
        </motion.div>
    );
}

export default IntroSplash;
