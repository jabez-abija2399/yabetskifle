"use client"

import { useState } from "react"
import { GitCommit, GitPullRequest, TerminalSquare } from "lucide-react"
import { GithubStats } from "@/services/github"

export const GithubMetricsUI = ({ stats }: { stats: GithubStats }) => {
  const [selectedYear, setSelectedYear] = useState<string>("All")

  const displayedCommits = selectedYear === "All" 
    ? stats.totalCommits 
    : stats.yearlyCommits.find(y => y.year === selectedYear)?.count || 0;

  return (
    <section className="py-20 border-t border-border bg-muted/10 relative overflow-hidden">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-[100%] pointer-events-none -z-10" />
       
       <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
                <TerminalSquare className="w-4 h-4" /> Validated Metrics
             </div>
             <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                Engineering <span className="text-zinc-600">Velocity.</span>
             </h2>
             <p className="text-muted-foreground text-sm font-semibold max-w-xl">
               Real-time diagnostic array synced directly with GitHub servers reflecting total verified architectural contributions across public systems.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* 🎯 Component 1: Interactive Commits Timeline */}
             <div className="p-8 rounded-[2rem] bg-card border border-border shadow-2xl flex flex-col items-center text-center space-y-6 group transition-all duration-500">
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center transition-transform duration-500">
                   <GitCommit className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="text-5xl font-black italic tracking-tighter">{displayedCommits.toLocaleString()}</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">
                     {selectedYear === "All" ? "Lifetime Contributions" : `${selectedYear} Contributions`}
                   </p>
                </div>

                {/* 🎛️ Interactive Year Filters */}
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                   <button 
                     onClick={() => setSelectedYear("All")} 
                     className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${selectedYear === "All" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"}`}
                   >
                     All Time
                   </button>
                   {stats.yearlyCommits.map(y => (
                     <button 
                       key={y.year}
                       onClick={() => setSelectedYear(y.year)} 
                       className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest transition-all ${selectedYear === y.year ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"}`}
                     >
                       {y.year}
                     </button>
                   ))}
                </div>
             </div>

             {/* 📦 Component 2: PRs */}
             <div className="p-8 rounded-[2rem] bg-card border border-border shadow-2xl flex flex-col items-center justify-center text-center space-y-4 group transition-all duration-500">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center transition-transform duration-500">
                   <GitPullRequest className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="text-5xl font-black italic tracking-tighter">{stats.totalPRs.toLocaleString()}</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">Pull Requests Merged</p>
                </div>
             </div>

             {/* 🧬 Component 3: Language DNA */}
             <div className="p-8 rounded-[2rem] bg-card border border-border shadow-2xl flex flex-col items-center justify-center space-y-6 group transition-all duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 w-full text-left">Systems Architecture DNA</p>
                <div className="w-full space-y-4">
                   {stats.topLanguages.map((lang) => (
                      <div key={lang.name} className="flex flex-col gap-2">
                         <div className="flex justify-between text-xs font-bold">
                            <span>{lang.name}</span>
                         </div>
                         <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: '100%', backgroundColor: lang.color }}></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </section>
  )
}
