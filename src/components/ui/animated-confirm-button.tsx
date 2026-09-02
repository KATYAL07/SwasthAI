import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AnimatedConfirmButtonProps {
    onComplete?: () => void | Promise<void>;
    initialText: React.ReactNode;
    finalText?: React.ReactNode;
    /**
     * Direction A: routine actions fire on the first click. The three-step walk is kept
     * only where an action reaches the physical world and cannot be taken back — pass
     * confirm to opt back into it.
     */
    confirm?: boolean;
}

const AnimatedConfirmButton = ({ onComplete, initialText, finalText = "Finish", confirm = false }: AnimatedConfirmButtonProps) => {
    const finalStep = confirm ? 3 : 1;
    const [step, setStep] = useState(1)
    const [isExpanded, setIsExpanded] = useState(true)
    // Step 3 stays clickable, so without this guard every extra click re-fires the
    // action and writes a duplicate row (two OPD tokens, two identical appointments).
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleContinue = async (e: React.MouseEvent) => {
        if (isSubmitting) {
            e.preventDefault();
            return;
        }
        if (step < finalStep) {
            e.preventDefault();
            setStep(step + 1)
            setIsExpanded(false)
        } else if (step === finalStep) {
            if (onComplete) {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                    await onComplete();
                } finally {
                    // Rewind to the initial state so a repeat action needs three
                    // deliberate clicks again rather than one stray double-click.
                    setIsSubmitting(false);
                    setStep(1);
                    setIsExpanded(true);
                }
            }
        }
    }

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        if (step == 2) {
            setIsExpanded(true)
        }
        if (step > 1) {
            setStep(step - 1)
        }
    }

    return (
        <div className={cn("flex flex-col items-center justify-center w-full", confirm ? "gap-4" : "gap-0")}>
            <div className={cn("items-center gap-6 relative", confirm ? "flex" : "hidden")}>
                {(confirm ? [1, 2, 3] : []).map((dot) => (
                    <div
                        key={dot}
                        className={cn(
                            "w-2 h-2 rounded-full relative z-10",
                            dot <= step ? "bg-white border border-gray-400" : "bg-gray-300"
                        )}
                        style={dot <= step ? { backgroundColor: 'white' } : {}}
                    />
                ))}
                {/* Green progress overlay */}
                <motion.div
                    initial={{ width: '12px', height: "24px", x: 0 }}
                    animate={{
                        width: !confirm ? '0px' : step === 1 ? '24px' : step === 2 ? '60px' : '96px',
                        x: 0
                    }}
                    className="absolute -left-[8px] top-1/2 -translate-y-1/2 bg-green-500 rounded-full z-0"
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        mass: 0.8,
                        bounce: 0.25,
                        duration: 0.6
                    }}
                />
            </div>

            {/* Buttons container */}
            <div className="w-full max-w-sm">
                <motion.div
                    className="flex items-center gap-1"
                    animate={{
                        justifyContent: isExpanded ? 'stretch' : 'space-between'
                    }}
                >
                    {!isExpanded && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, width: 0, scale: 0.8 }}
                            animate={{ opacity: 1, width: "64px", scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 15,
                                mass: 0.8,
                                bounce: 0.25,
                                duration: 0.6,
                                opacity: { duration: 0.2 }
                            }}
                            onClick={handleBack}
                            className="px-4 py-3 text-black flex items-center justify-center bg-gray-100 font-semibold rounded-full hover:bg-gray-200 transition-colors flex-1 w-16 text-sm"
                        >
                            Back
                        </motion.button>
                    )}
                    <motion.button
                        type={step === finalStep ? "submit" : "button"}
                        onClick={handleContinue}
                        disabled={isSubmitting}
                        animate={{
                            flex: isExpanded ? 1 : 'inherit',
                        }}
                        className={cn(
                            "px-4 py-3 rounded-full text-white bg-[#006cff] transition-colors flex-1 w-full sm:w-56",
                            !isExpanded && 'w-44',
                            isSubmitting && 'opacity-60 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-center font-[600] justify-center gap-2 text-sm">
                            {step === 3 && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 15,
                                        mass: 0.5,
                                        bounce: 0.4
                                    }}
                                >
                                    <CircleCheck size={16} />
                                </motion.div>
                            )}
                            {step === 3 ? finalText : initialText}
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}

export default AnimatedConfirmButton;
