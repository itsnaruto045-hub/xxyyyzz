
import React, { useEffect, useState, useRef } from 'react';
import { 
  Code, Bot, Database, Terminal, 
  ChevronRight, 
  Cpu, Layers, Command, Youtube
} from 'lucide-react';

// --- Components ---

const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const fullText = text;
      setDisplayText(
        isDeleting 
          ? fullText.substring(0, displayText.length - 1) 
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 100 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, typingSpeed, loopNum]);

  return (
    <span className="text-white">
      {displayText}
      <span className="cursor-blink"></span>
    </span>
  );
};

const CmdScroll: React.FC = () => {
  const cmdText = " [SYSTEM]: RUNNING EXECUTABLE... [PORT]: 8080 OPEN... [SHELL]: BASH INITIALIZED... [USER]: % SDF >.. LOGGED IN... [STATUS]: SHIELD ACTIVE... [KERNEL]: COMPILING ASSETS... [BOT]: SOVEREIGN READY... [LOG]: INCOMING REQUESTS STABLE... ";
  return (
    <div className="cmd-scroll-container mt-16 mb-10 opacity-80">
      <div className="cmd-scroll-content">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-300">
          {cmdText + cmdText + cmdText}
        </span>
      </div>
    </div>
  );
};

const TerminalPlate: React.FC<{ 
  children: React.ReactNode; 
  title: string;
  className?: string;
}> = ({ children, title, className = "" }) => {
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = plate.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) * 0.012;
      const y = (e.clientY - centerY) * 0.012;
      
      plate.style.transform = `translate(${x}px, ${y}px)`;
      plate.style.borderColor = 'rgba(168, 85, 247, 0.5)';
      plate.style.boxShadow = `0 30px 60px rgba(0,0,0,0.5), 0 0 25px rgba(168, 85, 247, 0.15)`;
    };

    const handleMouseLeave = () => {
      plate.style.transform = `translate(0, 0)`;
      plate.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      plate.style.boxShadow = 'none';
    };

    plate.addEventListener('mousemove', handleMouseMove);
    plate.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      plate.removeEventListener('mousemove', handleMouseMove);
      plate.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={plateRef} className={`terminal-plate reveal ${className}`}>
      <div className="terminal-header">
        <div className="dot dot-red"></div>
        <div className="dot dot-yellow"></div>
        <div className="dot dot-green"></div>
        <span className="ml-3 text-[10px] uppercase tracking-widest text-zinc-300 font-bold">{title}</span>
      </div>
      <div className="p-8 md:p-10">
        {children}
      </div>
    </div>
  );
};

const SkillPlate: React.FC<{ name: string; icon: React.ReactNode; desc: string }> = ({ name, icon, desc }) => (
  <TerminalPlate title="Module" className="h-full">
    <div className="flex flex-col gap-5">
      <div className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">{icon}</div>
      <div>
        <h3 className="text-white font-bold mb-2 text-xl tracking-tight">{name}</h3>
        <p className="text-zinc-200 text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="w-full h-[3px] bg-white/10 mt-4 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-300 w-full animate-pulse opacity-50"></div>
      </div>
    </div>
  </TerminalPlate>
);

