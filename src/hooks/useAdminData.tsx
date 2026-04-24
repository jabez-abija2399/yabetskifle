"use client"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"

export function useAdminData<T>(tableName: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    const { data: result, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false }) // Most recent first

    if (error) {
      toast.error(`Error fetching ${tableName}: ${error.message}`)
    } else {
      setData(result as T[])
    }
    setLoading(false)
  }

  const deleteItem = async (id: string) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase.from(tableName).delete().eq("id", id)

    if (error) {
      toast.error(`Failed to delete: ${error.message}`)
      return false
    } else {
      toast.success("Item deleted successfully")
      fetchData() // Refresh the list
      return true
    }
  }

  useEffect(() => {
    fetchData()
  }, [tableName])

  return { data, loading, deleteItem, refresh: fetchData }
}
