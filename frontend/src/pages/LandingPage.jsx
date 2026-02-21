import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="mesh-glow absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-gradient-to-r from-primary/15 to-transparent blur-[80px] pointer-events-none"></div>
      <Navbar />
      <section className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          New: AI Predictions v2.0
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Analytics that <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff4d7d] to-primary">track themselves</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          Harness the power of automated insights. No manual setup, no complexity. 
          Just real-time results delivered to your fingertips.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/dashboard">
            <button className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white h-14 px-10 rounded-xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/40">
              Go to Dashboard
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </Link>
          <button className="flex items-center justify-center h-14 px-8 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-semibold">
            Watch Demo
          </button>
        </div>
      </section>
      <Footer />
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
    </main>
  );
};

export default LandingPage;