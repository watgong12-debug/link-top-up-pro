import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { links, total } = (location.state as { links: any[]; total: number }) || { links: [], total: 0 };
  const [status, setStatus] = useState<"validating" | "processing" | "done">("validating");

  useEffect(() => {
    if (!links.length) {
      navigate("/topup");
      return;
    }

    const run = async () => {
      // Validate links
      await new Promise((r) => setTimeout(r, 1500));
      setStatus("processing");
      await new Promise((r) => setTimeout(r, 1500));
      setStatus("done");
      await new Promise((r) => setTimeout(r, 800));
      navigate("/payment", { state: { links, total } });
    };

    run();
  }, []);

  const steps = [
    { key: "validating", label: "Validating links…" },
    { key: "processing", label: "Processing request…" },
    { key: "done", label: "Redirecting to payment…" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="glass-card p-10 max-w-sm w-full text-center">
        <Loader2 className="w-10 h-10 text-primary mx-auto mb-6 animate-spin" />
        <h2 className="text-xl font-semibold text-foreground mb-6">Processing Your Request</h2>

        <div className="space-y-3 text-left">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-3">
              {i < currentIndex ? (
                <CheckCircle className="w-4 h-4 text-success shrink-0" />
              ) : i === currentIndex ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-border shrink-0" />
              )}
              <span className={`text-sm ${i <= currentIndex ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          {links.length} link{links.length > 1 ? "s" : ""} · ${total.toFixed(2)} total
        </p>
      </div>
    </div>
  );
};

export default Processing;
