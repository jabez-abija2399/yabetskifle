"use client"

import { useState, useEffect } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Message } from "@/types/portfolio"
import { toast } from "sonner"
import { 
  Mail, Trash2, Calendar, User, 
  MessageSquare, Loader2, Inbox, CheckCircle2,
  ChevronRight, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const data = await PortfolioService.getMessages()
      setMessages(data)
    } catch (error) {
      toast.error("Failed to load your transmission log.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this message?")) return
    
    setDeletingId(id)
    try {
      await PortfolioService.deleteMessage(id)
      setMessages(messages.filter(m => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
      toast.success("Transmission deleted from archive.")
    } catch (error) {
      toast.error("Failed to delete the message.")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30">Decrypting Inbox...</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-8">
      
      {/* 🚀 HEADER */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <Inbox className="w-6 h-6 text-primary" />
             <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Inquiry Hub</h1>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Master Communications Log</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-muted rounded-2xl text-[10px] font-black uppercase tracking-widest">
              Total Transmissions: {messages.length}
           </div>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-12 gap-8 overflow-hidden pt-4">
        
        {/* 📑 MESSAGE LIST (4/12) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed border-border rounded-[2.5rem] text-center">
               <Mail className="w-12 h-12 text-zinc-700 mb-4" />
               <p className="text-sm font-bold opacity-30 italic">No incoming transmissions yet.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`group cursor-pointer p-6 rounded-[2rem] border transition-all relative overflow-hidden ${
                  selectedMessage?.id === msg.id 
                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                    : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                {selectedMessage?.id === msg.id && (
                  <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 opacity-40" />
                )}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedMessage?.id === msg.id ? "text-white/60" : "text-primary"}`}>
                       New Inquiry
                    </p>
                    <h3 className="font-black italic text-lg leading-tight truncate pr-6">{msg.subject}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${selectedMessage?.id === msg.id ? "bg-white/20" : "bg-muted"}`}>
                        {msg.name[0].toUpperCase()}
                     </div>
                     <div className="text-[10px] font-bold opacity-70 truncate italic">
                        {msg.name} <span>•</span> {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : "Pending"}
                     </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 👁️ READING PANE (8/12) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative">
          {selectedMessage ? (
            <>
              {/* Reading Pane Header */}
              <div className="p-10 border-b border-border bg-muted/20 flex items-start justify-between">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 font-black italic text-lg">
                         {selectedMessage.name[0]}
                      </div>
                      <div>
                         <h2 className="text-2xl font-black italic leading-none">{selectedMessage.name}</h2>
                         <p className="text-xs font-bold text-primary mt-1">{selectedMessage.email}</p>
                      </div>
                   </div>
                   <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-muted px-4 py-2 rounded-full">
                         <Calendar className="w-3 h-3" /> {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : "Real-time Encryption"}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-muted px-4 py-2 rounded-full">
                         <MessageSquare className="w-3 h-3" /> Verified Protocol
                      </div>
                   </div>
                </div>
                <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={(e) => handleDelete(selectedMessage.id, e)}
                   className="text-destructive hover:bg-destructive/10 rounded-2xl w-12 h-12"
                   disabled={deletingId === selectedMessage.id}
                >
                   {deletingId === selectedMessage.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Reading Pane Content */}
              <div className="flex-1 p-12 overflow-y-auto">
                 <div className="max-w-2xl space-y-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Subject Matter</p>
                       <h1 className="text-4xl font-black italic tracking-tighter leading-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent italic">
                          "{selectedMessage.subject}"
                       </h1>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/50 text-lg leading-relaxed text-zinc-400 font-medium font-serif italic">
                       {selectedMessage.message}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-border flex justify-end">
                 <a 
                   href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                   className="h-14 px-10 bg-primary text-white font-black italic rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-primary/20"
                 >
                    <Send className="w-4 h-4" /> REPLY VIA EMAIL
                 </a>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 grayscale p-20 text-center">
               <div className="w-24 h-24 rounded-full border-4 border-dashed border-zinc-700 flex items-center justify-center">
                  <Mail className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black italic uppercase tracking-widest leading-none">Select a Transmission</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.2em]">Archived communications are waiting for review.</p>
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function Send({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  )
}
