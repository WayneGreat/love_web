import { useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import config from "../config";

interface PasswordGateProps {
    onVerify: () => void;
}

function PasswordGate({ onVerify }: PasswordGateProps) {
    const [inputValue, setInputValue] = useState("");
    const [hasError, setHasError] = useState(false);
    const controls = useAnimation();

    const handleVerify = useCallback(() => {
        if (inputValue === config.password) {
            onVerify();
        } else {
            setInputValue("");
            setHasError(true);
            controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
        }
    }, [inputValue, onVerify, controls]);


    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (hasError) {
            setHasError(false);
        }
    }, [hasError]);

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100 select-none"
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

            {/* Center content */}
            <h1 className="text-4xl md:text-5xl font-bold text-rose-500 mb-4 font-handwriting tracking-wider drop-shadow-sm">
                {config.passwordGate.title}
            </h1>
            <p className="text-lg md:text-xl text-rose-400 tracking-wide mb-10">
                {config.passwordGate.subtitle}
            </p>

            {/* Input + button */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                }}
                className="flex flex-col items-center"
            >
                <motion.div animate={controls} className="flex flex-col items-center">
                    <input
                        type="password"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder={config.passwordGate.placeholder}
                        aria-label={config.passwordGate.ariaLabel}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? "password-error" : undefined}
                        autoFocus
                        className="w-64 sm:w-80 px-6 py-3 rounded-full border-2 border-rose-300 bg-white/80 backdrop-blur-sm text-center text-rose-700 font-handwriting text-lg placeholder:text-rose-300 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-400/50"
                    />
                    <AnimatePresence>
                        {hasError && (
                            <motion.p
                                id="password-error"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 text-sm text-red-500 font-medium"
                                role="alert"
                            >
                                {config.passwordGate.errorText}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <button
                    type="submit"
                    className="mt-6 px-8 py-2.5 bg-rose-500 text-white rounded-full font-medium shadow-lg hover:bg-rose-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none cursor-pointer transition-transform"
                >
                    {config.passwordGate.buttonText}
                </button>
            </form>
        </motion.div>
    );
}

export default PasswordGate;
