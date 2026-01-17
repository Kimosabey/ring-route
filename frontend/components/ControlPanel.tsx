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
        <div className="w-full max-w-sm mx-auto bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl">

            {/* Toggle Switch */}
            <div className="flex bg-black/40 rounded-xl p-1 mb-4 relative border border-white/5">
                <motion.div
                    className="absolute top-1 bottom-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-sm"
                    initial={false}
                    animate={{
                        left: mode === "route" ? "4px" : "50%",
                        width: "calc(50% - 6px)"
                    }}
                />
                <button
                    onClick={() => setMode("route")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-mono font-bold tracking-widest uppercase relative z-10 transition-colors ${mode === "route" ? "text-emerald-400" : "text-muted-foreground hover:text-white"}`}
                >
                    <Play className="w-3 h-3" /> Simulator
                </button>
                <button
                    onClick={() => setMode("manage")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-mono font-bold tracking-widest uppercase relative z-10 transition-colors ${mode === "manage" ? "text-emerald-400" : "text-muted-foreground hover:text-white"}`}
                >
                    <Settings2 className="w-3 h-3" /> Nodes
                </button>
            </div>

            <div className="space-y-4 min-h-[100px] flex flex-col justify-center">
                {mode === "manage" ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="NODE ID"
                                value={nodeId}
                                onChange={(e) => setNodeId(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-emerald-500/50 focus:outline-none placeholder:text-muted-foreground uppercase"
                            />
                            <button onClick={() => onAdd(nodeId)} disabled={!nodeId || isLoading} className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl transition-colors"><Plus className="w-4 h-4" /></button>
                            <button onClick={() => onRemove(nodeId)} disabled={!nodeId || isLoading} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-3 font-mono">Manage Active Workers</p>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex gap-2 group">
                            <input
                                type="text"
                                placeholder="REQUEST KEY"
                                value={routeKey}
                                onChange={(e) => setRouteKey(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-emerald-500/50 focus:outline-none placeholder:text-muted-foreground transition-all"
                            />
                            <button
                                onClick={() => onRoute(routeKey)}
                                disabled={!routeKey || isLoading}
                                className="px-6 bg-emerald-500 text-black text-xs font-mono font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] uppercase tracking-wider"
                            >
                                Route
                            </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-3 font-mono">Simulate Traffic Request</p>
                    </motion.div>
                )}
            </div>

        </div>
    );
}
