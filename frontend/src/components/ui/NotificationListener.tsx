   import { useEffect, useState } from "react"
   import { useAuth } from "@/contexts/AuthContext"
   import { supabase } from "@/lib/supabase"
   import { Toast } from "@/components/ui/Toast"

   export function NotificationListener() {
     const { session } = useAuth()
     const [toast, setToast] = useState<string | null>(null)

     useEffect(() => {
       if (!session?.user.id) return
       const channel = supabase
         .channel(`notifications-listener-${session.user.id}`)
         .on(
           "postgres_changes",
           { event: "INSERT", schema: "public", table: "notifications", filter: `recipient_id=eq.${session.user.id}` },
           (payload) => setToast((payload.new as { title: string }).title)
         )
         .subscribe()
       return () => { void supabase.removeChannel(channel) }
     }, [session?.user.id])

     if (!toast) return null
     return <Toast message={toast} onClose={() => setToast(null)} />
   }
