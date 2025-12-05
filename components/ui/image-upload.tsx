"use client"

import { useCallback, useState } from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    value?: string
    onChange: (file: File | null) => void
    error?: string
}

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFile = useCallback((file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            onChange(file)
        }
    }, [onChange])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }, [handleFile])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }, [handleFile])

    const handleRemove = useCallback(() => {
        setPreview(null)
        onChange(null)
    }, [onChange])

    return (
        <div className="w-full flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-300 mb-4">
                Profile Picture
            </label>

            <div
                onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "relative flex flex-col items-center justify-center",
                    "w-40 h-40 rounded-full border-2 border-dashed",
                    "bg-white/5 backdrop-blur-sm transition-all duration-200",
                    isDragging ? "border-primary bg-primary/10" : "border-white/20",
                    error && "border-red-500/50",
                    "hover:bg-white/10 cursor-pointer"
                )}
            >
                {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full rounded-full object-cover border-4 border-primary/30"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X size={18} className="text-white" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <Upload size={36} className="text-gray-400 mb-2" />
                        <p className="text-xs text-gray-300 mb-1 text-center px-2">
                            Upload Photo
                        </p>
                        <p className="text-[10px] text-gray-500 text-center px-2">
                            PNG, JPG, GIF
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    )
}
