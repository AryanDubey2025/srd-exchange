"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, Delete, X, Loader2 } from "lucide-react";
import { useAccount, usePublicClient, useWallets } from "@particle-network/connectkit";
import { fetchChainAssets, formatBalance, type TokenAsset } from "@/lib/ankrApi";
import { parseAbi, parseUnits } from "viem";
import { bsc } from "@particle-network/connectkit/chains";
import { useRates } from "@/hooks/useRates";

const FALLBACK_EXCHANGE_RATE = 85.6;
const NETWORK_FEE_USDT = 0.05;
const ADMIN_WALLET = "0xa78f80ac6b2dbe44a098557824ffae8b961148ca";
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const BSC_CHAIN_ID = 56;

const USDT_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
]);

const keypadKeys = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  ".", "0", "backspace",
] as const;

function QrGlyph() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
      <rect width="64" height="64" rx="12" fill="#f3e8ff" />
      <rect x="8" y="8" width="16" height="16" rx="2" fill="#181221" />
      <rect x="12" y="12" width="8" height="8" rx="1" fill="#f3e8ff" />
      <rect x="40" y="8" width="16" height="16" rx="2" fill="#181221" />
      <rect x="44" y="12" width="8" height="8" rx="1" fill="#f3e8ff" />
      <rect x="8" y="40" width="16" height="16" rx="2" fill="#181221" />
      <rect x="12" y="44" width="8" height="8" rx="1" fill="#f3e8ff" />
      <rect x="29" y="10" width="4" height="4" rx="1" fill="#181221" />
      <rect x="35" y="10" width="4" height="10" rx="1" fill="#181221" />
      <rect x="28" y="18" width="10" height="4" rx="1" fill="#181221" />
      <rect x="28" y="28" width="4" height="4" rx="1" fill="#181221" />
      <rect x="34" y="26" width="4" height="10" rx="1" fill="#181221" />
      <rect x="40" y="28" width="4" height="4" rx="1" fill="#181221" />
      <rect x="46" y="28" width="4" height="10" rx="1" fill="#181221" />
      <rect x="26" y="34" width="6" height="4" rx="1" fill="#181221" />
      <rect x="26" y="40" width="4" height="4" rx="1" fill="#181221" />
      <rect x="32" y="40" width="4" height="10" rx="1" fill="#181221" />
      <rect x="38" y="40" width="4" height="4" rx="1" fill="#181221" />
      <rect x="44" y="40" width="4" height="4" rx="1" fill="#181221" />
      <rect x="40" y="46" width="10" height="4" rx="1" fill="#181221" />
      <rect x="52" y="40" width="4" height="10" rx="1" fill="#181221" />
      <rect x="26" y="52" width="4" height="4" rx="1" fill="#181221" />
      <rect x="44" y="52" width="4" height="4" rx="1" fill="#181221" />
    </svg>
  );
}

function formatUsdt(amount: string) {
  const n = Number.parseFloat(amount || "0");
  return !Number.isFinite(n) ? "0.00" : n.toFixed(2);
}

function extractUpiId(text: string): string | null {
  if (!text) return null;
  const m = text.match(/[?&]pa=([^&]+)/i);
  if (m?.[1]) { const d = decodeURIComponent(m[1]); if (d.includes("@")) return d; }
  const u = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+)/);
  return u?.[1] ?? null;
}

const TELEGRAM_GROUP_URL = "https://telegram.me/SrdExchangeGlobal";

