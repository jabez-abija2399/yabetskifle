"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { PostForm } from "../PostForm"
import { Post } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Eye } from "lucide-react"

export default function AdminPostsPage() {
  const { data: posts, loading, deleteItem, refresh } = useAdminData<Post>("posts")
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Post, "id" | "created_at">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingPost 
      ? await supabase.from("posts").update(data).eq("id", editingPost.id)
      : await supabase.from("posts").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success(editingPost ? "Post Updated!" : "Post Published!")
      setEditingPost(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Journal & Blog" 
        description="Share your thoughts, tutorials, and life updates with your audience."
        actionLabel={!(isAdding || editingPost) ? "Write New Post" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingPost) ? (
        <div className="animate-in fade-in slide-in-from-bottom-4">
           <PostForm 
              initialData={editingPost || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingPost(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.length === 0 && !loading && <AdminEmptyState message="No stories published yet. Start your journal today!" />}
          {posts.map((post) => (
            <div key={post.id} className="p-6 rounded-[2.5rem] border border-border bg-card group flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                 <div className="w-32 h-20 rounded-2xl border border-border overflow-hidden bg-muted flex-shrink-0 relative">
                    {post.cover_image && <img src={post.cover_image} alt="" className="w-full h-full object-cover" />}
                 </div>
                 <div className="space-y-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                       {!post.published && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold uppercase">Draft</span>}
                       <span className="text-xs text-muted-foreground">{new Date(post.created_at).toDateString()}</span>
                    </div>
                    <h4 className="font-bold text-xl tracking-tight">{post.title}</h4>
                    <p className="text-sm text-zinc-500 line-clamp-1">{post.excerpt}</p>
                 </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEditingPost(post)} className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteItem(post.id)} className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
