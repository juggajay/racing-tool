"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  label?: string
  helperText?: string
  onFileChange?: (file: File | null) => void
  accept?: string
  id?: string
  className?: string
  [key: string]: any // Allow any other props to be passed through
}

export function FileUpload({
  label,
  helperText,
  onFileChange,
  accept,
  id,
  className,
  ...props
}: FileUploadProps) {
  const [fileName, setFileName] = React.useState<string>("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file?.name || "")
    if (onFileChange) {
      onFileChange(file)
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>Choose File</span>
          </Button>
          <span className="text-sm opacity-70">
            {fileName || "No file selected"}
          </span>
        </div>
        <Input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          id={id}
          {...props}
        />
      </div>
      {helperText && <p className="text-xs opacity-70">{helperText}</p>}
    </div>
  )
}