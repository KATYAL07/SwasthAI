import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import swasthLogo from "../../assets/images/swasth_logo.png";

interface PageTransitionProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const LOADING_MESSAGES = [
  "Initializing Metropolitan Care OS...",
  "Syncing Patient Health Grid...",
  "Routing Clinical Network...",
  "Calibrating Smart Diagnostics...",
  "Loading Care Dashboard...",
];

export function PageTransition({ activeTab, onChangeTab }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const pendingTabRef = useRef<string | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const addTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  };

  const startLoading = (newTab: string) => {
    if (newTab === activeTab) return;
    pendingTabRef.current = newTab;

    clearAllTimeouts();
    setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));
    setIsVisible(true);

    // Swap content after smooth sequence
    addTimeout(() => {
      onChangeTab(pendingTabRef.current!);
      window.scrollTo({ top: 0 });
    }, 700);

    // Fade out sequence
    addTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  useEffect(() => {
    (window as any).cityHealerTransition = startLoading;
    return () => {
      delete (window as any).cityHealerTransition;
    };
  }, [activeTab, onChangeTab]);

  useEffect(() => {
    return clearAllTimeouts;
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="swasthai-bouncing-loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f7f9fb] text-[#191c1e] select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center justify-center max-w-sm w-full px-6">
            {/* Logo Container with exact Stitch bounce-in and perpetual float */}
            <div className="mb-12 relative">
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.175, 0.885, 0.32, 1.275],
                }}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.8,
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* Soft emerald pulse glow */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                    style={{ background: "rgba(16, 185, 129, 0.12)" }}
                  />

                  {/* Exact Stitch SwasthAI Logo */}
                  <img
                    src={swasthLogo}
                    alt="SwasthAI Logo"
                    className="w-48 h-auto object-contain relative z-10 drop-shadow-sm pointer-events-none"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Text & Loading Indicator */}
            <div className="flex flex-col items-center gap-4 w-full">
              <motion.h1
                key={messageIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center tracking-wide font-normal"
                style={{
                  fontFamily: "Sora, Inter, sans-serif",
                  fontSize: "18px",
                  lineHeight: "26px",
                  color: "#565e74",
                  fontWeight: 500,
                }}
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.h1>

              {/* Exact Stitch Scanning/Loading Bar */}
              <div
                className="w-full max-w-[200px] rounded-full overflow-hidden mt-2 relative"
                style={{
                  height: "2.5px",
                  background: "#e6e8ea",
                }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: "35%",
                    background: "#006c49",
                  }}
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{
                    duration: 1.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </div>

              {/* System Boot Tag */}
              <p
                className="mt-6 uppercase tracking-widest"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "11px",
                  lineHeight: "16px",
                  letterSpacing: "0.12em",
                  color: "#6c7a71",
                  fontWeight: 600,
                }}
              >
                System Boot
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageTransition;
