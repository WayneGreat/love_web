import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ParticleBackground from "./components/ParticleBackground";
import Timeline from "./components/Timeline";
import MusicPlayer from "./components/MusicPlayer";
import IntroSplash from "./components/IntroSplash";
import PasswordGate from "./components/PasswordGate";
import type { MusicPlayerHandle } from "./components/MusicPlayer";

function App() {
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const musicPlayerRef = useRef<MusicPlayerHandle>(null);

    const handleIntroExit = () => {
        setShowIntro(false);
        musicPlayerRef.current?.play();
    };

    return (
        <div className="min-h-screen relative">
            <AnimatePresence>
                {!passwordVerified && (
                    <PasswordGate onVerify={() => setPasswordVerified(true)} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {passwordVerified && showIntro && (
                    <IntroSplash onExit={handleIntroExit} />
                )}
            </AnimatePresence>
            {passwordVerified && !showIntro && (
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
