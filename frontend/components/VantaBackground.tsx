"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import FOG from "vanta/dist/vanta.fog.min";

export default function VantaBackground() {
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            try {
                const effect = FOG({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    highlightColor: 0x10b981, // Emerald highlight
                    midtoneColor: 0x0f392b,   // Dark Emerald midtone
                    lowlightColor: 0x020202,  // Black/Dark lowlight
                    baseColor: 0x000000,      // Black base
                    blurFactor: 0.6,
                    speed: 1.2,
                    zoom: 1.5
                });
                setVantaEffect(effect);
            } catch (e) {
                console.error("Failed to initialize Vanta Fog:", e);
            }
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return <div ref={vantaRef} className="absolute inset-0 z-0 w-full h-full" />;
}
