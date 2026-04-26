import { useCallback, useRef, useState } from "react";
import config from "../config";
import TimelineSection from "./TimelineSection";
import TimelineNav from "./TimelineNav";
import LetterEnvelope from "./LetterEnvelope";
import PastLetters from "./PastLetters";

function Timeline() {
    const totalSections = config.timeline.length + 2;
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
                        className="snap-start"
                    >
                        <TimelineSection
                            entry={entry}
                            index={i}
                            onInView={handleInView}
                        />
                    </div>
                ))}
                <div
                    ref={(el) => { sectionRefs.current[config.timeline.length] = el; }}
                    className="snap-start"
                >
                    <PastLetters
                        letters={config.pastLetters}
                        index={config.timeline.length}
                        onInView={handleInView}
                    />
                </div>
                <div
                    ref={(el) => { sectionRefs.current[config.timeline.length + 1] = el; }}
                    className="snap-start"
                >
                    <LetterEnvelope
                        index={config.timeline.length + 1}
                        onInView={handleInView}
                    />
                </div>
            </div>
            <TimelineNav
                activeIndex={activeIndex}
                total={totalSections}
                onNavigate={handleNavigate}
            />
        </>
    );
}

export default Timeline;
