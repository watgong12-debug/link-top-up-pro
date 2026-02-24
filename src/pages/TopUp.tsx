import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Globe, Link as LinkIcon, DollarSign, LogOut } from "lucide-react";

interface LinkEntry {
  id: string;
  url: string;
  amount: string;
  country: string;
}

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Germany", "France", "Australia", "Japan", "Brazil", "India", "Other"];

const TopUp = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkEntry[]>([
    { id: crypto.randomUUID(), url: "", amount: "", country: "United States" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addLink = () => {
    setLinks([...links, { id: crypto.randomUUID(), url: "", amount: "", country: "United States" }]);
  };

  const removeLink = (id: string) => {
    if (links.length > 1) setLinks(links.filter((l) => l.id !== id));
  };

  const updateLink = (id: string, field: keyof LinkEntry, value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const total = links.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    links.forEach((l) => {
      if (!l.url.trim()) newErrors[l.id] = "Link is required";
      else if (parseFloat(l.amount) > 250) newErrors[l.id] = "Max $250 per link";
      else if (!l.amount || parseFloat(l.amount) <= 0) newErrors[l.id] = "Valid amount required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      navigate("/processing", { state: { links, total } });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Soft<span className="text-primary">Top</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Link Top-Up</h2>
          <p className="text-muted-foreground text-sm mt-1">Add links and amounts to top up. Max $250 per link.</p>
        </div>

        <div className="space-y-4">
          {links.map((link, i) => (
            <div key={link.id} className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Link #{i + 1}</span>
                {links.length > 1 && (
                  <button onClick={() => removeLink(link.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      value={link.country}
                      onChange={(e) => updateLink(link.id, "country", e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Link URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, "url", e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="0"
                      max="250"
                      value={link.amount}
                      onChange={(e) => updateLink(link.id, "amount", e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {errors[link.id] && (
                <p className="text-xs text-destructive">{errors[link.id]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addLink}
          className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add another link
        </button>

        <div className="glass-card p-5 mt-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-foreground">${total.toFixed(2)}</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={total === 0}
            className="gradient-primary text-primary-foreground font-semibold px-8 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
};

export default TopUp;
