import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              W
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              We<span className="text-indigo-400">Pair</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Tailwind CSS v4 Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl text-center space-y-6">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Automobile Public Service System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Seamless roadside dispatch,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              powered by WePair
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The frontend is now completely styled with <span className="text-indigo-400 font-semibold">Tailwind CSS</span>. 
            All vanilla CSS stylesheets have been migrated to utility classes.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCount((c) => c + 1)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all duration-200"
            >
              Interactive Test: {count} clicks
            </button>
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 active:scale-95 text-slate-300 font-medium transition-all duration-200"
            >
              Tailwind Docs &rarr;
            </a>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold mb-3">
                ⚡
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">Vite + React 19</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Ultra-fast HMR and bundling with modern React concurrent features.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold mb-3">
                🎨
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">Pure Tailwind CSS</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Zero custom CSS overhead. Built entirely with flexible utility classes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold mb-3">
                🛡️
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">NestJS Backend</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Enterprise-grade architecture configured for the dispatch engine.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        WePair &bull; Automobile Public Service System
      </footer>
    </div>
  )
}

export default App
