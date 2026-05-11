"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, Delete, Loader2, X } from "lucide-react";

const FALLBACK_EXCHANGE_RATE = 85.6;
const NETWORK_FEE_USDT = 0.05;

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

type DemoScreen = "amount" | "processing" | "scan" | "success";

export default function QRPayDemo() {
  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState("0");
  const [screen, setScreen] = useState<DemoScreen>("amount");
  const [scannedUpiId, setScannedUpiId] = useState("demo@upi");
  const [scanError, setScanError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoBalance] = useState("250.00");

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const sellRate = FALLBACK_EXCHANGE_RATE;
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

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setScreen("amount");
    setAmount("0");
    setScannedUpiId("demo@upi");
    setScanError("");
    setIsProcessing(false);
  };

  const handleKeyPress = (key: (typeof keypadKeys)[number]) => {
    if (key === "backspace") {
      setAmount((current) => {
        const next = current.slice(0, -1);
        return next === "" || next === "-" ? "0" : next;
      });
      return;
    }
    if (key === ".") {
      setAmount((current) => (current.includes(".") ? current : `${current}.`));
      return;
    }
    setAmount((current) => {
      if (current === "0") return key;
      const [whole = "", decimal = ""] = current.split(".");
      if (decimal.length >= 2 && current.includes(".")) return current;
      if (whole.length >= 6 && !current.includes(".")) return current;
      return `${current}${key}`;
    });
  };

  const handleConfirmPay = async () => {
    if (!hasValidAmount) return;
    setIsProcessing(true);
    setScreen("processing");

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsProcessing(false);
    setScreen("scan");
    setScanError("");
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:justify-center">
        <div className="w-full max-w-sm shrink-0 rounded-[2rem] border border-white/10 bg-[#0d0d10] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">QR Pay Demo</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">UI-only playground</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">
            This route is detached from wallet, Particle, scanner, and backend behavior. It only simulates the screens.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Open Demo
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Reset Demo
            </button>
          </div>

          <div className="mt-5 space-y-3 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Quick States</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => { setIsOpen(true); setScreen("amount"); }} className="rounded-xl bg-[#171717] px-3 py-2 text-sm text-white/85 hover:bg-[#1e1e1e]">Amount</button>
              <button type="button" onClick={() => { setIsOpen(true); setScreen("processing"); }} className="rounded-xl bg-[#171717] px-3 py-2 text-sm text-white/85 hover:bg-[#1e1e1e]">Processing</button>
              <button type="button" onClick={() => { setIsOpen(true); setScreen("scan"); }} className="rounded-xl bg-[#171717] px-3 py-2 text-sm text-white/85 hover:bg-[#1e1e1e]">Scan</button>
              <button type="button" onClick={() => { setIsOpen(true); setScreen("success"); }} className="rounded-xl bg-[#171717] px-3 py-2 text-sm text-white/85 hover:bg-[#1e1e1e]">Success</button>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 justify-center">
          <div className="w-full max-w-sm">
            <div className="mx-auto flex w-full max-w-sm justify-center px-6 py-6 sm:py-8">
              <button
                ref={triggerRef}
                type="button"
                onClick={() => {
                  setIsOpen(true);
                  setScreen("amount");
                }}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls="scan-pay-demo-dialog"
                className="group relative flex aspect-square w-[126px] items-center justify-center rounded-full bg-[#08080c] shadow-[0_0_0_1px_rgba(158,93,255,0.22),0_0_0_4px_rgba(147,51,234,0.05),0_0_18px_rgba(147,51,234,0.16)] transition-transform duration-150 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f67ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] sm:w-[138px]"
              >
                <div className="absolute inset-[5px] rounded-full border border-white/6" />
                <div className="absolute inset-[8px] rounded-full border border-[#9a5dff]/45" />
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative h-[64px] w-[64px] sm:h-[70px] sm:w-[70px]">
                    <div className="absolute left-0 top-0 h-4 w-4 rounded-tl-lg border-l-[4px] border-t-[4px] border-[#9a5dff] drop-shadow-[0_0_8px_rgba(154,93,255,0.7)]" />
                    <div className="absolute right-0 top-0 h-4 w-4 rounded-tr-lg border-r-[4px] border-t-[4px] border-[#9a5dff] drop-shadow-[0_0_8px_rgba(154,93,255,0.7)]" />
                    <div className="absolute bottom-0 left-0 h-4 w-4 rounded-bl-lg border-b-[4px] border-l-[4px] border-[#9a5dff] drop-shadow-[0_0_8px_rgba(154,93,255,0.7)]" />
                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-br-lg border-b-[4px] border-r-[4px] border-[#9a5dff] drop-shadow-[0_0_8px_rgba(154,93,255,0.7)]" />
                    <div className="absolute inset-[12px] shadow-[0_0_14px_rgba(243,232,255,0.14)]">
                      <QrGlyph />
                    </div>
                  </div>
                  <p className="text-center text-[0.74rem] font-semibold tracking-[-0.04em] text-white [text-shadow:0_0_10px_rgba(255,255,255,0.16)] sm:text-[0.82rem]">
                    QR Scan &amp; Pay
                  </p>
                </div>
              </button>
            </div>

            {isOpen && (
              <div className="fixed inset-0 z-[100] bg-black/95 px-0 py-0 sm:flex sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="scan-pay-demo-title" id="scan-pay-demo-dialog">
                <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black text-white sm:min-h-[820px] sm:max-w-[390px] sm:rounded-[2rem] sm:border sm:border-white/10 sm:shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
                  <div className="flex items-center justify-between px-6 pb-3 pt-3 text-[0.78rem] text-white/85">
                    <span className="font-medium tracking-[0.08em]">15:28</span>
                    <div className="flex items-center gap-2" aria-hidden="true">
                      <div className="flex items-end gap-[2px]">
                        <span className="h-[4px] w-[3px] rounded-full bg-white/80" />
                        <span className="h-[6px] w-[3px] rounded-full bg-white/80" />
                        <span className="h-[8px] w-[3px] rounded-full bg-white/80" />
                        <span className="h-[10px] w-[3px] rounded-full bg-white/80" />
                      </div>
                      <span className="text-[0.68rem]">5G</span>
                      <div className="h-[10px] w-[20px] rounded-[3px] border border-white/80 p-[1px]">
                        <div className="h-full w-4/5 rounded-[2px] bg-[#84f25f]" />
                      </div>
                    </div>
                  </div>

                  <div className="border-y border-white/10 bg-[#111113] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image src="/srd.jpg" alt="SRD Exchange" width={34} height={34} className="h-[34px] w-[34px] rounded-full object-cover" />
                        <h2 id="scan-pay-demo-title" className="text-[1.08rem] font-medium tracking-[-0.02em] text-white/95">
                          {screen === "success" ? "SRD.Exchange" : "Scan & Pay"}
                        </h2>
                      </div>
                      {screen === "success" ? (
                        <p className="text-[0.82rem] font-medium text-white/45">Demo Mode</p>
                      ) : (
                        <button ref={closeRef} type="button" onClick={handleClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#17181d] text-white/70 hover:bg-[#1f2026] hover:text-white">
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {screen === "amount" && (
                    <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
                      <div className="mx-auto rounded-md bg-[#0c0c0c] px-5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <p className="text-[0.72rem] font-semibold text-white/80">Available</p>
                        <p className="pt-0.5 text-[0.7rem] font-medium text-white/55">{demoBalance} USDT</p>
                      </div>
                      <div className="relative flex flex-1 items-center justify-center pb-8 pt-12">
                        <div className="absolute left-1/2 top-[48%] max-w-[65%] -translate-x-1/2 -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap font-medium leading-none tracking-[-0.12em] text-white/[0.09] tabular-nums" style={{ fontSize: displayFontSize }}>
                          {displayAmount}
                        </div>
                        <div className="relative flex h-full w-full items-center">
                          <div className="absolute left-[18%] top-[-80px] text-[2rem] font-semibold leading-none tracking-[-0.06em] text-white sm:left-[20%]">₹</div>
                          <div className="absolute right-[8%] top-[-70px] max-w-[40%] text-right sm:right-[10%]">
                            <p className="truncate text-[0.65rem] font-medium text-white/75">= {usdtAmount} USDT</p>
                          </div>
                          <div className="absolute bottom-[0px] text-right sm:right-[10%]">
                            <p className="text-[0.9rem] font-semibold text-[#9d76ff]">+ {NETWORK_FEE_USDT.toFixed(2)} USDT</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4 flex items-center gap-3 rounded-[0.2rem] border border-white/5 bg-[#171717] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                        <AlertCircle className="h-6 w-6 shrink-0 fill-[#f14336] text-black" />
                        <p className="text-[0.78rem] font-semibold leading-5 text-white/80">
                          Demo mode only. No wallet call, no QR scan, no payment trigger.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleConfirmPay}
                        disabled={isProcessing || !hasValidAmount}
                        className="mb-4 h-14 w-full rounded-2xl bg-[linear-gradient(90deg,#8f63ff_0%,#5a35b0_100%)] text-[1rem] font-semibold tracking-[-0.02em] text-white shadow-[0_10px_30px_rgba(103,69,190,0.35)] transition-transform hover:brightness-110 disabled:opacity-50"
                      >
                        Proceed to Pay
                      </button>
                      <div className="grid grid-cols-3 gap-3">
                        {keypadKeys.map((key) => (
                          <button key={key} type="button" onClick={() => handleKeyPress(key)} aria-label={key === "backspace" ? "Delete" : `Enter ${key}`} className="flex h-[56px] items-center justify-center rounded-2xl bg-[#171717] text-[2rem] font-medium text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:bg-[#1d1d1d]">
                            {key === "backspace" ? <Delete className="h-7 w-7" /> : key}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {screen === "processing" && (
                    <div className="flex flex-1 flex-col items-center justify-center px-4">
                      <Loader2 className="h-16 w-16 animate-spin text-[#8f63ff]" />
                      <h3 className="mt-6 text-xl font-semibold text-white">Processing...</h3>
                      <p className="mt-2 text-center text-sm text-white/60">
                        Fake transition only for UI review
                        <br />
                        no transaction or backend call
                      </p>
                    </div>
                  )}

                  {screen === "scan" && (
                    <div className="flex flex-1 flex-col border-t border-white/6 bg-[radial-gradient(circle_at_center,rgba(94,60,196,0.16)_0%,rgba(17,17,19,0.05)_42%,rgba(0,0,0,0)_72%)] px-5 pb-10 pt-7">
                      <h3 className="pb-4 text-center text-[1.15rem] font-medium tracking-[-0.03em] text-white/95">Scan Merchant QR</h3>
                      <div className="mx-auto mt-1 flex h-[250px] w-full max-w-[290px] items-center justify-center rounded-[1rem] border border-dashed border-white/15 bg-[#08080c]">
                        <div className="text-center">
                          <div className="mx-auto h-16 w-16 opacity-90">
                            <QrGlyph />
                          </div>
                          <p className="mt-4 text-sm text-white/55">Scanner disabled in demo</p>
                        </div>
                      </div>
                      {scanError && (
                        <div className="mx-auto mt-4 max-w-[300px] rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
                          {scanError}
                        </div>
                      )}
                      <div className="mx-auto mt-8 w-full max-w-[300px] space-y-4 text-[0.92rem] font-medium text-white/82">
                        <div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#8f63ff] shadow-[0_0_10px_rgba(143,99,255,0.6)]" /><span>Scan QR from vendor</span></div>
                        <div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#8f63ff] shadow-[0_0_10px_rgba(143,99,255,0.6)]" /><span>Don't back. Amount can't be change</span></div>
                      </div>
                      <div className="mx-auto mt-8 w-full max-w-[300px]">
                        <button
                          type="button"
                          onClick={() => {
                            setScannedUpiId("merchant@upi");
                            setScreen("success");
                          }}
                          className="w-full rounded-2xl border border-[#9f67ff]/35 bg-[#131119] px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#181420]"
                        >
                          Simulate QR Scan Success
                        </button>
                      </div>
                    </div>
                  )}

                  {screen === "success" && (
                    <div className="flex flex-1 flex-col bg-[radial-gradient(circle_at_50%_22%,rgba(166,255,121,0.11)_0%,rgba(22,22,26,0.22)_24%,rgba(0,0,0,0)_54%)] pb-4">
                      <div className="flex flex-1 flex-col">
                        <div className="flex flex-col items-center px-6 pb-6 pt-8">
                          <div className="relative flex h-[126px] w-[126px] items-center justify-center rounded-full border-[4px] border-[#b7ff8e] shadow-[0_0_24px_rgba(183,255,142,0.18)]">
                            <Check className="h-16 w-16 stroke-[4] text-[#d8ffbc]" />
                          </div>
                          <h3 className="pt-6 text-[1.2rem] font-medium tracking-[-0.03em] text-white/95">Payment Completed</h3>
                          <p className="pt-2 text-center text-sm text-white/60">
                            Demo success state for
                            <br />
                            {scannedUpiId}
                          </p>
                        </div>
                        <div className="mx-4 rounded-[0.2rem] border-x border-t border-white/7 bg-[#121216]/90 px-4 py-3 text-center">
                          <p className="text-[1.12rem] font-medium tracking-[-0.03em] text-[#b7e88f]">₹ {Number.parseFloat(displayAmount || "0").toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className="pt-1 text-[0.9rem] font-medium text-white/70">= {usdtAmount} USDT preview</p>
                          <p className="pt-2 text-xs text-white/50">Merchant: {scannedUpiId}</p>
                        </div>
                        <div className="min-h-[100px] flex-1" />
                      </div>
                      <div className="px-4 pb-2 pt-4">
                        <div className="mb-4 flex items-start gap-2.5 rounded-[0.2rem] bg-[#121216]/92 px-4 py-3 text-white/72">
                          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 fill-[#f14336] text-black" />
                          <p className="text-[0.82rem] font-medium leading-5">Ask Merchant to give payment screenshot in group, if needed?</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            className="h-12 rounded-2xl border border-[#9f67ff]/30 bg-[#15121d] text-[0.95rem] font-semibold text-white hover:bg-[#1b1625]"
                          >
                            Ask in Telegram
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setScreen("scan");
                              setScanError("");
                            }}
                            className="h-12 rounded-2xl bg-[linear-gradient(90deg,#8f63ff_0%,#5a35b0_100%)] text-[1rem] font-semibold text-white shadow-[0_10px_30px_rgba(103,69,190,0.3)] hover:brightness-110"
                          >
                            Scan
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
