import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)

async function testTelemetry() {
  console.log("\n4. Trying direct INSERT into page_views...")
  const { data: insertData, error: insertError } = await supabase.from('page_views').insert({ path: '/test-direct', view_count: 5 }).select()
  console.log("Direct Insert Error:", insertError?.message)
  console.log("Direct Insert Data:", insertData)
}

testTelemetry()
