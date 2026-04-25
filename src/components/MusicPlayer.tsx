import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion } from "framer-motion";
import config from "../config";

export interface MusicPlayerHandle {
    play: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerHandle>(function MusicPlayer(_props, ref) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useImperativeHandle(ref, () => ({
        play: async () => {
            const audio = audioRef.current;
            if (!audio || isDisabled || isPlaying) return;
            try {
                await audio.play();
                setIsPlaying(true);
            } catch {
                // Silently ignore
            }
        },
    }), [isDisabled, isPlaying]);

    // Autoplay on mount: try play(), fall back to first-interaction activation
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let activateOnInteraction: (() => void) | null = null;

        const startPlay = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                if (err instanceof DOMException && err.name === "NotAllowedError") {
                    activateOnInteraction = async () => {
                        try {
                            await audio.play();
                            setIsPlaying(true);
                        } catch {
                            // Silently ignore — user can still click the button
                        }
                    };
                    document.addEventListener("click", activateOnInteraction, { once: true });
                }
            }
        };

        startPlay();

        return () => {
            if (activateOnInteraction) {
                document.removeEventListener("click", activateOnInteraction);
            }
        };
    }, []);

    // Handle audio error (e.g. file not found) — disable button silently
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleError = () => {
            setIsDisabled(true);
            setIsPlaying(false);
        };
        audio.addEventListener("error", handleError);
        return () => audio.removeEventListener("error", handleError);
    }, []);

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio || isDisabled) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch {
                // AbortError or NotAllowedError — state stays paused
            }
        }
    }, [isPlaying, isDisabled]);

    return (
        <>
            <audio ref={audioRef} src={config.bgMusic} loop preload="auto" />
            <motion.button
                onClick={togglePlay}
                disabled={isDisabled}
                className={`fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-rose-500/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-white text-lg focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:outline-none ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                whileTap={!isDisabled ? { scale: 0.85 } : undefined}
                aria-label={isPlaying ? "暂停音乐" : "播放音乐"}
            >
                {isPlaying ? "⏸" : "♪"}
            </motion.button>
        </>
    );
});

export default MusicPlayer;
