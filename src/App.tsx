import config from "./config";

function App() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center font-handwriting">
                <h1 className="text-4xl text-rose-600 mb-4">{config.timeline[0].title}</h1>
                <p className="text-rose-400">{config.timeline[0].desc}</p>
            </div>
        </div>
    );
}

export default App;