export default function QR() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [primaryWallet] = useWallets();
  const { getSellRate } = useRates();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const [screen, setScreen] = useState<"amount" | "processing" | "scan" | "success">("amount");
  const [featureEnabled, setFeatureEnabled] = useState(false);
  const [featureLoading, setFeatureLoading] = useState(true);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [scannedUpiId, setScannedUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [scanError, setScanError] = useState("");
  const [scanner, setScanner] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAssetsLoading, setWalletAssetsLoading] = useState(false);
  const [walletAssetsError, setWalletAssetsError] = useState("");
  const [usdtAsset, setUsdtAsset] = useState<TokenAsset | null>(null);

  const videoRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const sellRate = getSellRate("UPI") || FALLBACK_EXCHANGE_RATE;
  const usdtAmount = useMemo(() => {
    const n = Number.parseFloat(amount || "0");
    return !Number.isFinite(n) ? "0.00" : formatUsdt((n / sellRate).toString());
  }, [amount, sellRate]);
  const displayAmount = amount.endsWith(".") ? amount.slice(0, -1) || "0" : amount;
  const displayFontSize = useMemo(() => {
    const len = displayAmount.length;
    if (len <= 2) return "5rem";
    if (len <= 4) return "4rem";
    if (len <= 6) return "3rem";
    if (len <= 8) return "2rem";
    return "0.6rem";
  }, [displayAmount]);
  const hasValidAmount = Number.parseFloat(displayAmount || "0") > 0;
  const requiredUsdt = useMemo(() => Number.parseFloat(usdtAmount || "0") + NETWORK_FEE_USDT, [usdtAmount]);
  const availableUsdt = Number.parseFloat(usdtAsset?.balance || "0");
  const hasSufficientBalance = availableUsdt >= requiredUsdt;

  useEffect(() => {
    if (address) setWalletAddress(address);
  }, [address]);

  useEffect(() => {
    let ignore = false;

    async function loadWalletAssets() {
      if (!walletAddress) {
        setUsdtAsset(null);
        setWalletAssetsError("");
        return;
      }

      try {
        setWalletAssetsLoading(true);
        setWalletAssetsError("");
        const assets = await fetchChainAssets(walletAddress, BSC_CHAIN_ID);
        const matchedUsdt = assets.find((asset) =>
          asset.contractAddress?.toLowerCase() === USDT_ADDRESS.toLowerCase() || asset.symbol?.toUpperCase() === "USDT"
        ) ?? null;
        if (!ignore) setUsdtAsset(matchedUsdt);
      } catch (err: any) {
        if (!ignore) {
          setUsdtAsset(null);
          setWalletAssetsError(err?.message || "Failed to load wallet balance");
        }
      } finally {
        if (!ignore) setWalletAssetsLoading(false);
      }
    }

    loadWalletAssets();
    return () => { ignore = true; };
  }, [walletAddress, isOpen]);

  // Feature flag
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setFeatureLoading(true);
        const res = await fetch("/api/feature-flags/qr-scan-pay", { cache: "no-store" });
        const data = await res.json();
        if (!ignore) setFeatureEnabled(Boolean(data?.enabled));
      } catch {
        if (!ignore) setFeatureEnabled(false);
      } finally {
        if (!ignore) setFeatureLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, []);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => { stopScan(); };
  }, []);

  const stopScan = () => {
    if (scanner) {
      scanner.stop().catch(() => {});
      setScanner(null);
    }
  };

  const startScan = async () => {
    setScanError("");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const qr = new Html5Qrcode("qr-reader");
      setScanner(qr);
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (text: string) => {
          const upiId = extractUpiId(text);
          if (upiId) { stopScan(); handleUpiScanned(upiId); }
          else setScanError("Invalid QR code. Please scan a valid UPI QR.");
        },
        () => {}
      );
    } catch (err: any) {
      console.error("QR scan error:", err);
      setScanError("Camera access denied. Please enter UPI ID manually.");
    }
  };

  const handleClose = () => {
    stopScan();
    setIsOpen(false);
    setScreen("amount");
    setAmount("0");
    setScannedUpiId("");
    setOrderData(null);
    setScanError("");
  };

  const handleKeyPress = (key: (typeof keypadKeys)[number]) => {
    if (key === "backspace") {
      setAmount(c => {
        const n = c.slice(0, -1);
        return n === "" || n === "-" ? "0" : n;
      });
      return;
    }
    if (key === ".") { setAmount(c => c.includes(".") ? c : `${c}.`); return; }
    setAmount(c => {
      if (c === "0") return key;
      const [w = "", d = ""] = c.split(".");
      if (d.length >= 2 && c.includes(".")) return c;
      if (w.length >= 6 && !c.includes(".")) return c;
      return `${c}${key}`;
    });
  };

  const handleUpiScanned = async (upiId: string) => {
    setScannedUpiId(upiId);
    if (orderData?.id) {
      try {
        const res = await fetch(`/api/orders/${orderData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminUpiId: upiId }),
        });
        if (!res.ok) throw new Error("Failed to update order");
        setScreen("success");
      } catch (err: any) {
        console.log(`Failed to update order: ${err.message}`);
      }
    }
  };

  const sendGasStationUSDT = async (): Promise<string> => {
    if (!address) throw new Error("Wallet not connected");

    console.log("🏁 sendGasStationUSDT starting", { address, usdtAmount });

    const callApi = async () => {
      console.log("📡 Calling /api/gas-station/transfer-usdt", { userAddress: address, usdtAmount });
      const res = await fetch("/api/gas-station/transfer-usdt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, usdtAmount }),
      });
      const json = await res.json();
      console.log("📡 API response:", json);
      if (!res.ok) {
        console.error("❌ API returned error status:", res.status, json);
      }
      return json;
    };

    const doApprove = async (spender: string) => {
      if (!primaryWallet) throw new Error("Wallet not available");
      console.log("📝 Approval needed, user signing approve tx for spender:", spender);
      const walletClient = await primaryWallet.getWalletClient();
      console.log("📝 Got wallet client, calling writeContract approve...");
      try {
        const approveHash = await walletClient.writeContract({
          address: USDT_ADDRESS as `0x${string}`,
          abi: USDT_ABI,
          functionName: "approve",
          args: [spender as `0x${string}`, parseUnits(usdtAmount, 18)],
          account: address as `0x${string}`,
          chain: bsc,
        });
        console.log("✅ Approve tx sent, hash:", approveHash);
        if (publicClient) {
          console.log("⏳ Waiting for approve tx receipt...");
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
          console.log("✅ Approve tx confirmed");
        }
        return approveHash;
      } catch (approveError: any) {
        console.error("❌ Approve tx failed:", approveError);
        throw new Error(`Approval failed: ${approveError?.message || 'Unknown error'}`);
      }
    };

    console.log("📡 First API call - checking gas station...");
    let data = await callApi();
    console.log("📡 First API result:", data);
    if (!data.success) {
      console.error("❌ First API call failed:", data.error);
      throw new Error(data.error);
    }

    if (data.method === "user_funded_for_approval" || data.method === "user_has_bnb_needs_approval") {
      console.log(`📝 Approval flow triggered (method=${data.method}), gasStationAddress=${data.gasStationAddress}`);
      await doApprove(data.gasStationAddress);
      console.log("📡 Second API call - after approval...");
      data = await callApi();
      console.log("📡 Second API result:", data);
      if (!data.success) {
        console.error("❌ Second API call failed:", data.error);
        throw new Error(data.error);
      }
    }

    if (data.method !== "gasless_transfer") {
      console.error("❌ Unexpected method after all attempts:", data.method);
      throw new Error(`Unexpected response: ${data.method}. Message: ${data.error || 'Unknown'}`);
    }

    console.log("🎉 USDT transfer successful, txHash:", data.txHash);
    return data.txHash;
  };

  const handleConfirmPay = async () => {
    console.log("🔍 Proceed to Pay clicked", {
      hasValidAmount,
      hasSufficientBalance,
      isConnected,
      walletAssetsLoading,
      usdtAmount,
      availableUsdt,
      requiredUsdt,
    });

    

    setIsProcessing(true);
    setScreen("processing");

    try {
      if (!address) throw new Error("Wallet not connected. Please reconnect your wallet.");

      const txHash = await sendGasStationUSDT();

      // Create order (without UPI ID initially)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          orderType: "SELL_UPI",
          amount: Number.parseFloat(displayAmount),
          usdtAmount: Number.parseFloat(usdtAmount),
          sellRate,
          adminUpiId: "",
          status: "PENDING_ADMIN_PAYMENT",
          gasStationTxHash: txHash,
        }),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();
      setOrderData(data.order);

      // Now go to scan screen to get UPI ID
      setScreen("scan");
      setTimeout(startScan, 300);
    } catch (err: any) {
      const displayMessage = err?.message || "Payment failed";
      console.log(`Payment failed: ${displayMessage}`);
      handleClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTelegramClick = () => {
    window.open(TELEGRAM_GROUP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-sm justify-center px-6 py-6 sm:py-8">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            if (featureLoading || !featureEnabled) { setShowOfflineNotice(true); return; }
            setShowOfflineNotice(false); setScreen("amount"); setIsOpen(true);
          }}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="scan-pay-dialog"
          className="group relative flex aspect-square w-[96px] items-center justify-center rounded-full bg-[#08080c] shadow-[0_0_0_1px_rgba(158,93,255,0.22),0_0_0_4px_rgba(147,51,234,0.05),0_0_18px_rgba(147,51,234,0.16)] transition-transform duration-150 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f67ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] sm:w-[108px]"
        >
          <div className="absolute inset-[3px] rounded-full border border-white/6" />
          <div className="absolute inset-[6px] rounded-full border border-[#9a5dff]/45" />
          <div className="flex flex-col items-center gap-1">
            <div className="relative h-[44px] w-[44px] sm:h-[48px] sm:w-[48px]">
              <div className="absolute left-0 top-0 h-3 w-3 rounded-tl-md border-l-[3px] border-t-[3px] border-[#9a5dff] drop-shadow-[0_0_6px_rgba(154,93,255,0.7)]" />
              <div className="absolute right-0 top-0 h-3 w-3 rounded-tr-md border-r-[3px] border-t-[3px] border-[#9a5dff] drop-shadow-[0_0_6px_rgba(154,93,255,0.7)]" />
              <div className="absolute bottom-0 left-0 h-3 w-3 rounded-bl-md border-b-[3px] border-l-[3px] border-[#9a5dff] drop-shadow-[0_0_6px_rgba(154,93,255,0.7)]" />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-br-md border-b-[3px] border-r-[3px] border-[#9a5dff] drop-shadow-[0_0_6px_rgba(154,93,255,0.7)]" />
              <div className="absolute inset-[8px] shadow-[0_0_10px_rgba(243,232,255,0.14)]">
                <QrGlyph />
              </div>
            </div>
            <p className="text-center text-[0.6rem] font-semibold tracking-[-0.04em] text-white [text-shadow:0_0_10px_rgba(255,255,255,0.16)] sm:text-[0.7rem]">
              QR Scan &amp; Pay
            </p>
          </div>
        </button>
      </div>

      {showOfflineNotice && (
        <div className="mx-auto -mt-2 flex w-full max-w-sm justify-center px-6 pb-4">
          <div className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-300 shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
            Offline
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 px-0 py-0 sm:flex sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="scan-pay-title" id="scan-pay-dialog">
          <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black text-white sm:min-h-[820px] sm:max-w-[390px] sm:rounded-[2rem] sm:border sm:border-white/10 sm:shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
            <div className="border-y border-white/10 bg-[#111113] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src="/srd.jpg" alt="SRD Exchange" width={34} height={34} className="h-[34px] w-[34px] rounded-full object-cover" />
                  <h2 id="scan-pay-title" className="text-[1.08rem] font-medium tracking-[-0.02em] text-white/95">
                    {screen === "success" ? "SRD.Exchange" : "Scan & Pay"}
                  </h2>
                </div>
                {screen === "success" ? (
                  <p className="text-[0.82rem] font-medium text-white/45">Order: {orderData?.id || "..."}</p>
                ) : (
                  <button ref={closeRef} type="button" onClick={handleClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#17181d] text-white/70 hover:bg-[#1f2026] hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Amount Screen */}
            {screen === "amount" && (
              <div className="flex flex-1 flex-col px-4 pb-16   pt-5">
                <div className="mx-auto flex flex-row items-center gap-2 rounded-md bg-[#0c0c0c] px-5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="text-[0.72rem] font-semibold text-white/80">Available</p>
                  {walletAssetsLoading ? (
                    <p className="pt-0.5 text-[0.78rem] font-medium text-white/60">Loading balance...</p>
                  ) : walletAssetsError ? (
                    <p className="pt-0.5 text-[0.78rem] font-medium text-red-300">{walletAssetsError}</p>
                  ) : (
                    <>
                      <p className="pt-0.5 text-[0.84rem] font-semibold text-white/95">
                      </p>
                      <p className="text-[0.7rem] font-medium text-white/55">
                        {formatBalance(usdtAsset?.balance || "0", usdtAsset?.decimals)} USDT
                      </p>
                    </>
                  )}
                </div>
                <div className="relative flex flex-1 items-center justify-center pb-8 pt-12">
                  <div className="absolute left-1/2 top-[48%] max-w-[65%] -translate-x-1/2 -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap font-medium leading-none tracking-[-0.12em] text-white tabular-nums" style={{ fontSize: displayFontSize }}>
                    {displayAmount}
                  </div>
                  <div className="relative flex h-full w-full items-center">
                    <div className="absolute left-[18%] top-[-80px] text-[2rem] font-semibold leading-none tracking-[-0.06em] text-white sm:left-[20%]">₹</div>
                    <div className="absolute right-[8%] top-[-70px] max-w-[40%] text-right sm:right-[10%]">
                      <p className="truncate text-[0.65rem] font-medium text-white/75">= {usdtAmount} USDT</p>
                      <p className="text-[0.9rem] -top-4 font-semibold text-[#9d76ff]">+ {NETWORK_FEE_USDT.toFixed(2)} USDT</p>
                  </div>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2 rounded-[0.2rem] border border-white/5 bg-[#171717] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <AlertCircle className="h-6 w-6 shrink-0 fill-[#f14336] text-black" />
                  <p className="text-[0.78rem]  leading-5 text-white/80">
                   Please only Ask Bill/payable Amount, Don't ask QR!
                  </p>
                </div>
                 <button
                   type="button"
                   onClick={handleConfirmPay}
                    disabled={isProcessing}
                   className="mb-4 h-10 w-full rounded-2xl bg-[linear-gradient(90deg,#8f63ff_0%,#5a35b0_100%)] text-[1rem] font-semibold tracking-[-0.02em] text-white shadow-[0_10px_30px_rgba(103,69,190,0.35)] transition-transform hover:brightness-110 disabled:opacity-50"
                 >
                   Proceed to Pay
                 </button>
                <div className="grid grid-cols-3 gap-2">
                  {keypadKeys.map((key) => (
                    <button key={key} type="button" onClick={() => handleKeyPress(key)} aria-label={key === "backspace" ? "Delete" : `Enter ${key}`} className="flex h-[44px] items-center justify-center rounded-2xl bg-[#171717] text-[2rem] font-medium text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:bg-[#1d1d1d]">
                      {key === "backspace" ? <Delete className="h-7 w-7" /> : key}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Screen */}
            {screen === "processing" && (
              <div className="flex flex-1 flex-col items-center justify-center px-4">
                <Loader2 className="h-16 w-16 animate-spin text-[#8f63ff]" />
                <h3 className="mt-6 text-xl font-semibold text-white">Processing...</h3>              </div>
            )}

            {/* Scan Screen */}
            {screen === "scan" && (
              <div className="flex flex-1 flex-col border-t border-white/6 bg-[radial-gradient(circle_at_center,rgba(94,60,196,0.16)_0%,rgba(17,17,19,0.05)_42%,rgba(0,0,0,0)_72%)] px-5 pb-16 pt-7">
                <h3 className="pb-4 text-center text-[1.15rem] font-medium tracking-[-0.03em] text-white/95">Scan Merchant QR</h3>
                <div className="mx-auto mt-1 flex h-[250px] w-full max-w-[290px] items-center justify-center">
                  <div id="qr-reader" ref={videoRef} className="h-[250px] w-full overflow-hidden rounded-[1rem] bg-black" />
                </div>
                {scanError && (
                  <div className="mx-auto mt-4 max-w-[300px] rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-center text-sm text-red-300">
                    {scanError}
                  </div>
                )}
                <div className="mx-auto mt-8 w-full max-w-[300px] space-y-4 text-[0.92rem] font-medium text-white/82">
                  <div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#8f63ff] shadow-[0_0_10px_rgba(143,99,255,0.6)]" /><span>Scan QR from vendor</span></div>
                  <div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#8f63ff] shadow-[0_0_10px_rgba(143,99,255,0.6)]" /><span>Don't back. Amount can't be change</span></div>
                </div>
              </div>
            )}

            {/* Success Screen */}
            {screen === "success" && (
              <div className="flex flex-1 flex-col bg-[radial-gradient(circle_at_50%_22%,rgba(166,255,121,0.11)_0%,rgba(22,22,26,0.22)_24%,rgba(0,0,0,0)_54%)] pb-4">
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-col items-center px-6 pb-6 pt-8">
                    <div className="relative flex h-[126px] w-[126px] items-center justify-center rounded-full border-[4px] border-[#b7ff8e] shadow-[0_0_24px_rgba(183,255,142,0.18)]">
                      <Check className="h-16 w-16 stroke-[4] text-[#d8ffbc]" />
                    </div>
                    <h3 className="pt-6 text-[1.2rem] font-medium tracking-[-0.03em] text-white/95">Payment Completed</h3>
                    <p className="pt-2 text-center text-sm text-white/60">Admin will send ₹{Number.parseFloat(displayAmount || "0").toLocaleString("en-IN")}<br/>to {scannedUpiId} via UPI</p>
                  </div>
                  <div className="mx-4 rounded-[0.2rem] border-x border-t border-white/7 bg-[#121216]/90 px-4 py-3 text-center">
                    <p className="text-[1.12rem] font-medium tracking-[-0.03em] text-[#b7e88f]">₹ {Number.parseFloat(displayAmount || "0").toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="pt-1 text-[0.9rem] font-medium text-white/70">= {usdtAmount} USDT sent</p>
                    <p className="pt-2 text-xs text-white/50">Merchant: {scannedUpiId}</p>
                  </div>
                  <div className="min-h-[100px] flex-1" />
                </div>
                <div className="px-4 pb-8 pt-4">
                  <div className="mb-5 flex items-start gap-2.5 rounded-[0.2rem] bg-[#121216]/92 px-4 py-3 text-white/72">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 fill-[#f14336] text-black" />
                    <p className="text-[0.82rem] font-medium leading-5">
                      Ask merchant to give payment screenshot in group, if needed?
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleTelegramClick}
                      className="flex h-14 w-full items-center justify-center gap-3 rounded-[1.8rem] bg-[linear-gradient(90deg,#7c5bdf_0%,#5e2db3_48%,#38116e_100%)] px-5 text-[0.96rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_24px_rgba(67,24,145,0.36)] hover:brightness-110"
                    >
                      <Image src="/telegram.svg" alt="" width={26} height={26} className="h-7 w-7" />
                      <span>Ask Screenshot in Group</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="h-14 w-full rounded-[1.8rem] bg-[linear-gradient(90deg,#7c5bdf_0%,#5e2db3_48%,#38116e_100%)] text-[1rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_24px_rgba(67,24,145,0.36)] hover:brightness-110"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
