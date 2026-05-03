"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  Upload, Video, Image, FileText, Zap, X, CheckCircle
} from "lucide-react"
import { toast } from "sonner"

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", emoji: "🎵", color: "hover:border-white/60" },
  { id: "instagram", label: "Instagram", emoji: "📸", color: "hover:border-pink-500/60" },
  { id: "youtube", label: "YouTube", emoji: "▶️", color: "hover:border-red-500/60" },
  { id: "twitter", label: "Twitter / X", emoji: "𝕏", color: "hover:border-sky-500/60" },
  { id: "linkedin", label: "LinkedIn", emoji: "💼", color: "hover:border-blue-500/60" },
]

const CONTENT_TYPES = [
  { id: "video", label: "Video", icon: Video, accept: "video/*", desc: "MP4, MOV, WebM" },
  { id: "image", label: "Image", icon: Image, accept: "image/*", desc: "JPG, PNG, WebP" },
  { id: "caption", label: "Caption Only", icon: FileText, accept: "", desc: "Text analysis" },
]

export default function AnalyzePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [platform, setPlatform] = useState("tiktok")
  const [contentType, setContentType] = useState("video")
  const [caption, setCaption] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState("")

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFileSelect(dropped)
  }, [])

  const handleFileSelect = (f: File) => {
    const isVideo = f.type.startsWith("video/")
    const isImage = f.type.startsWith("image/")
    if (isVideo) setContentType("video")
    else if (isImage) setContentType("image")
    setFile(f)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const runAnalysis = async () => {
    if (contentType !== "caption" && !file) {
      toast.error("Please upload a file or switch to Caption Only mode")
      return
    }
    if (!caption && contentType === "caption") {
      toast.error("Please enter a caption to analyze")
      return
    }

    setIsAnalyzing(true)
    setProgress(0)

    const steps = [
      { label: "Scanning content...", pct: 15 },
      { label: "Analyzing hook strength...", pct: 30 },
      { label: "Evaluating caption quality...", pct: 48 },
      { label: "Checking trending audio...", pct: 62 },
      { label: "Comparing competitors...", pct: 75 },
      { label: "Generating hashtag map...", pct: 88 },
      { label: "Calculating virality score...", pct: 96 },
    ]

    for (const step of steps) {
      setProgressLabel(step.label)
      setProgress(step.pct)
      await new Promise((r) => setTimeout(r, 320 + Math.random() * 200))
    }

    try {
      const formData = new FormData()
      formData.append("platform", platform)
      formData.append("caption", caption)
      formData.append("contentType", contentType)
      formData.append("fileName", file?.name || "")
      if (file) formData.append("file", file)

      const res = await fetch("/api/analyze", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Analysis failed")
      const result = await res.json()

      // Store in localStorage for the results page
      const history = JSON.parse(localStorage.getItem("vs_history") || "[]")
      history.unshift(result)
      localStorage.setItem("vs_history", JSON.stringify(history.slice(0, 20)))

      setProgress(100)
      setProgressLabel("Complete!")
      await new Promise((r) => setTimeout(r, 400))

      router.push(`/results/${result.id}`)
    } catch (err) {
      toast.error("Analysis failed. Please try again.")
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const selectedPlatform = PLATFORMS.find((p) => p.id === platform)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            AI Virality Analysis
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Analyze Your <span className="gradient-text">Content</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your content and get a detailed virality score in 30 seconds.
          </p>
        </div>

        {/* Step 1: Platform */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-white font-bold">1</div>
            <h2 className="font-semibold text-lg">Choose Platform</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  platform === p.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                }`}
              >
                <div className="text-xl mb-1">{p.emoji}</div>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Content Type */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-white font-bold">2</div>
            <h2 className="font-semibold text-lg">Content Type</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => { setContentType(ct.id); setFile(null) }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  contentType === ct.id
                    ? "border-primary bg-primary/15"
                    : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                }`}
              >
                <ct.icon className={`w-6 h-6 mx-auto mb-2 ${contentType === ct.id ? "text-primary" : "text-muted-foreground"}`} />
                <div className={`font-medium text-sm ${contentType === ct.id ? "text-primary" : ""}`}>{ct.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{ct.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Upload */}
        {contentType !== "caption" && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-white font-bold">3</div>
              <h2 className="font-semibold text-lg">Upload File</h2>
            </div>

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  dragging
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragging ? "gradient-primary" : "bg-secondary"}`}>
                    <Upload className={`w-7 h-7 ${dragging ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {dragging ? "Drop it here!" : "Drag & drop your file"}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      or click to browse · {CONTENT_TYPES.find((c) => c.id === contentType)?.desc}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    Max file size: 500MB
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={CONTENT_TYPES.find((c) => c.id === contentType)?.accept}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFileSelect(f)
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  {contentType === "video" ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <Image className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Caption */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-white font-bold">
              {contentType !== "caption" ? "4" : "3"}
            </div>
            <h2 className="font-semibold text-lg">Caption / Description</h2>
            {contentType !== "caption" && (
              <span className="text-xs text-muted-foreground ml-1">(optional but recommended)</span>
            )}
          </div>
          <div className="relative">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`Write your ${selectedPlatform?.label} caption here...\n\nExample: "POV: You've been doing this wrong for years 😱 #fyp #tips"`}
              rows={5}
              className="w-full p-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-sm leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {caption.length} chars
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Has strong hook", "Clear value prop", "Trending topic", "Includes CTA"].map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                {caption.toLowerCase().includes(tag.split(" ")[1]?.toLowerCase() || "") ? "✓ " : "○ "}{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={runAnalysis}
          disabled={isAnalyzing || (contentType !== "caption" && !file)}
          className="w-full gradient-primary border-0 text-white py-6 text-lg font-semibold rounded-xl glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-1 w-full">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {progressLabel}
              </div>
              <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Analyze Virality Score
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Free analysis · No credit card · Results in ~30 seconds
        </p>
      </div>
    </div>
  )
}
