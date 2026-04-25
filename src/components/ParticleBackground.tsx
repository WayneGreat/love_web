import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadHeartShape } from "@tsparticles/shape-heart";
import type { ISourceOptions } from "@tsparticles/engine";
import config from "../config";

function ParticleBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        let cancelled = false;
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadHeartShape(engine);
        }).then(() => {
            if (!cancelled) setInit(true);
        }).catch((err) => {
            console.error("Failed to initialize particles engine:", err);
        });
        return () => { cancelled = true; };
    }, []);

    const particlesOptions = useMemo<ISourceOptions>(
        () => ({
            fullScreen: false,
            fpsLimit: 60,
            particles: {
                color: {
                    value: config.themeColor.primary,
                },
                shape: {
                    type: "heart",
                },
                number: {
                    value: 35,
                    density: {
                        enable: true,
                        area: 900,
                    },
                },
                size: {
                    value: {
                        min: 6,
                        max: 14,
                    },
                },
                opacity: {
                    value: {
                        min: 0.4,
                        max: 0.8,
                    },
                },
                move: {
                    enable: true,
                    speed: 1.2,
                    direction: "bottom",
                    outModes: {
                        default: "out",
                    },
                    straight: false,
                },
                wobble: {
                    enable: true,
                    distance: 15,
                    speed: 8,
                },
            },
            detectRetina: true,
        }),
        [],
    );

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {init && (
                <Particles
                    id="heart-particles"
                    options={particlesOptions}
                />
            )}
        </div>
    );
}

export default ParticleBackground;
