import config from "./config";
import ParticleBackground from "./components/ParticleBackground";

function App() {
    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <div className="relative z-10">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center font-handwriting">
                        <h1 className="text-4xl text-rose-600 mb-4">
                            {config.timeline[0].title}
                        </h1>
                        <p className="text-rose-400">
                            {config.timeline[0].desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
