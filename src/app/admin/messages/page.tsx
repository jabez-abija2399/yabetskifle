"use client"

import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { Message } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { toast } from "sonner"
import { Mail, Trash2, Calendar, User, MessageSquare } from "lucide-react"

export default function AdminMessagesPage() {
  const { data: messages, loading, deleteItem } = useAdminData<Message>("messages")

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteItem(id)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader 
        title="Messages Inbox" 
        description="View and manage messages from potential clients and visitors."
      />

      <div className="grid gap-6">
        {messages.length === 0 && !loading && <AdminEmptyState message="Your inbox is empty. Waiting for your first lead!" />}
        
        {messages.map((msg) => (
          <div key={msg.id} className="p-8 rounded-[2.5rem] border border-border bg-card hover:border-primary/30 transition-all group relative overflow-hidden">
            
            {/* Header: Name & Subject */}
            <div className="flex items-start justify-between mb-6">
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                     <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                     <h4 className="font-bold text-lg leading-none mb-1">{msg.name}</h4>
                     <p className="text-sm text-primary font-medium">{msg.email}</p>
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-2">Subject: {msg.subject}</p>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-black italic">
                     <Calendar className="w-3 h-3" />
                     {new Date(msg.created_at || "").toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 relative">
               <MessageSquare className="absolute top-4 right-4 w-10 h-10 text-primary/5" />
               <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {msg.message}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
