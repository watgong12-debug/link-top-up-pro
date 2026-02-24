import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Copy, CheckCircle, AlertTriangle, Shield } from "lucide-react";

const WALLET_ADDRESS = "TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with real address

const CryptoPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = (location.state as { amount: number }) || { amount: 0 };
  const [txid, setTxid] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!txid.trim()) {
      setError("Please enter your Transaction ID (TXID)");
      return;
    }
    if (txid.trim().length < 10) {
      setError("Invalid TXID format. Please check and try again.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (!amount) {
    navigate("/topup");
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="glass-card p-10 max-w-sm w-full text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Payment Submitted</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your transaction is being verified on the blockchain. This may take a few minutes.
          </p>
          <p className="text-xs text-muted-foreground mb-1">TXID</p>
          <p className="text-xs text-foreground font-mono break-all mb-6">{txid}</p>
          <button
            onClick={() => navigate("/topup")}
            className="gradient-primary text-primary-foreground font-semibold px-8 py-2.5 rounded-lg hover:opacity-90 transition-opacity glow-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">
            Soft<span className="text-primary">Top</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Crypto Recharge</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div className="text-center pb-4 border-b border-border/50">
            <p className="text-sm text-muted-foreground">Amount to Send</p>
            <p className="text-3xl font-bold text-foreground mt-1">${amount.toFixed(2)} <span className="text-base text-muted-foreground">USDT</span></p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Network: TRC20 (Tron)</span>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Wallet Address</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 font-mono text-xs text-foreground break-all">
                  {WALLET_ADDRESS}
                </div>
                <button
                  onClick={copyAddress}
                  className="bg-secondary border border-border rounded-lg p-2.5 hover:bg-accent transition-colors shrink-0"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            <div className="text-xs text-warning space-y-1">
              <p className="font-medium">Important:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Send <strong>only USDT</strong> on the <strong>TRC20</strong> network</li>
                <li>Sending other tokens will result in permanent loss</li>
                <li>Minimum confirmation: 1 block</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Transaction ID (TXID)</label>
            <input
              type="text"
              value={txid}
              onChange={(e) => { setTxid(e.target.value); setError(""); }}
              placeholder="Enter your TXID after sending"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full gradient-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity glow-primary"
          >
            Verify Payment
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-secondary text-secondary-foreground font-medium py-2.5 rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;
