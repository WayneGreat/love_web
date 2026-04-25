import ParticleBackground from "./components/ParticleBackground";
import Timeline from "./components/Timeline";

function App() {
    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <div className="relative z-10">
                <Timeline />
            </div>
        </div>
    );
}

export default App;
