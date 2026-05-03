"use client"

import { useEffect, useState, type ElementType } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import type { AnalysisResult } from "@/app/api/analyze/route"
import {
  Zap, TrendingUp, MessageSquare, Music, Hash, Target,
  ChevronDown, ChevronUp, ArrowLeft, Share2, BarChart2,
  CheckCircle, AlertCircle, Lightbulb, Clock, Flame,
  ThumbsUp, ThumbsDown, Copy, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size / 2) - 12
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? "#a855f7" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444"
  const label = score >= 85 ? "VIRAL 🔥" : score >= 70 ? "HIGH" : score >= 55 ? "MID" : "LOW"

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="oklch(0.18 0.015 285)" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" strokeWidth="10"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-black gradient-text" style={{ fontSize: size * 0.28 }}>{score}</div>
        <div className="text-xs font-bold text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

function MetricBar({ label, score, color = "bg-violet-500" }: { label: string; score: number; color?: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full ${color} score-bar`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function Collapsible({ title, icon: Icon, children, defaultOpen = false, accent }: {
  title: string; icon: ElementType; children: React.ReactNode; defaultOpen?: boolean; accent?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent || "gradient-primary"}`}>
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-semibold">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

function TrendBadge({ trend }: { trend: "rising" | "peak" | "declining" | "stable" }) {
  const map = {
    rising: { label: "Rising 📈", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    peak: { label: "Peak 🔥", cls: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
    declining: { label: "Fading ↘", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
    stable: { label: "Stable →", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  }
  const { label, cls } = map[trend]
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cls}`}>{label}</span>
}

export default function ResultsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const history: AnalysisResult[] = JSON.parse(localStorage.getItem("vs_history") || "[]")
    const found = history.find((r) => r.id === id)
    if (found) {
      setResult(found)
    } else {
      toast.error("Analysis not found")
      router.push("/analyze")
    }
    setLoading(false)
  }, [id, router])

  const copyCaption = () => {
    if (result?.optimizedCaption) {
      navigator.clipboard.writeText(result.optimizedCaption)
      toast.success("Optimized caption copied!")
    }
  }

  const shareResult = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const platformLabel = result.platform.charAt(0).toUpperCase() + result.platform.slice(1)
  const scoreColor = result.overallScore >= 80 ? "text-emerald-400" : result.overallScore >= 60 ? "text-amber-400" : "text-red-400"

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/analyze" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={shareResult} className="gap-1.5 text-sm">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
            <Button size="sm" className="gradient-primary border-0 text-white gap-1.5 text-sm" asChild>
              <Link href="/analyze">
                <RefreshCw className="w-3.5 h-3.5" />
                Re-analyze
              </Link>
            </Button>
          </div>
        </div>

        {/* Score Hero */}
        <div className="relative bg-card border border-border/60 rounded-3xl p-8 mb-6 overflow-hidden gradient-border">
          <div className="absolute inset-0 opacity-5" style={{
            background: "radial-gradient(ellipse at top right, oklch(0.55 0.27 290) 0%, transparent 60%)"
          }} />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Score Ring */}
              <div className="flex flex-col items-center gap-3">
                <ScoreRing score={result.overallScore} size={180} />
                <div className="text-center">
                  <div className={`font-bold text-lg ${scoreColor}`}>{result.scoreLabel}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {platformLabel} · {result.contentType}
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Virality Analysis Report</h1>
                  <p className="text-muted-foreground text-sm">
                    {new Date(result.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    {result.fileName && ` · ${result.fileName}`}
                  </p>
                </div>

                <div className="space-y-3">
                  <MetricBar label="Hook Strength" score={result.hookScore} color="bg-violet-500" />
                  <MetricBar label="Caption Quality" score={result.captionScore} color="bg-pink-500" />
                  <MetricBar label="Thumbnail Appeal" score={result.thumbnailScore} color="bg-amber-500" />
                  <MetricBar label="Pacing" score={result.pacingScore} color="bg-cyan-500" />
                  <MetricBar label="Audio Match" score={result.audioScore} color="bg-emerald-500" />
                </div>
              </div>
            </div>

            {/* Top Insight Banner */}
            <div className="mt-6 p-4 bg-primary/10 border border-primary/25 rounded-2xl flex items-start gap-3">
              <Flame className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-primary mb-0.5">Top Recommendation</div>
                <div className="text-sm text-muted-foreground">{result.topRecommendation}</div>
              </div>
              <div className="ml-auto text-right flex-shrink-0">
                <div className="text-xs text-muted-foreground">Est. reach boost</div>
                <div className="font-bold text-lg gradient-text">{result.estimatedReachMultiplier}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Hook", score: result.hookScore, icon: Zap, color: "text-violet-400" },
            { label: "Caption", score: result.captionScore, icon: MessageSquare, color: "text-pink-400" },
            { label: "Thumbnail", score: result.thumbnailScore, icon: BarChart2, color: "text-amber-400" },
            { label: "Audio", score: result.audioScore, icon: Music, color: "text-cyan-400" },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border/50 rounded-xl p-3 text-center">
              <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
              <div className="text-2xl font-bold">{item.score}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Strengths</span>
            </div>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ThumbsDown className="w-4 h-4 text-red-400" />
              <span className="font-semibold text-red-400">Needs Work</span>
            </div>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4">
          {/* Hook Analysis */}
          <Collapsible title="Hook Analysis — First 3 Seconds" icon={Zap} defaultOpen={true}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl font-black gradient-text">{result.hookScore}/100</div>
                <div className="text-sm text-muted-foreground">
                  {result.hookScore >= 80 ? "🔥 Strong hook" : result.hookScore >= 60 ? "⚡ Decent hook" : "⚠️ Weak hook"}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.hookAnalysis}</p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Action Items</div>
                {result.hookTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-secondary/50 rounded-xl text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </Collapsible>

          {/* Caption Optimizer */}
          <Collapsible title="Caption Optimizer" icon={MessageSquare} defaultOpen={true}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{result.captionAnalysis}</p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Suggestions</div>
                {result.captionSuggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-secondary/50 rounded-xl text-sm">
                    <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    {s}
                  </div>
                ))}
              </div>
              {result.optimizedCaption && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">AI-Optimized Caption</div>
                  <div className="relative p-4 bg-primary/10 border border-primary/25 rounded-xl">
                    <p className="text-sm font-medium pr-8">{result.optimizedCaption}</p>
                    <button
                      onClick={copyCaption}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Click copy to use this optimized caption</p>
                </div>
              )}
            </div>
          </Collapsible>

          {/* Thumbnail & Pacing */}
          <div className="grid md:grid-cols-2 gap-4">
            <Collapsible title="Thumbnail Analysis" icon={BarChart2}>
              <div className="space-y-3">
                <div className="text-2xl font-black gradient-text">{result.thumbnailScore}/100</div>
                <p className="text-sm text-muted-foreground">{result.thumbnailAnalysis}</p>
                <ul className="space-y-1.5">
                  {result.thumbnailTips.map((t, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-400 flex-shrink-0">→</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </Collapsible>

            <Collapsible title="Pacing Analysis" icon={Clock}>
              <div className="space-y-3">
                <div className="text-2xl font-black gradient-text">{result.pacingScore}/100</div>
                <p className="text-sm text-muted-foreground">{result.pacingAnalysis}</p>
              </div>
            </Collapsible>
          </div>

          {/* Trending Audio */}
          <Collapsible title="Trending Audio Recommendations" icon={Music}>
            <div className="space-y-3">
              {result.trendingAudio.map((track, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-lg flex-shrink-0">
                    🎵
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{track.title}</div>
                    <div className="text-xs text-muted-foreground">{track.artist} · {track.useCount} uses</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <TrendBadge trend={track.trend} />
                    <div className="text-xs font-bold text-primary">{track.match}% match</div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Use "Rising" audio for max exposure — it&apos;s before peak competition.
              </p>
            </div>
          </Collapsible>

          {/* Hashtags */}
          <Collapsible title="Hashtag Strategy" icon={Hash}>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {result.suggestedHashtags.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-3 bg-secondary/40 rounded-xl min-w-24">
                    <div className="font-bold text-sm text-primary">{h.tag}</div>
                    <div className="text-xs text-muted-foreground">{h.reach}</div>
                    <TrendBadge trend={h.trend} />
                    <div className="text-xs text-muted-foreground">{h.relevance}% relevance</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Use 3–5 hashtags max. Niche tags outperform mega-tags in 2025 algorithms.
              </p>
            </div>
          </Collapsible>

          {/* Competitor Comparison */}
          <Collapsible title="Competitor Comparison" icon={Target}>
            <div className="space-y-3">
              {result.competitors.map((comp, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-secondary/40 rounded-xl">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comp.creator.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{comp.creator}</div>
                    <div className="text-xs text-muted-foreground">{comp.handle}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 italic">{comp.advantage}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-xl gradient-text">{comp.score}</div>
                    <div className="text-xs text-muted-foreground">{comp.views} views</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Your score: <span className="font-bold text-foreground">{result.overallScore}</span> vs. top competitor:{" "}
                  <span className="font-bold text-foreground">{Math.max(...result.competitors.map((c) => c.score))}</span>
                </p>
              </div>
            </div>
          </Collapsible>
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 rounded-2xl bg-card border border-border/50 text-center space-y-4">
          <h3 className="text-xl font-bold">Ready to fix your score?</h3>
          <p className="text-muted-foreground text-sm">Apply these suggestions, re-upload, and watch your virality score climb.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="gradient-primary border-0 text-white" asChild>
              <Link href="/analyze">
                <Zap className="w-4 h-4 mr-2" />
                Analyze New Content
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <BarChart2 className="w-4 h-4 mr-2" />
                View History
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
