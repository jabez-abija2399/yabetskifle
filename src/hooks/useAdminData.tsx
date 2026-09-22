"use client"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"

export function useAdminData<T>(tableName: string) {
  const [data, setData] = useState<T[]>([])
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const loadKey = `${tableName}:${refreshKey}`
  const loading = loadedKey !== loadKey

  const fetchData = async () => {
    setRefreshKey(k => k + 1)
  }

  const deleteItem = async (id: string) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase.from(tableName).delete().eq("id", id)

    if (error) {
      toast.error(`Failed to delete: ${error.message}`)
      return false
    } else {
      toast.success("Item deleted successfully")
      fetchData()
      return true
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createSupabaseClient()
      const { data: result, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (error) {
        toast.error(`Error fetching ${tableName}: ${error.message}`)
      } else {
        setData(result as T[])
      }
      setLoadedKey(loadKey)
    })()
    return () => {
      cancelled = true
    }
  }, [tableName, loadKey])

  return { data, loading, deleteItem, refresh: fetchData }
}
