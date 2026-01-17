"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Node {
    hash: number;
    node: string;
}

interface RingVisualizerProps {
    nodes: Node[];
    lastKey?: string;
    lastRoutedNode?: string;
    guideStep?: number;
}

export function RingVisualizer({ nodes, lastKey, lastRoutedNode, guideStep = 0 }: RingVisualizerProps) {
    const MAX_HASH = 4294967295;
    const isGuide = guideStep > 0;

    // Filter to unique nodes
    const uniqueNodes = nodes.filter((n, index, self) =>
        index === self.findIndex((t) => t.node === n.node)
    );

    // Collision Avoidance Logic for Visualization
    const getRawAngle = (hash: number) => ((hash / MAX_HASH) * 360) - 90;

    // 1. Calculate raw angles
    let angleMap = uniqueNodes.map(n => ({
        id: n.node,
        rawHash: n.hash,
        angle: getRawAngle(n.hash)
    }));

    // 2. Sort by angle to process sequentially
    angleMap.sort((a, b) => a.angle - b.angle);

    // 3. Nudge angles to enforce minimum separation
    const MIN_SEPARATION = 20; // degrees
    for (let i = 1; i < angleMap.length; i++) {
        const prev = angleMap[i - 1];
        const curr = angleMap[i];
        if (curr.angle - prev.angle < MIN_SEPARATION) {
            curr.angle = prev.angle + MIN_SEPARATION;
        }
    }

    // 4. Create lookup map
    const nodeAngles = new Map(angleMap.map(i => [i.id, i.angle]));

    // Helper to get position from ADJUSTED angle
    const getAdjustedPos = (nodeId: string, radius: number) => {
        const angle = nodeAngles.get(nodeId) || 0;
        const rad = (angle * Math.PI) / 180;
        return {
            x: 50 + radius * Math.cos(rad),
            y: 50 + radius * Math.sin(rad),
        };
    };

    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <svg
                className="w-full h-full max-w-[800px] aspect-square overflow-visible"
                viewBox="0 0 100 100"
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                    </linearGradient>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,0 L10,5 L0,10" fill="#f43f5e" />
                    </marker>
                </defs>

                {/* MAIN VISUALIZER GROUP */}
                <g className={`transition-opacity duration-500 ${isGuide ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>

                    {/* 1. OUTER RING (Fixed Geometry, Moving Dashes) */}
                    <motion.circle
                        cx="50" cy="50" r="38"
                        fill="none"
                        stroke="#10b981"
                        strokeOpacity="0.3"
                        strokeWidth="0.2"
                        strokeDasharray="4 2 1 2"
                        strokeLinecap="round"
                        animate={{ strokeDashoffset: [0, -200] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    />

                    {/* 2. CONNECTION BEAMS */}
                    <AnimatePresence>
                        {lastRoutedNode && uniqueNodes.filter(n => n.node === lastRoutedNode).map((n) => {
                            const pos = getAdjustedPos(n.node, 38);
                            return (
                                <g key={`beam-group-${n.hash}`}>
                                    {/* Laser Beam */}
                                    <motion.line
                                        initial={{ opacity: 0, pathLength: 0 }}
                                        animate={{ opacity: 1, pathLength: 1 }}
                                        exit={{ opacity: 0 }}
                                        x1="50" y1="50"
                                        x2={pos.x} y2={pos.y}
                                        stroke="url(#beamGrad)"
                                        strokeWidth="0.4"
                                        strokeLinecap="round"
                                    />
                                    {/* Moving Data Packet */}
                                    <motion.circle r="1" fill="#ecfdf5">
                                        <animateMotion dur="0.3s" repeatCount="1" path={`M 50 50 L ${pos.x} ${pos.y}`} />
                                    </motion.circle>
                                </g>
                            );
                        })}
                    </AnimatePresence>

                    {/* 3. NODES (Dots & Labels) */}
                    <g>
                        {uniqueNodes.map((n) => {
                            const pos = getAdjustedPos(n.node, 38);
                            const isSelected = lastRoutedNode === n.node;

                            // Calculate label position (push outward from center)
                            const angle = (nodeAngles.get(n.node) || 0);
                            const angleRad = angle * Math.PI / 180;
                            // Push label further out
                            const labelX = 50 + 46 * Math.cos(angleRad);
                            const labelY = 50 + 46 * Math.sin(angleRad);

                            return (
                                <motion.g
                                    key={`${n.node}-${n.hash}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: isSelected ? 1.2 : 1 }}
                                >
                                    {/* Ripple Effect for Active Node */}
                                    {isSelected && (
                                        <motion.circle
                                            cx={pos.x} cy={pos.y}
                                            initial={{ r: 2, opacity: 1 }}
                                            animate={{ r: 6, opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="0.2"
                                        />
                                    )}

                                    {/* Main Node Dot */}
                                    <circle
                                        cx={pos.x} cy={pos.y}
                                        r={isSelected ? 2 : 1.2}
                                        fill={isSelected ? "#10b981" : "#022c22"}
                                        stroke={isSelected ? "#ecfdf5" : "#10b981"}
                                        strokeWidth={isSelected ? 0.3 : 0.2}
                                        className="transition-all duration-300 cursor-pointer"
                                        filter={isSelected ? "url(#glow)" : ""}
                                    />

                                    {/* Node Label */}
                                    <text
                                        x={labelX} y={labelY}
                                        fill={isSelected ? "#ecfdf5" : "#34d399"}
                                        fontSize="2"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        className={`font-mono transition-opacity duration-300 ${isSelected ? 'opacity-100 font-bold' : 'opacity-60'}`}
                                        transform={`rotate(0, ${labelX}, ${labelY})`}
                                    >
                                        {n.node}
                                    </text>
                                </motion.g>
                            )
                        })}
                    </g>

                    {/* 4. INNER ROTATING RING (Detail) */}
                    <motion.g
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px" }}
                    >
                        <circle
                            cx="50" cy="50" r="15"
                            fill="none"
                            stroke="#10b981"
                            strokeOpacity="0.2"
                            strokeWidth="0.1"
                            strokeDasharray="2 4"
                        />
                    </motion.g>

                    {/* 5. CENTER HUB LABEL */}
                    <g>
                        <circle cx="50" cy="50" r="10" fill="black" fillOpacity="0.8" />
                        <foreignObject x="35" y="35" width="30" height="30">
                            <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                <div className="text-[3px] font-bold text-white tracking-widest">RING</div>
                                <div className="text-[2px] font-mono text-emerald-500 font-bold tracking-widest mt-0.5">ROUTE</div>
                            </div>
                        </foreignObject>
                    </g>
                </g>

                {/* GUIDE MODE OVERLAYS */}
                <AnimatePresence>
                    {guideStep === 1 && (
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="0.2" strokeDasharray="2 2" />
                            <text x="50" y="8" fill="#ecfdf5" fontSize="2.5" fontStyle="italic" textAnchor="middle">0</text>
                            <text x="50" y="94" fill="#ecfdf5" fontSize="2.5" fontStyle="italic" textAnchor="middle">MAX_HASH</text>
                            <text x="50" y="48" fill="#34d399" fontSize="6" fontWeight="bold" textAnchor="middle">THE RING</text>
                            <text x="50" y="55" fill="#10b981" fontSize="2.5" textAnchor="middle">A Continuous Hash Space</text>
                        </motion.g>
                    )}

                    {guideStep === 2 && (
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {uniqueNodes.map((n) => {
                                const pos = getAdjustedPos(n.node, 38);
                                return (
                                    <circle key={'guide-' + n.node} cx={pos.x} cy={pos.y} r="4" fill="none" stroke="#fcd34d" strokeWidth="0.3">
                                        <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="stroke-opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
                                    </circle>
                                )
                            })}
                            <text x="50" y="48" fill="#fcd34d" fontSize="6" fontWeight="bold" textAnchor="middle">NODES</text>
                            <text x="50" y="55" fill="#fbbf24" fontSize="2.5" textAnchor="middle">Placed by Hash(IP)</text>
                        </motion.g>
                    )}

                    {guideStep === 3 && (
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Example Key */}
                            <circle cx="20" cy="50" r="1.5" fill="#f43f5e" />
                            <text x="18" y="51" fill="#f43f5e" fontSize="2.5" textAnchor="end">Key</text>

                            {/* Routing Path (Arc) */}
                            <defs>
                                <path id="routePath" d="M 20 50 A 30 30 0 0 1 50 20" />
                            </defs>
                            {/* Dashed arrow */}
                            <path d="M 22 48 Q 25 35 35 25" fill="none" stroke="#f43f5e" strokeWidth="0.4" strokeDasharray="2 2" markerEnd="url(#arrow)" />

                            <text x="50" y="48" fill="#f43f5e" fontSize="6" fontWeight="bold" textAnchor="middle">ROUTING</text>
                            <text x="50" y="55" fill="#fb7185" fontSize="2.5" textAnchor="middle">Clockwise to Next Node</text>
                        </motion.g>
                    )}
                </AnimatePresence>
            </svg>
        </div>
    );
}
