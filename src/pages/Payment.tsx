import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, ArrowRight, AlertCircle } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokenBalance } = useAuth();
  const { links, total } = (location.state as { links: any[]; total: number }) || { links: [], total: 0 };

  const difference = total - tokenBalance;
  const needsRecharge = difference > 0;

  if (!links?.length) {
    navigate("/topup");
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">
            Soft<span className="text-primary">Top</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Payment Summary</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <Wallet className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Balance Overview</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="text-lg font-semibold text-success">${tokenBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Required</span>
              <span className="text-lg font-semibold text-foreground">${total.toFixed(2)}</span>
            </div>
            <div className="border-t border-border/50 pt-3 flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {needsRecharge ? "Recharge Needed" : "Remaining After Payment"}
              </span>
              <span className={`text-lg font-bold ${needsRecharge ? "text-destructive" : "text-success"}`}>
                {needsRecharge ? `$${difference.toFixed(2)}` : `$${Math.abs(difference).toFixed(2)}`}
              </span>
            </div>
          </div>

          {needsRecharge && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-warning">
                Insufficient balance. You need to recharge ${difference.toFixed(2)} to complete this transaction.
              </p>
            </div>
          )}
        </div>

        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-3">Order Details</p>
          <div className="space-y-2">
            {links.map((link: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground truncate max-w-[200px]">{link.url || `Link #${i + 1}`}</span>
                <span className="text-foreground font-medium">${parseFloat(link.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/topup")}
            className="flex-1 bg-secondary text-secondary-foreground font-medium py-2.5 rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Back
          </button>
          {needsRecharge ? (
            <button
              onClick={() => navigate("/crypto-payment", { state: { amount: difference, links, total } })}
              className="flex-1 gradient-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow-primary"
            >
              Recharge <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className="flex-1 gradient-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity glow-primary"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
