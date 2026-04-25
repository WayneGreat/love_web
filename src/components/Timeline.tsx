import { useCallback, useRef, useState } from "react";
import config from "../config";
import TimelineSection from "./TimelineSection";
import TimelineNav from "./TimelineNav";

function Timeline() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleInView = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);

    const handleNavigate = useCallback((index: number) => {
        const el = sectionRefs.current[index];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return (
        <>
            <div className="h-screen overflow-y-auto snap-y snap-mandatory">
                {config.timeline.map((entry, i) => (
                    <div
                        key={entry.date}
                        ref={(el) => { sectionRefs.current[i] = el; }}
                    >
                        <TimelineSection
                            entry={entry}
                            index={i}
                            onInView={handleInView}
                        />
                    </div>
                ))}
            </div>
            <TimelineNav
                activeIndex={activeIndex}
                total={config.timeline.length}
                onNavigate={handleNavigate}
            />
        </>
    );
}

export default Timeline;
