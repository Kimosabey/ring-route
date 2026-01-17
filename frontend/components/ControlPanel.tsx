"use client";

import { useState } from "react";
import { Plus, Trash2, Play, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

interface ControlPanelProps {
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
    onRoute: (key: string) => void;
    isLoading: boolean;
}

export function ControlPanel({ onAdd, onRemove, onRoute, isLoading }: ControlPanelProps) {
    const [nodeId, setNodeId] = useState("");
    const [routeKey, setRouteKey] = useState("");
    const [mode, setMode] = useState<"manage" | "route">("route");

    return (
        <div className="w-full max-w-sm mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl overflow-hidden ring-1 ring-white/5">

            {/* Toggle Switch */}
            <div className="flex bg-white/5 rounded-2xl p-1 mb-3 relative">
                <motion.div
                    className="absolute top-1 bottom-1 bg-white/10 rounded-xl shadow-sm"
                    initial={false}
                    animate={{
                        left: mode === "route" ? "4px" : "50%",
                        width: "calc(50% - 6px)"
                    }}
                />
                <button
                    onClick={() => setMode("route")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold tracking-wide relative z-10 transition-colors ${mode === "route" ? "text-white" : "text-muted-foreground"}`}
                >
                    <Play className="w-3.5 h-3.5" /> SIMULATOR
                </button>
                <button
                    onClick={() => setMode("manage")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold tracking-wide relative z-10 transition-colors ${mode === "manage" ? "text-white" : "text-muted-foreground"}`}
                >
                    <Settings2 className="w-3.5 h-3.5" /> NODES
                </button>
            </div>

            <div className="p-2 space-y-4 min-h-[100px] flex flex-col justify-center">
                {mode === "manage" ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Node ID (e.g. node-01)"
                                value={nodeId}
                                onChange={(e) => setNodeId(e.target.value)}
                                className="flex-1 bg-black/40 border-0 ring-1 ring-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-emerald-500/50 focus:outline-none placeholder:text-white/20"
                            />
                            <button onClick={() => onAdd(nodeId)} disabled={!nodeId || isLoading} className="p-3 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-colors border border-white/5"><Plus className="w-5 h-5" /></button>
                            <button onClick={() => onRemove(nodeId)} disabled={!nodeId || isLoading} className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors border border-white/5"><Trash2 className="w-5 h-5" /></button>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-3">Enter a unique ID to add/remove dedicated workers.</p>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex gap-2 group">
                            <input
                                type="text"
                                placeholder="Key (e.g. user_123)"
                                value={routeKey}
                                onChange={(e) => setRouteKey(e.target.value)}
                                className="flex-1 bg-black/40 border-0 ring-1 ring-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-emerald-500/50 focus:outline-none placeholder:text-white/20 transition-shadow"
                            />
                            <button
                                onClick={() => onRoute(routeKey)}
                                disabled={!routeKey || isLoading}
                                className="px-6 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                            >
                                Route
                            </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-3">Map a request key to its destination node.</p>
                    </motion.div>
                )}
            </div>

        </div>
    );
}