const App: React.FC = () => {
  const LOGO_URL = "https://i.pinimg.com/736x/79/ed/2d/79ed2de16f92b5c48f3e6bf718b974da.jpg";

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // CURSOR LOGIC
    const cursor = document.getElementById('custom-cursor');
    const trail = document.getElementById('cursor-trail');
    
    const moveCursor = (e: MouseEvent) => {
      if (cursor && trail) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
      }
    };

    const handleMouseEnter = () => document.body.classList.add('cursor-hover');
    const handleMouseLeave = () => document.body.classList.remove('cursor-hover');

    // Attach listeners to all interactive elements
    const attachCursorEvents = () => {
      const interactives = document.querySelectorAll('button, a, .btn-terminal');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    window.addEventListener('mousemove', moveCursor);
    attachCursorEvents();

    // Re-attach on scroll or dynamic changes if needed
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-visible">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-10 py-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-black/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl">
          <Terminal size={20} className="text-purple-500" />
          <span className="font-bold tracking-tighter text-xl text-white">% SDF &gt;..</span>
        </div>
        <div className="flex gap-4 pointer-events-auto">
          {['about', 'skills', 'projects'].map(item => (
            <button key={item} onClick={() => scrollTo(item)} className="btn-terminal rounded-xl text-[11px] font-bold uppercase tracking-[0.2em]">
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="logo-main mb-16 relative">
          <div className="w-44 h-44 md:w-52 md:h-52 p-1.5 rounded-full relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-transparent to-purple-400 animate-spin-slow opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-full h-full rounded-full bg-black border border-white/10 relative z-10 overflow-hidden shadow-2xl">
              <img 
                src={LOGO_URL}
                alt="SDF Logo" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full -z-10 group-hover:bg-purple-500/40 transition-all duration-700"></div>
          </div>
        </div>

        <div className="max-w-4xl px-4">
          <h2 className="text-zinc-200 font-bold mb-6 flex items-center justify-center gap-3 text-xs tracking-[0.4em] uppercase">
            <Command size={16} className="text-purple-500" /> SYSTEM STATUS: <span className="text-purple-500 animate-pulse">OPTIMIZED</span>
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading text-white leading-[1.1] drop-shadow-2xl">
            <TypingEffect text="% SDF >.." />
          </h1>
          
          <CmdScroll />

          <div className="flex flex-wrap gap-5 justify-center mt-4">
             <button onClick={() => scrollTo('projects')} className="btn-terminal border-purple-500/40 text-white rounded-2xl group">
                <span className="flex items-center gap-3">EXECUTE_PROJECTS <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
             </button>
             <button onClick={() => scrollTo('about')} className="btn-terminal rounded-2xl">
                READ_PROFILE.md
             </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 px-6 max-w-6xl mx-auto">
        <TerminalPlate title="profile_v3.0" className="w-full">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4 border-r border-white/5 pr-10">
              <div className="text-purple-400 mb-6 font-bold text-[10px] uppercase tracking-[0.3em]">~/Identity</div>
              <h2 className="text-4xl font-bold mb-8 font-heading text-white tracking-tight">% SDF &gt;..</h2>
              <div className="flex flex-col gap-4">
                <div className="p-5 bg-white/10 rounded-2xl border border-white/5 shadow-inner">
                   <div className="text-[10px] text-zinc-300 uppercase font-bold mb-2 tracking-widest">Core Role</div>
                   <div className="text-zinc-100 text-base font-medium">Backend Architect</div>
                </div>
                <div className="p-5 bg-white/10 rounded-2xl border border-white/5 shadow-inner">
                   <div className="text-[10px] text-zinc-300 uppercase font-bold mb-2 tracking-widest">Domain</div>
                   <div className="text-zinc-100 text-base font-medium">Discord Automation</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-8 text-zinc-100 leading-relaxed font-light space-y-6">
              <p className="text-xl leading-relaxed">
                Expert in streamlining complex digital environments through 
                <span className="text-white font-semibold border-b-2 border-purple-500/60 ml-1">enterprise-grade Java backends</span> and 
                <span className="text-white font-semibold border-b-2 border-purple-500/60 ml-1">scalable Discord integrations</span>.
              </p>
              <p className="text-lg text-zinc-200">
                I translate intricate logic into efficient, low-latency systems. My philosophy is rooted in pure performance and architectural elegance. 
              </p>
              <div className="pt-10 border-t border-white/5">
                <a href="https://youtube.com/@s4daf.d3v?si=YQ5Eij4Hcya2ceXr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl border border-red-500/20 transition-all group shadow-xl">
                  <Youtube size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold uppercase tracking-[0.2em]">Live on Youtube</span>
                </a>
              </div>
            </div>
          </div>
        </TerminalPlate>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-24 text-center reveal">
          <h2 className="text-5xl font-bold mb-6 font-heading text-white">System_Arsenal</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-60"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <SkillPlate 
            name="Java Core" 
            icon={<Cpu size={28} />} 
            desc="Developing multi-threaded high-performance system backends." 
          />
          <SkillPlate 
            name="Python" 
            icon={<Code size={28} />} 
            desc="Automated script clusters and advanced data processing." 
          />
          <SkillPlate 
            name="Discord Engine" 
            icon={<Bot size={28} />} 
            desc="Architecting complex bots with Discord.js & JDA framework." 
          />
          <SkillPlate 
            name="Cloud Infra" 
            icon={<Layers size={28} />} 
            desc="Managing containerized scalable system deployments." 
          />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-24 text-center reveal">
          <h2 className="text-5xl font-bold mb-6 font-heading text-white">Execution_History</h2>
          <p className="text-zinc-200 text-sm tracking-[0.4em] uppercase font-bold opacity-80">Reactive Modular Units</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {[
            { title: "Sovereign_Bot", tech: "Java / Redis / JDA", desc: "A military-grade Discord moderation suite used by 100k+ users for security and automation." },
            { title: "Atlas_OS", tech: "Python / React", desc: "A custom terminal-inspired dashboard for managing cloud server clusters via mobile." },
            { title: "Vertex_API", tech: "C++ / PostgreSQL", desc: "High-performance data engine for real-time order matching in financial systems." },
            { title: "Nexus_Dashboard", tech: "TS / Tailwind", desc: "Visual data lake for monitoring bot health metrics across 4 different global regions." }
          ].map((proj, i) => (
            <TerminalPlate key={i} title={`project_0${i+1}.bin`} className="group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight">{proj.title}</h3>
                  <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mt-3 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 inline-block">{proj.tech}</p>
                </div>
                <div className="w-14 h-14 border border-white/20 flex items-center justify-center rounded-2xl bg-white/10 group-hover:rotate-[15deg] group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all duration-700 shadow-2xl">
                  <Terminal size={24} className="text-zinc-200 group-hover:text-purple-400" />
                </div>
              </div>
              <p className="text-zinc-100 font-light text-base mb-8 leading-relaxed opacity-95">
                {proj.desc}
              </p>
              <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[10px] text-zinc-300 border border-white/20 px-3 py-1.5 rounded-lg bg-white/10">READ_ONLY</span>
                <span className="text-[10px] text-zinc-300 border border-white/20 px-3 py-1.5 rounded-lg bg-white/10">AES_256</span>
              </div>
            </TerminalPlate>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/10 px-10 text-center backdrop-blur-3xl bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-left">
            <div className="flex items-center gap-4 mb-3">
               <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden shadow-2xl flex items-center justify-center">
                 <img src={LOGO_URL} alt="SDF Logo" className="w-full h-full object-cover" />
               </div>
               <span className="font-bold text-white tracking-tighter text-2xl">% SDF &gt;..</span>
            </div>
            <p className="text-zinc-400 text-[10px] tracking-[0.4em] uppercase font-bold opacity-80">TERMINAL_EDITION v3.5.0 // CORE_STABLE</p>
          </div>
          
          <div className="flex flex-wrap gap-10 items-center justify-center">
            <a href="https://youtube.com/@s4daf.d3v?si=YQ5Eij4Hcya2ceXr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-300 hover:text-red-500 transition-all group">
              <Youtube size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-[0.25em]">Youtube</span>
            </a>
            <span className="text-white/20 hidden md:block">|</span>
            <button onClick={() => scrollTo('hero')} className="text-zinc-300 hover:text-white transition-all text-xs font-bold uppercase tracking-[0.25em]">Reboot_System</button>
            <span className="text-white/20 hidden md:block">|</span>
            <span className="text-zinc-400 text-xs font-bold tracking-widest">© 2026 ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
