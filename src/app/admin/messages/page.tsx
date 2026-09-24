"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { Message } from "@/types/portfolio"
import { toast } from "sonner"
import { Trash2, Inbox, Reply, MailOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Message | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/admin/messages", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load messages")
        const data = (await res.json()) as Message[]
        if (!cancelled) setMessages(data)
      } catch {
        toast.error("Failed to load your message log.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(pendingDelete.id)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      setMessages(messages.filter((m) => m.id !== pendingDelete.id))
      if (selectedMessage?.id === pendingDelete.id) setSelectedMessage(null)
      toast.success("Message deleted")
      setPendingDelete(null)
    } catch {
      toast.error("Failed to delete the message.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        index="03"
        title="Messages"
        description="Contact form inquiries, newest first."
        actions={
          messages.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-xs border border-border px-2 py-1 label-mono text-muted-foreground">
              {messages.length} total
            </span>
          )
        }
      />

      {loading ? (
        <ListSkeleton rows={4} />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="No incoming messages yet"
          description="Messages submitted through the public contact form land here."
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="custom-scrollbar max-h-[70vh] space-y-2 overflow-y-auto lg:col-span-4">
            {messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                onClick={() => setSelectedMessage(msg)}
                aria-current={selectedMessage?.id === msg.id}
                className={`w-full rounded-xs border p-4 text-left transition-colors ${
                  selectedMessage?.id === msg.id
                    ? "border-accent/60 bg-secondary"
                    : "border-border bg-card hover:border-accent/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="label-mono text-accent">
                    {msg.subject}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : "—"}
                  </span>
                </div>
                <p className="mt-2 truncate text-sm font-medium">{msg.name}</p>
                <p className="truncate text-xs text-muted-foreground">{msg.email}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col rounded-xs border border-border bg-card lg:col-span-8">
            {selectedMessage ? (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-border p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary font-semibold">
                    {selectedMessage.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{selectedMessage.name}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {selectedMessage.email}
                    </p>
                    <p className="mt-1 label-mono text-muted-foreground">
                      {selectedMessage.created_at
                        ? new Date(selectedMessage.created_at).toLocaleString()
                        : "Date pending"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete message"
                    onClick={() => setPendingDelete(selectedMessage)}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-5">
                  <div>
                    <span className="label-mono text-muted-foreground">
                      Subject
                    </span>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight">
                      {selectedMessage.subject}
                    </h3>
                  </div>
                  <div>
                    <span className="label-mono text-muted-foreground">
                      Message
                    </span>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end border-t border-border p-5">
                  <Button asChild>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                    >
                      <Reply className="size-4" aria-hidden /> Reply via email
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-16 text-center text-muted-foreground">
                <MailOpen className="size-6" aria-hidden />
                <p className="label-mono">
                  Select a message
                </p>
                <p className="text-sm">Pick a conversation on the left to read it.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Delete this message?"
        description={`The message from ${pendingDelete?.name} will be permanently removed from your archive.`}
        confirmLabel="Delete message"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
