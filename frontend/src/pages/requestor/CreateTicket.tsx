import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppShell } from "@/layouts/Sidebar"
import { PageHeader } from "@/layouts/PageHeader"
import { Button } from "@/components/ui/Button"
import { Input, Textarea, Select, FormField } from "@/components/ui/Input"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useCategories } from "@/hooks/useData"
export function CreateTicket() {
  const navigate=useNavigate(),{profile}=useAuth(),{categories}=useCategories(); const [form,setForm]=useState({subject:"",category:"",priority:"",description:""}); const [error,setError]=useState(""),[saving,setSaving]=useState(false)
  async function submit(e:React.FormEvent){e.preventDefault();if(!profile)return;setSaving(true);setError("");const {data,error:x}=await supabase.from("tickets").insert({subject:form.subject,description:form.description,category_id:form.category,priority:form.priority.toLowerCase(),requestor_id:profile.id}).select("id").single();if(x){setError(x.message);setSaving(false)}else navigate(`/requestor/tickets/${data.id}`,{replace:true})}
  const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setForm(v=>({...v,[k]:e.target.value}))
  return <AppShell role="requestor"><div className="px-8 py-8 max-w-2xl"><PageHeader title="Submit Request" subtitle="Tell us what you need help with."/><div className="bg-white rounded-2xl border p-8"><form onSubmit={submit} className="space-y-6">{error&&<p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<FormField label="Subject" required><Input value={form.subject} onChange={set("subject")} required/></FormField><div className="grid grid-cols-2 gap-4"><FormField label="Category" required><Select value={form.category} onChange={set("category")} required><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Select></FormField><FormField label="Priority" required><Select value={form.priority} onChange={set("priority")} required><option value="">Select priority</option>{["Low","Medium","High","Critical"].map(p=><option key={p}>{p}</option>)}</Select></FormField></div><FormField label="Description" required><Textarea rows={6} value={form.description} onChange={set("description")} required/></FormField><div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={()=>navigate("/requestor")}>Cancel</Button><Button type="submit" disabled={saving}>{saving?"Submitting…":"Submit Request"}</Button></div></form></div></div></AppShell>
}
