"use client"

import { useEffect, useState, type ElementType } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import type { AnalysisResult } from "@/app/api/analyze/route"
import {
  Zap, History, TrendingUp, BarChart2, Trash2, ArrowRight,
  Clock, Flame, Video, Image, FileText
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const PLATFORM_EMOJIS: Record<string, string> = {
  tiktok: "🎵",
  instagram: "📸",
  youtube: "▶️",
  twitter: "𝕏",
  linkedin: "💼",
}

const CONTENT_ICONS: Record<string, ElementType> = {
  video: Video,
  image: Image,
  caption: FileText,
}

function ScoreChip({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    : score >= 60 ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
    : "bg-red-500/15 text-red-400 border-red-500/30"
  return (
    <span className={`text-sm font-bold px-2.5 py-1 rounded-full border ${color}`}>
      {score}
    </span>
  )
}

export default function DashboardPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vs_history") || "[]")
    setHistory(stored)
    setLoading(false)
  }, [])

  const deleteItem = (id: string) => {
    const updated = history.filter((r) => r.id !== id)
    setHistory(updated)
    localStorage.setItem("vs_history", JSON.stringify(updated))
    toast.success("Analysis removed")
  }

  const clearAll = () => {
    setHistory([])
    localStorage.removeItem("vs_history")
    toast.success("History cleared")
  }

  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + b.overallScore, 0) / history.length)
    : 0

  const bestScore = history.length ? Math.max(...history.map((r) => r.overallScore)) : 0
  const viralCount = history.filter((r) => r.overallScore >= 80).length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-primary" />
              <h1 className="text-3xl font-bold">Analysis History</h1>
            </div>
            <p className="text-muted-foreground">Track your content virality over time</p>
          </div>
          <Button className="gradient-primary border-0 text-white" asChild>
            <Link href="/analyze">
              <Zap className="w-4 h-4 mr-2" />
              New Analysis
            </Link>
          </Button>
        </div>

        {history.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border/50 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black gradient-text">{avgScore}</div>
                <div className="text-sm text-muted-foreground mt-1">Avg Score</div>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black gradient-text">{bestScore}</div>
                <div className="text-sm text-muted-foreground mt-1">Best Score</div>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-pink-400">{viralCount}</div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  Viral Posts
                </div>
              </div>
            </div>

            {/* Trend visualization - simple bar chart */}
            {history.length >= 2 && (
              <div className="bg-card border border-border/50 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Score Trend</span>
                </div>
                <div className="flex items-end gap-2 h-16">
                  {history.slice(0, 10).reverse().map((r, i) => (
                    <div key={r.id} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          height: `${(r.overallScore / 100) * 52}px`,
                          background: r.overallScore >= 80
                            ? "linear-gradient(to top, #8b5cf6, #ec4899)"
                            : r.overallScore >= 60
                            ? "linear-gradient(to top, #f59e0b, #f97316)"
                            : "#ef4444",
                          opacity: 0.7 + (i / history.length) * 0.3,
                        }}
                      />
                      <div className="text-xs text-muted-foreground">{r.overallScore}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* History List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto animate-float">
              <BarChart2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">No analyses yet</h2>
              <p className="text-muted-foreground">Upload your first piece of content to see your virality score.</p>
            </div>
            <Button className="gradient-primary border-0 text-white" size="lg" asChild>
              <Link href="/analyze">
                <Zap className="w-4 h-4 mr-2" />
                Analyze Your First Content
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">{history.length} analyses</div>
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear all
              </button>
            </div>

            {history.map((item) => {
              const ContentIcon = CONTENT_ICONS[item.contentType] || FileText
              return (
                <Link key={item.id} href={`/results/${item.id}`}>
                  <div className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/40 transition-all hover:bg-secondary/20 group card-hover cursor-pointer">
                    <div className="flex items-center gap-4">
                      {/* Platform + type */}
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-xl flex-shrink-0">
                        {PLATFORM_EMOJIS[item.platform] || "📊"}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold capitalize text-sm">{item.platform}</span>
                          <ContentIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground capitalize">{item.contentType}</span>
                        </div>
                        {item.caption ? (
                          <p className="text-xs text-muted-foreground truncate">{item.caption.slice(0, 80)}{item.caption.length > 80 ? "..." : ""}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">{item.fileName || "No caption"}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground/60" />
                          <span className="text-xs text-muted-foreground/60">
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {/* Score + CTA */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <ScoreChip score={item.overallScore} />
                          <div className="text-xs text-muted-foreground mt-0.5">{item.scoreLabel}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
