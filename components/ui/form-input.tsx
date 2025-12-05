"use client"

import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={cn(
                            "w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10",
                            "text-white placeholder:text-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                            "transition-all duration-200",
                            "hover:bg-white/10",
                            icon && "pl-12",
                            error && "border-red-500/50 focus:ring-red-500/50",
                            className
                        )}
                        {...props}
                    />
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white pointer-events-none z-10">
                            {icon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-400">{error}</p>
                )}
            </div>
        )
    }
)

FormInput.displayName = "FormInput"

export default FormInput
