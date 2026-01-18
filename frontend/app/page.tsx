"use client";

import { useEffect, useState } from "react";
import { RingVisualizer } from "@/components/RingVisualizer";
import { ControlPanel } from "@/components/ControlPanel";
import VantaBackground from "@/components/VantaBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Layers, Cpu } from "lucide-react";

interface Node {
  hash: number;
  node: string;
}

export default function Home() {
  const [topology, setTopology] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRoute, setLastRoute] = useState<{ key: string; node: string; hash?: number } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [guideStep, setGuideStep] = useState(0);

  // Fetch Topology
  const fetchTopology = async () => {
    try {
      const data = await fetch("http://127.0.0.1:3002/api/topology").then(r => r.json());
      setTopology(data);
    } catch (e) { console.error(e) }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3002/api/topology");
        if (res.ok) setTopology(await res.json());
      } catch (e) { console.error("API Error", e) }
    }
    init();
    const i = setInterval(init, 2000);
    return () => clearInterval(i);
  }, []);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8));

  const handleAddNode = async (id: string) => {
    setLoading(true);
    addLog(`CMD: Adding Node '${id}'...`);
    await new Promise(r => setTimeout(r, 500));
    await fetch(`http://127.0.0.1:3002/api/nodes/${id}`, { method: "POST" });
    addLog(`SUCCESS: Node '${id}' joined the ring.`);
    addLog(`INFO: Virtual nodes redistributed.`);
    await fetchTopology();
    setLoading(false);
  };

  const handleRemoveNode = async (id: string) => {
    setLoading(true);
    addLog(`CMD: Removing Node '${id}'...`);
    await fetch(`http://127.0.0.1:3002/api/nodes/${id}`, { method: "DELETE" });
    addLog(`SUCCESS: Node '${id}' terminated.`);
    addLog(`INFO: Keys re-balanced to remaining nodes.`);
    await fetchTopology();
    setLoading(false);
  };

  const handleRoute = async (key: string) => {
    setLoading(true);
    addLog(`REQ: Route key '${key}'`);

    // 1. Simulate Hashing (Visual only)
    await new Promise(r => setTimeout(r, 300));
    addLog(`HASH: '${key}' -> [Calculating 32-bit Hash]...`);

    const res = await fetch(`http://127.0.0.1:3002/api/route?key=${key}`).then(r => r.json());

    await new Promise(r => setTimeout(r, 300));
    addLog(`LOOKUP: Searching ring clockwise...`);

    await new Promise(r => setTimeout(r, 300));
    setLastRoute({ key: key, node: res.routed_to });
    addLog(`FOUND: Nearest Node is '${res.routed_to}'`);
    addLog(`DONE: Request routed to ${res.routed_to}`);
    setLoading(false);
  };

  return (
    <main className="h-screen w-screen bg-black overflow-hidden relative font-body text-foreground selection:bg-emerald-500/30">

      {/* 1. LAYER: VANTA FOG BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <VantaBackground />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000_100%)] opacity-80" />
      </div>

      {/* 2. HEADER */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-50">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/20 shadow-xl">
          <h1 className="font-headings text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
            RING<span className="text-white">ROUTE</span>
          </h1>
          <p className="text-[10px] text-emerald-500/80 uppercase tracking-[0.3em] mt-1 pl-1 font-mono">Consistent Hashing Protocol</p>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button onClick={() => setGuideStep(gs => gs === 0 ? 1 : 0)} className="px-6 py-2 bg-emerald-900/20 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-mono transition-colors uppercase tracking-widest backdrop-blur-md">
            {guideStep === 0 ? "Explain Protocol" : "Exit Guide"}
          </button>
        </div>
      </header>

      {/* 3. CENTER VISUALIZER */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-[85vw] h-[85vh] pointer-events-auto flex items-center justify-center">
          <RingVisualizer
            nodes={topology}
            lastKey={lastRoute?.key}
            lastRoutedNode={lastRoute?.node}
            guideStep={guideStep}
          />
        </div>
      </div>

      {/* GUIDE OVERLAY CONTROLS (If Active) */}
      <AnimatePresence>
        {guideStep > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-black/80 backdrop-blur border border-emerald-500/50 p-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <button onClick={() => setGuideStep(Math.max(1, guideStep - 1))} className="px-6 py-2 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-white">PREV</button>
            <span className="px-4 py-2 text-xs font-mono text-emerald-400 flex items-center border-l border-r border-white/10">STEP {guideStep}/3</span>
            <button onClick={() => setGuideStep(Math.min(3, guideStep + 1))} className="px-6 py-2 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-white">NEXT</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. BOTTOM HUD */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between z-40 pointer-events-none">

        {/* BOTTOM LEFT: LOGS & STATS */}
        <div className="flex flex-col gap-4 pointer-events-auto w-96">
          {/* Stats Row */}
          <div className="flex gap-2">
            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-colors shadow-lg">
              <Layers className="text-muted-foreground w-4 h-4 mb-2 group-hover:text-emerald-400 transition-colors" />
              <div>
                <div className="text-2xl font-bold text-white">{new Set(topology.map(t => t.node)).size}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Nodes</div>
              </div>
            </div>
            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-colors shadow-lg">
              <Cpu className="text-muted-foreground w-4 h-4 mb-2 group-hover:text-emerald-400 transition-colors" />
              <div>
                <div className="text-2xl font-bold text-white">{topology.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Virtual Pts</div>
              </div>
            </div>
          </div>

          {/* Logs Terminal */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl h-48 overflow-hidden font-mono text-xs relative shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-6 bg-white/5 flex items-center px-3 border-b border-white/5">
              <Terminal className="w-3 h-3 text-emerald-500 mr-2" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Protocol Log</span>
            </div>
            <div className="space-y-1 mt-4 h-full overflow-y-auto pb-4 custom-scrollbar">
              {logs.length === 0 && <span className="text-muted-foreground italic opacity-50">System Ready... Waiting for input</span>}
              {logs.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="border-l-2 border-emerald-500/30 pl-2">
                  <span className="text-emerald-400/80 mr-2">{">"}</span>
                  <span className="text-white/80">{log}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: CONTROL PANEL */}
        <div className="pointer-events-auto">
          <ControlPanel
            isLoading={loading}
            onAdd={handleAddNode}
            onRemove={handleRemoveNode}
            onRoute={handleRoute}
          />
        </div>

      </div>

    </main>
  );
}
