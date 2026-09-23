"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { PostForm } from "../PostForm"
import { Post } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { PortfolioService } from "@/services/portfolio"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, FileText } from "lucide-react"

export default function AdminPostsPage() {
  const { data: posts, loading, refresh } = useAdminData<Post>("posts")
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingPost

  const handleSave = async (data: Omit<Post, "id" | "created_at">) => {
    setIsSaving(true)
    try {
      await PortfolioService.savePost({
        ...data,
        id: editingPost?.id,
      } as Post)
      toast.success(editingPost ? "Post updated" : "Post published")
      setEditingPost(null)
      setIsAdding(false)
      refresh()
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Save failed"}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await PortfolioService.deletePost(pendingDelete.id)
      toast.success("Post deleted")
      setPendingDelete(null)
      refresh()
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Delete failed"}`)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        index="03"
        title="Posts"
        description="Tutorials, thoughts, and life updates for your audience."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Write post
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingPost ? "Editing" : "New"}
          title={editingPost ? editingPost.title : "Write a new post"}
          onClose={() => {
            setEditingPost(null)
            setIsAdding(false)
          }}
        >
          <PostForm
            initialData={editingPost || undefined}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => {
              setEditingPost(null)
              setIsAdding(false)
            }}
          />
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={3} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No stories published yet"
          description="Start your journal — drafts stay private until you publish."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Write your first post
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <ListRow
              key={post.id}
              dimmed={!post.published}
              icon={
                post.cover_image ? (
                  <span className="relative block size-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover_image} alt="" className="h-full w-full object-cover" />
                  </span>
                ) : (
                  <FileText className="size-4" />
                )
              }
              title={post.title}
              meta={
                <>
                  <span className="line-clamp-1">{post.excerpt}</span>
                  <span className="mt-0.5 block label-mono text-muted-foreground">
                    {post.created_at ? new Date(post.created_at).toDateString() : "Undated"}
                    {post.tags?.length ? ` · ${post.tags.join(", ")}` : ""}
                  </span>
                </>
              }
              badge={
                !post.published ? (
                  <StatusBadge variant="draft" />
                ) : undefined
              }
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${post.title}`}
                    onClick={() => setEditingPost(post)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${post.title}`}
                    onClick={() => setPendingDelete(post)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title={`Delete “${pendingDelete?.title}”?`}
        description="This removes the article permanently. This cannot be undone."
        confirmLabel="Delete post"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
