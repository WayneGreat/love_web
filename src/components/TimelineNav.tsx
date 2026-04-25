import { motion } from "framer-motion";

interface TimelineNavProps {
    activeIndex: number;
    total: number;
    onNavigate: (index: number) => void;
}

function TimelineNav({ activeIndex, total, onNavigate }: TimelineNavProps) {
    return (
        <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
            {Array.from({ length: total }, (_, i) => (
                <button
                    key={i}
                    onClick={() => onNavigate(i)}
                    className="p-1 outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:rounded-full"
                    aria-label={`Go to section ${i + 1}`}
                >
                    <motion.span
                        className="block w-3 h-3 rounded-full"
                        animate={
                            i === activeIndex
                                ? { scale: 1.25, backgroundColor: "#e11d48" }
                                : { scale: 1, backgroundColor: "rgba(253,164,175,0.5)" }
                        }
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                </button>
            ))}
        </nav>
    );
}

export default TimelineNav;
