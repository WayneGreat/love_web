import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ParticleBackground from "./components/ParticleBackground";
import Timeline from "./components/Timeline";
import MusicPlayer from "./components/MusicPlayer";
import IntroSplash from "./components/IntroSplash";
import type { MusicPlayerHandle } from "./components/MusicPlayer";

function App() {
    const [showIntro, setShowIntro] = useState(true);
    const musicPlayerRef = useRef<MusicPlayerHandle>(null);

    const handleIntroExit = () => {
        setShowIntro(false);
        musicPlayerRef.current?.play();
    };

    return (
        <div className="min-h-screen relative">
            <AnimatePresence>
                {showIntro && (
                    <IntroSplash onExit={handleIntroExit} />
                )}
            </AnimatePresence>
            {!showIntro && (
                <>
                    <ParticleBackground />
                    <div className="relative z-10">
                        <Timeline />
                    </div>
                </>
            )}
            <MusicPlayer ref={musicPlayerRef} />
        </div>
    );
}

export default App;
