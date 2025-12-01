import React, { useState, useEffect, useRef } from 'react';
import { VentureData, ViewMode, INITIAL_DATA } from './types';
import { generateVenturePack } from './services/geminiService';
import { LivePrototype } from './components/LivePrototype';
import { CodeBlock } from './components/CodeBlock';
import { 
  Cpu, Sparkles, Check, X, Shield, Zap, Globe, 
  Layout, Code, FileText, ChevronRight, Terminal, Loader2 
} from 'lucide-react';

// --- TYPES ---

interface User {
  name: string;
  initials: string;
}

// --- COMPONENTS ---

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess: () => void }) => {
  if (!isOpen) return null;
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-os-900 rounded-2xl overflow-hidden shadow-2xl flex border border-os-800 animate-[fadeIn_0.3s_ease-out]">
        {/* Left Column (Visuals) */}
        <div className="hidden md:flex w-1/2 bg-os-950 relative flex-col justify-between p-12 overflow-hidden border-r border-os-800">
             {/* Neon Grid Background */}
             <div className="absolute inset-0 opacity-20" style={{
                 backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
                 maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
             }}></div>
             
             <div className="relative z-10">
                 <div className="w-12 h-12 bg-os-accent rounded-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <Cpu size={28} className="text-os-950" />
                 </div>
                 <h2 className="text-3xl font-bold text-white tracking-tight">Venture-OS</h2>
             </div>

             <div className="relative z-10">
                 <p className="text-2xl font-light text-gray-300 leading-relaxed">"Architect your empire in seconds."</p>
                 <div className="mt-6 flex gap-2">
                     <div className="w-16 h-1 bg-os-accent rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                     <div className="w-6 h-1 bg-os-700 rounded-full"></div>
                 </div>
             </div>
        </div>

        {/* Right Column (Actions) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-os-900 flex flex-col justify-center relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
            
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Welcome Back.</h3>
                <p className="text-gray-400 text-sm">Sign in to sync your architecture packs.</p>
            </div>

            <div className="space-y-3 mb-6">
                <button onClick={() => handleLogin()} className="w-full py-3 rounded-lg bg-[#24292e] hover:bg-[#2f363d] text-white border border-gray-700 flex items-center justify-center gap-3 transition-all font-medium text-sm">
                    <i className="fab fa-github text-lg"></i>
                    Continue with GitHub
                </button>
                <button onClick={() => handleLogin()} className="w-full py-3 rounded-lg bg-white hover:bg-gray-100 text-gray-900 flex items-center justify-center gap-3 transition-all font-medium text-sm">
                    <i className="fab fa-google text-lg"></i>
                    Continue with Google
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-os-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="bg-os-900 px-3 text-gray-500">OR</span>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="name@company.com" 
                        className="w-full bg-os-950 border border-os-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-os-accent focus:border-os-accent outline-none transition-all placeholder-gray-600"
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full bg-os-950 border border-os-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-os-accent focus:border-os-accent outline-none transition-all placeholder-gray-600"
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-os-accent hover:bg-cyan-400 text-os-950 font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            LOGGING IN...
                        </>
                    ) : (
                        "LOG IN"
                    )}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ onLoginClick, isLoggedIn, user }: { onLoginClick: () => void, isLoggedIn: boolean, user: User | null }) => (
  <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full z-50 relative">
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 bg-os-accent rounded flex items-center justify-center text-os-950 font-bold shadow-[0_0_10px_rgba(34,211,238,0.4)]">
        <Cpu size={20} />
      </div>
      <span className="font-bold text-xl tracking-wider text-white">VENTURE-OS</span>
    </div>
    
    {isLoggedIn && user ? (
        <div className="flex items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
            <span className="hidden sm:block text-sm text-gray-400 font-mono">Welcome, {user.name}</span>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-os-accent to-blue-600 p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <div className="w-full h-full rounded-full bg-os-900 flex items-center justify-center text-white font-bold text-sm tracking-tighter">
                    {user.initials}
                </div>
            </button>
        </div>
    ) : (
        <button 
            onClick={onLoginClick}
            className="text-sm font-mono text-os-accent border border-os-accent/50 px-6 py-2 rounded hover:bg-os-accent hover:text-os-950 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
            LOGIN_
        </button>
    )}
  </nav>
);

const LandingPage = ({ 
  onInitiate, 
  onLoginClick, 
  isLoggedIn, 
  user 
}: { 
  onInitiate: (idea: string) => void,
  onLoginClick: () => void,
  isLoggedIn: boolean,
  user: User | null
}) => {
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-os-950 text-white flex flex-col relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <Navbar onLoginClick={onLoginClick} isLoggedIn={isLoggedIn} user={user} />

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-os-800 border border-os-700 text-xs text-os-accent mb-8 font-mono">
          <span className="w-2 h-2 rounded-full bg-os-accent animate-pulse"></span>
          SYSTEM ONLINE v2.5
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
          The Operating System<br />for Startups.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12">
          Stop using 5 different AI tools. Generate your <span className="text-white font-semibold">Code</span>, <span className="text-white font-semibold">Business Strategy</span>, and <span className="text-white font-semibold">Pitch Deck</span> in one synchronized workflow.
        </p>

        {/* INTERACTION AREA */}
        <div className="w-full max-w-2xl bg-os-900/50 backdrop-blur-xl p-2 rounded-2xl border border-os-700 shadow-2xl shadow-os-accent/5 flex flex-col sm:flex-row gap-2">
          <input 
            type="text" 
            placeholder="Describe your idea (e.g. Airbnb for camping)..."
            className="flex-1 bg-transparent border-none text-white px-6 py-4 text-lg focus:ring-0 placeholder-gray-600 font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && input.trim() && onInitiate(input)}
          />
          <button 
            onClick={() => input.trim() && onInitiate(input)}
            className="bg-os-accent hover:bg-cyan-400 text-os-950 font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Sparkles size={18} fill="currentColor" />
            INITIATE ARCHITECTURE
          </button>
        </div>
      </main>

      {/* COMPARISON SECTION */}
      <section className="py-20 bg-os-900 border-t border-os-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">The Upgrade</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-os-950 border border-red-900/30 opacity-70">
              <h3 className="text-xl font-bold text-gray-400 mb-6 flex items-center gap-2">
                <X className="text-red-500" /> The Old Way
              </h3>
              <ul className="space-y-4 text-gray-500">
                <li className="flex gap-3"><span className="text-red-900">●</span> Disconnected ChatGPT prompts</li>
                <li className="flex gap-3"><span className="text-red-900">●</span> Manual coding & debugging</li>
                <li className="flex gap-3"><span className="text-red-900">●</span> Static PDF business plans</li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-os-900 to-os-800 border border-os-accent/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-os-accent/10 blur-3xl rounded-full"></div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Check className="text-os-accent" /> The Venture-OS Way
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3"><span className="text-os-accent">●</span> Synced Logic & Financials</li>
                <li className="flex gap-3"><span className="text-os-accent">●</span> Live Interactive Prototypes</li>
                <li className="flex gap-3"><span className="text-os-accent">●</span> Investor-Ready Assets in seconds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 bg-os-950 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Architecture</h2>
          <p className="text-center text-gray-500 mb-16">Cheaper than one hour with a CTO.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* HOBBYIST */}
            <div className="p-6 rounded-xl bg-os-900 border border-os-800 hover:border-os-700 transition-all flex flex-col">
              <div className="text-gray-400 font-mono text-sm mb-2">THE HOBBYIST</div>
              <div className="text-3xl font-bold text-white mb-6">Free</div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-sm text-gray-400 flex gap-2"><Check size={16}/> Generate 1 Project Idea</li>
                <li className="text-sm text-gray-400 flex gap-2"><Check size={16}/> Basic Strategy Doc</li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-os-700 text-gray-300 hover:bg-os-800 font-mono text-sm">SELECT</button>
            </div>

            {/* FOUNDER */}
            <div className="p-6 rounded-xl bg-os-900 border border-os-accent shadow-[0_0_30px_rgba(34,211,238,0.1)] relative transform md:-translate-y-4 flex flex-col">
              <div className="absolute top-0 right-0 bg-os-accent text-os-950 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">RECOMMENDED</div>
              <div className="text-os-accent font-mono text-sm mb-2">THE FOUNDER</div>
              <div className="text-3xl font-bold text-white mb-1">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <p className="text-xs text-gray-500 mb-6">Billed annually</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-sm text-white flex gap-2"><Check size={16} className="text-os-accent"/> Unlimited Architecture Packs</li>
                <li className="text-sm text-white flex gap-2"><Check size={16} className="text-os-accent"/> Export to GitHub</li>
                <li className="text-sm text-white flex gap-2"><Check size={16} className="text-os-accent"/> PDF Downloads</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-os-accent text-os-900 font-bold hover:bg-cyan-400 transition-colors">START BUILDING</button>
            </div>

            {/* AGENCY */}
            <div className="p-6 rounded-xl bg-os-900 border border-os-800 hover:border-os-700 transition-all flex flex-col">
              <div className="text-gray-400 font-mono text-sm mb-2">THE AGENCY</div>
              <div className="text-3xl font-bold text-white mb-6">$199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-sm text-gray-400 flex gap-2"><Check size={16}/> White-label for clients</li>
                <li className="text-sm text-gray-400 flex gap-2"><Check size={16}/> API Access</li>
                <li className="text-sm text-gray-400 flex gap-2"><Check size={16}/> Priority Support</li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-os-700 text-gray-300 hover:bg-os-800 font-mono text-sm">CONTACT SALES</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Simulation = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "Initializing Venture-OS Core...",
    "Connecting to Neural Architecture Grid...",
    "Parsing Input Vector...",
    "Analyzing Competitor Landscape...",
    "Structuring Relational Database...",
    "Generating React Native Interfaces...",
    "Syncing Financial Projections...",
    "Compiling Investor Assets...",
    "Finalizing Build..."
  ];

  useEffect(() => {
    let delay = 0;
    messages.forEach((msg, index) => {
      delay += Math.random() * 800 + 400;
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
        if (index === messages.length - 1) {
          setTimeout(onComplete, 1000);
        }
      }, delay);
    });
  }, []);

  const logsEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-10 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,20,0,0.9),rgba(0,10,0,1)),url('https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif')] bg-cover opacity-20 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-2xl border border-green-900 bg-black/80 rounded-lg shadow-[0_0_50px_rgba(0,255,0,0.2)] overflow-hidden">
        <div className="bg-green-900/20 px-4 py-2 border-b border-green-900 flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-green-400">System Terminal</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-900/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-900/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-900/50"></div>
          </div>
        </div>
        <div className="p-6 h-80 overflow-y-auto custom-scrollbar font-mono text-sm space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="opacity-0 animate-[fadeIn_0.2s_ease-out_forwards]">
              <span className="text-green-700 mr-2">{'>'}</span>
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
          <div className="animate-pulse">_</div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ data, onNewProject }: { data: VentureData, onNewProject: () => void }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'stack' | 'roadmap'>('dashboard');

  return (
    <div className="flex h-screen bg-os-950 text-gray-200 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-os-900 border-r border-os-800 flex flex-col">
        <div className="p-6 border-b border-os-800">
           <div className="flex items-center gap-2 text-os-accent font-bold tracking-wider">
             <Cpu size={20} /> VENTURE-OS
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'dashboard' ? 'bg-os-800 text-white border border-os-700' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Layout size={18} /> Dashboard
          </button>
          <button 
             onClick={() => setActiveView('stack')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'stack' ? 'bg-os-800 text-white border border-os-700' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Code size={18} /> Tech Stack
          </button>
          <button 
             onClick={() => setActiveView('roadmap')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'roadmap' ? 'bg-os-800 text-white border border-os-700' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Globe size={18} /> Roadmap
          </button>
        </nav>

        <div className="p-4 border-t border-os-800">
          <button onClick={onNewProject} className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
            <Sparkles size={14} /> New Project
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 border-b border-os-800 bg-os-900/50 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white">{data.config.projectName || "New Project"}</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest">
              Live Environment
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-gray-500">Last synced: Just now</div>
             <div className="w-8 h-8 rounded-full bg-os-700 flex items-center justify-center text-xs">JD</div>
          </div>
        </header>

        {/* DASHBOARD VIEW */}
        <div className="flex-1 overflow-hidden relative">
          {activeView === 'dashboard' && (
            <LivePrototype data={data} />
          )}

          {activeView === 'stack' && (
            <div className="p-6 h-full overflow-auto">
               <h3 className="text-xl font-bold mb-6 text-white">Technical Architecture</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full pb-20">
                 <CodeBlock title="config.json" data={data.config} />
                 <CodeBlock title="schema.sql" data={data.config.databaseSchema} />
               </div>
            </div>
          )}

          {activeView === 'roadmap' && (
            <div className="p-6 flex items-center justify-center h-full text-gray-500">
               <div className="text-center">
                 <Shield size={48} className="mx-auto mb-4 opacity-50" />
                 <p>Roadmap Module Locked in MVP</p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- MAIN APP CONTROLLER ---

const App = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.INPUT);
  const [data, setData] = useState<VentureData>(INITIAL_DATA);
  const [tempIdea, setTempIdea] = useState("");
  
  // Login State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUser({ name: "Founder", initials: "FD" });
    setIsLoginModalOpen(false);
  };

  const handleInitiate = async (idea: string) => {
    setTempIdea(idea);
    setViewMode(ViewMode.GENERATING);
    
    // Trigger API call in background while simulation runs
    try {
      const result = await generateVenturePack(idea);
      setData(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulationComplete = () => {
    setViewMode(ViewMode.DASHBOARD);
  };

  return (
    <>
      {viewMode === ViewMode.INPUT && (
        <LandingPage 
            onInitiate={handleInitiate} 
            onLoginClick={() => setIsLoginModalOpen(true)}
            isLoggedIn={isLoggedIn}
            user={user}
        />
      )}
      {viewMode === ViewMode.GENERATING && <Simulation onComplete={handleSimulationComplete} />}
      {viewMode === ViewMode.DASHBOARD && <Dashboard data={data} onNewProject={() => setViewMode(ViewMode.INPUT)} />}
      
      {/* Fallback Error View */}
      {viewMode === ViewMode.ERROR && (
        <div className="min-h-screen flex items-center justify-center bg-os-950 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">System Failure</h2>
            <button onClick={() => setViewMode(ViewMode.INPUT)} className="underline">Retry</button>
          </div>
        </div>
      )}

      {/* Login Modal Overlay */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default App;