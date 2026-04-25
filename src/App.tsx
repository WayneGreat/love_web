import ParticleBackground from "./components/ParticleBackground";
import Timeline from "./components/Timeline";
import MusicPlayer from "./components/MusicPlayer";

function App() {
    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <div className="relative z-10">
                <Timeline />
            </div>
            <MusicPlayer />
        </div>
    );
}

export default App;
