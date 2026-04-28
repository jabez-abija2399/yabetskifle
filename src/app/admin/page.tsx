"use client"

import { useState, useEffect } from "react"
import { PortfolioService } from "@/services/portfolio"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { 
  Briefcase, MessageSquare, Package, 
  Columns, ArrowUpRight, Activity, 
  ShieldCheck, Loader2, Zap, Eye
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await PortfolioService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error("Dashboard failed to sync:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Authenticating Session...</p>
      </div>
    )
  }

  const statCards = [
    { 
      title: "Analytics", 
      value: stats.globalViews || 0, 
      label: "Global Reach", 
      icon: <Eye className="w-5 h-5" />, 
      href: "/admin",
      color: "bg-purple-500/10 text-purple-500"
    },
    { 
      title: "Portfolio", 
      value: stats.projectsCount, 
      label: "Published Works", 
      icon: <Briefcase className="w-5 h-5" />, 
      href: "/admin/projects",
      color: "bg-blue-500/10 text-blue-500"
    },
    { 
      title: "Inbox", 
      value: stats.messagesCount, 
      label: "Active Inquiries", 
      icon: <MessageSquare className="w-5 h-5" />, 
      href: "/admin/messages",
      color: "bg-primary/10 text-primary"
    },
    { 
      title: "Offerings", 
      value: stats.servicesCount, 
      label: "Service Tiers", 
      icon: <Package className="w-5 h-5" />, 
      href: "/admin/services",
      color: "bg-green-500/10 text-green-500"
    },
    { 
      title: "Structure", 
      value: stats.activeSections, 
      label: "Active Modules", 
      icon: <Columns className="w-5 h-5" />, 
      href: "/admin/sections",
      color: "bg-yellow-500/10 text-yellow-500"
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Verified • Secure Session</span>
           </div>
           <h1 className="text-display italic">
              Dashboard <span className="text-zinc-600">Oversight.</span>
           </h1>
           <p className="text-muted-foreground text-xl font-medium italic">Welcome back. Your portfolio is currently performing optimally.</p>
        </div>
        <div className="flex items-center gap-4 py-2 px-6 bg-card border border-border rounded-2xl shadow-xl">
           <Activity className="w-4 h-4 text-green-500" />
           <span className="text-[10px] font-black uppercase tracking-widest">System Status: Online</span>
        </div>
      </div>

      {/* 📊 STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.href} className="group transition-all">
            <div className="p-8 rounded-[2.5rem] bg-card border border-border group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all space-y-6 relative overflow-hidden">
               <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                  {stat.icon}
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-black italic tracking-tighter">{stat.value}</span>
                     <ArrowUpRight className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <p className="text-xs font-bold text-zinc-400 opacity-60 leading-none">{stat.label}</p>
               </div>
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-150 rotate-12">
                  {stat.icon}
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🛠️ QUICK ACTIONS / SYSTEM CHECK */}
      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 p-12 rounded-[3.5rem] bg-muted/20 border border-border flex flex-col justify-between space-y-10 group">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30">
                     <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter">Operational Analytics</h3>
               </div>
               <p className="text-xl font-medium leading-relaxed italic text-zinc-500 max-w-lg transition-colors group-hover:text-zinc-300">
                 Your portfolio is currently serving {stats.activeSections} active modules across the primary platform. All security protocols are active.
               </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-6 mt-auto">
               <Button asChild variant="outline" className="rounded-2xl px-8 h-14 font-black italic text-sm tracking-widest border-border/50 hover:bg-primary hover:text-white transition-all shadow-xl">
                  <Link href="/admin/sections">Manage Architecture</Link>
               </Button>
               <Button asChild className="rounded-2xl px-10 h-14 font-black italic text-lg shadow-2xl shadow-primary/20">
                  <Link href="/admin/projects">Edit Exhibition</Link>
               </Button>
            </div>
         </div>

         <div className="lg:col-span-4 p-12 rounded-[3.5rem] bg-card border border-border space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] scale-[3]">
               <MessageSquare />
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Communications Feed</p>
               <h3 className="text-3xl font-black italic tracking-tighter">Recent Inquiry</h3>
            </div>
            
            {stats.messagesCount > 0 ? (
               <div className="space-y-6">
                  <p className="text-sm font-bold leading-relaxed text-zinc-400 italic">
                    Someone has reached out to collaborate. Head over to the Inbox to review the latest transmission.
                  </p>
                  <Link href="/admin/messages" className="flex items-center justify-between p-6 rounded-[2rem] bg-primary text-white font-black italic shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                     View Inbox <ArrowUpRight className="w-5 h-5" />
                  </Link>
               </div>
            ) : (
               <div className="space-y-4 py-4">
                  <div className="p-10 rounded-[2.5rem] border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4">
                     <Package className="w-8 h-8 opacity-20" />
                     <p className="text-xs font-black uppercase tracking-widest opacity-20 italic">Archive Empty</p>
                  </div>
               </div>
            )}
         </div>
      </div>

    </div>
  )
}
