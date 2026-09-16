"use client";
import { useState, useEffect } from "react";

interface Course {
  id: number;
  name: string;
  description: string | null;
  fee: string | null;
  batchTimings: string | null;
  duration: string | null;
  isActive: boolean;
  displayOrder: number;
}

const emptyForm = { name: "", description: "", fee: "", batchTimings: "", duration: "", isActive: true, displayOrder: 0 };

export default function AdminCourses() {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses?all=true");
      const data = await res.json();
      if (data.success) setItems(data.courses);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const showMsg = (text: string) => { setMsg(text); setTimeout(() => setMsg(""), 4000); };
  const handleChange = (field: string, value: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { showMsg("Error: Course name required hai!"); return; }
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const body = editId ? { ...form, id: editId } : form;
      const res = await fetch("/api/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(editId ? "✅ Course updated!" : "✅ Course added!");
        setForm({ ...emptyForm }); setEditId(null); fetchItems();
      } else { showMsg("Error: " + (data.error || "Kuch galat hua")); }
    } catch { showMsg("Error: Request failed"); }
    finally { setSaving(false); }
  };

  const handleEdit = (item: Course) => {
    setEditId(item.id);
    setForm({ name: item.name, description: item.description || "", fee: item.fee || "", batchTimings: item.batchTimings || "", duration: item.duration || "", isActive: item.isActive, displayOrder: item.displayOrder });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = async (item: Course) => {
    try {
      const res = await fetch("/api/courses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, isActive: !item.isActive }) });
      const data = await res.json();
      if (data.success) { showMsg(item.isActive ? "Course hidden kar diya!" : "Course show kar diya!"); fetchItems(); }
    } catch { showMsg("Error: Toggle failed"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Kya aap is course ko permanently delete karna chahte hain?")) return;
    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("✅ Course deleted!"); fetchItems(); }
      else { showMsg("Error: " + (data.error || "Delete failed")); }
    } catch { showMsg("Error: Delete failed"); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.95rem", marginBottom: "0", fontFamily: "inherit", color: "#333", background: "#fff" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#444", marginBottom: "6px" };
  const fld: React.CSSProperties = { display: "flex", flexDirection: "column", marginBottom: "16px" };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary-color)", marginBottom: "8px" }}>📚 Courses Manager</h1>
      <p style={{ color: "#666", marginBottom: "30px", fontSize: "0.95rem" }}>
        Courses add, edit ya delete karein — changes public page pe real-time mein dikhenge.
      </p>

      {msg && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", background: msg.startsWith("Error") ? "#ffebee" : "#e8f5e9", color: msg.startsWith("Error") ? "#c62828" : "#2e7d32", fontWeight: "500" }}>
          {msg}
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", marginBottom: "32px", border: editId ? "2px solid #F97316" : "1px solid #eee" }}>
        <h3 style={{ margin: "0 0 22px", color: "#333", fontSize: "1.1rem" }}>
          {editId ? "✏️ Course Edit Karein" : "➕ Naya Course Add Karein"}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div style={{ ...fld, gridColumn: "1 / -1" }}>
            <label style={lbl}>Course Name *</label>
            <input style={inp} placeholder="e.g., Spoken English, Grammar Mastery" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div style={{ ...fld, gridColumn: "1 / -1" }}>
            <label style={lbl}>Course Description</label>
            <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} placeholder="Course ki details likhein..." value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
          </div>
          <div style={fld}>
            <label style={lbl}>Course Fee</label>
            <input style={inp} placeholder="e.g., Rs.1500/month" value={form.fee} onChange={(e) => handleChange("fee", e.target.value)} />
          </div>
          <div style={fld}>
            <label style={lbl}>Duration</label>
            <input style={inp} placeholder="e.g., 3 months" value={form.duration} onChange={(e) => handleChange("duration", e.target.value)} />
          </div>
          <div style={{ ...fld, gridColumn: "1 / -1" }}>
            <label style={lbl}>Batch Timings</label>
            <input style={inp} placeholder="e.g., Morning: 7AM-8AM | Evening: 6PM-7PM" value={form.batchTimings} onChange={(e) => handleChange("batchTimings", e.target.value)} />
          </div>
          <div style={fld}>
            <label style={lbl}>Display Order</label>
            <input style={inp} type="number" value={form.displayOrder} onChange={(e) => handleChange("displayOrder", parseInt(e.target.value) || 0)} />
          </div>
          <div style={{ ...fld, justifyContent: "flex-end" }}>
            <label style={lbl}>Status</label>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "4px" }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} style={{ width: "18px", height: "18px", margin: "0" }} />
              <span style={{ fontSize: "0.9rem", color: form.isActive ? "#2e7d32" : "#888" }}>
                {form.isActive ? "✅ Public page pe visible" : "🙈 Hidden"}
              </span>
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button onClick={handleSubmit} disabled={saving} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#F97316,#C2410C)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.95rem", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : editId ? "💾 Update Course" : "➕ Add Course"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ ...emptyForm }); }} style={{ padding: "12px 24px", background: "#f5f5f5", color: "#555", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: "1.1rem", color: "#333", marginBottom: "16px" }}>📋 Sab Courses ({items.length})</h3>

      {loading ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : items.length === 0 ? (
        <div style={{ background: "white", borderRadius: "12px", padding: "48px", textAlign: "center", color: "#888", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📚</div>
          <p>Abhi koi course nahi hai. Upar form se add karein!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: "white", borderRadius: "10px", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${item.isActive ? "#e8f5e9" : "#f5f5f5"}`, opacity: item.isActive ? 1 : 0.7 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "1.05rem", color: "#1E3A5F" }}>📚 {item.name}</strong>
                    <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600", background: item.isActive ? "#e8f5e9" : "#f5f5f5", color: item.isActive ? "#2e7d32" : "#888" }}>
                      {item.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  {item.description && <p style={{ fontSize: "0.88rem", color: "#666", margin: "0 0 8px", lineHeight: "1.5" }}>{item.description}</p>}
                  <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "0.82rem" }}>
                    {item.fee && <span style={{ color: "#F97316", fontWeight: "700" }}>💰 {item.fee}</span>}
                    {item.duration && <span style={{ color: "#555" }}>⏱️ {item.duration}</span>}
                    {item.batchTimings && <span style={{ color: "#555" }}>⏰ {item.batchTimings}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <button onClick={() => handleEdit(item)} style={{ padding: "7px 14px", background: "#e3f2fd", color: "#1565c0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>✏️ Edit</button>
                  <button onClick={() => handleToggle(item)} style={{ padding: "7px 14px", background: item.isActive ? "#fff3e0" : "#e8f5e9", color: item.isActive ? "#e65100" : "#2e7d32", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500", fontSize: "0.85rem" }}>
                    {item.isActive ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: "7px 14px", background: "#ffebee", color: "#c62828", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500", fontSize: "0.85rem" }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
