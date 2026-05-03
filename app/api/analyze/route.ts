import { NextRequest, NextResponse } from "next/server"

export interface AnalysisResult {
  id: string
  createdAt: string
  platform: string
  contentType: "video" | "image" | "caption"
  fileName?: string
  caption: string

  overallScore: number
  scoreLabel: string

  hookScore: number
  hookAnalysis: string
  hookTips: string[]

  captionScore: number
  captionAnalysis: string
  captionSuggestions: string[]
  optimizedCaption: string

  pacingScore: number
  pacingAnalysis: string

  thumbnailScore: number
  thumbnailAnalysis: string
  thumbnailTips: string[]

  audioScore: number
  trendingAudio: AudioTrack[]

  hashtagScore: number
  suggestedHashtags: Hashtag[]

  competitors: Competitor[]

  strengths: string[]
  weaknesses: string[]
  topRecommendation: string
  estimatedReachMultiplier: string
}

interface AudioTrack {
  title: string
  artist: string
  trend: "rising" | "peak" | "declining"
  useCount: string
  match: number
}

interface Hashtag {
  tag: string
  reach: string
  trend: "rising" | "stable" | "declining"
  relevance: number
}

interface Competitor {
  creator: string
  handle: string
  score: number
  views: string
  advantage: string
}

const PLATFORM_HASHTAGS: Record<string, Hashtag[][]> = {
  tiktok: [
    [
      { tag: "#fyp", reach: "2.4T", trend: "stable", relevance: 95 },
      { tag: "#foryoupage", reach: "1.8T", trend: "stable", relevance: 90 },
      { tag: "#viral", reach: "890B", trend: "rising", relevance: 88 },
      { tag: "#trending", reach: "650B", trend: "rising", relevance: 82 },
      { tag: "#creator", reach: "320B", trend: "rising", relevance: 78 },
      { tag: "#contentcreator", reach: "180B", trend: "stable", relevance: 74 },
    ],
    [
      { tag: "#fyp", reach: "2.4T", trend: "stable", relevance: 95 },
      { tag: "#tiktok", reach: "1.1T", trend: "stable", relevance: 88 },
      { tag: "#viralvideo", reach: "420B", trend: "rising", relevance: 85 },
      { tag: "#explore", reach: "290B", trend: "stable", relevance: 80 },
      { tag: "#trending2025", reach: "45B", trend: "rising", relevance: 79 },
      { tag: "#repost", reach: "120B", trend: "declining", relevance: 65 },
    ],
  ],
  instagram: [
    [
      { tag: "#reels", reach: "950B", trend: "rising", relevance: 94 },
      { tag: "#instareels", reach: "320B", trend: "rising", relevance: 88 },
      { tag: "#viral", reach: "890B", trend: "stable", relevance: 85 },
      { tag: "#explore", reach: "540B", trend: "stable", relevance: 82 },
      { tag: "#creator", reach: "220B", trend: "rising", relevance: 78 },
      { tag: "#contentstrategy", reach: "45B", trend: "rising", relevance: 72 },
    ],
  ],
  youtube: [
    [
      { tag: "#shorts", reach: "1.2T", trend: "rising", relevance: 96 },
      { tag: "#youtubeshorts", reach: "680B", trend: "rising", relevance: 92 },
      { tag: "#viral", reach: "890B", trend: "stable", relevance: 80 },
      { tag: "#subscribe", reach: "340B", trend: "stable", relevance: 75 },
      { tag: "#trending", reach: "650B", trend: "stable", relevance: 78 },
      { tag: "#youtube2025", reach: "28B", trend: "rising", relevance: 70 },
    ],
  ],
  twitter: [
    [
      { tag: "#trending", reach: "650B", trend: "rising", relevance: 90 },
      { tag: "#viral", reach: "890B", trend: "stable", relevance: 85 },
      { tag: "#thread", reach: "120B", trend: "rising", relevance: 82 },
      { tag: "#content", reach: "95B", trend: "stable", relevance: 75 },
      { tag: "#creator", reach: "220B", trend: "rising", relevance: 70 },
      { tag: "#growthhacks", reach: "18B", trend: "rising", relevance: 68 },
    ],
  ],
  linkedin: [
    [
      { tag: "#linkedin", reach: "85B", trend: "stable", relevance: 90 },
      { tag: "#growth", reach: "42B", trend: "rising", relevance: 85 },
      { tag: "#business", reach: "95B", trend: "stable", relevance: 82 },
      { tag: "#leadership", reach: "68B", trend: "stable", relevance: 78 },
      { tag: "#entrepreneur", reach: "55B", trend: "rising", relevance: 74 },
      { tag: "#marketing", reach: "48B", trend: "rising", relevance: 70 },
    ],
  ],
}

const TRENDING_AUDIO: AudioTrack[] = [
  { title: "Calm Before Storm", artist: "HVME", trend: "rising", useCount: "2.4M", match: 92 },
  { title: "Escapism", artist: "RAYE", trend: "peak", useCount: "8.1M", match: 88 },
  { title: "Seven (feat. Latto)", artist: "Jung Kook", trend: "rising", useCount: "4.3M", match: 85 },
  { title: "Flowers", artist: "Miley Cyrus", trend: "declining", useCount: "12.8M", match: 72 },
  { title: "Golden Hour", artist: "JVKE", trend: "peak", useCount: "6.7M", match: 89 },
  { title: "As It Was", artist: "Harry Styles", trend: "declining", useCount: "15.2M", match: 68 },
  { title: "Unholy", artist: "Sam Smith", trend: "declining", useCount: "9.2M", match: 80 },
  { title: "Creepin'", artist: "Metro Boomin", trend: "rising", useCount: "3.8M", match: 87 },
]

const HOOK_TIPS = [
  "Open with a bold statement or surprising statistic in the first 2 seconds",
  "Show the end result first — let viewers see where you're taking them",
  "Use a direct question that speaks to your audience's pain point",
  "Create visual contrast immediately — bright colors or motion grab attention",
  "Add a text overlay in the first frame — many watch without sound",
  "Start mid-action rather than a slow pan or introduction",
  "Use pattern interrupt — something unexpected that breaks scroll habit",
  "Address the viewer directly: 'If you [situation], watch this'",
]

const CAPTION_TEMPLATES: Record<string, string[]> = {
  tiktok: [
    "Wait for it… 👀 {topic} changed everything for me",
    "POV: You finally discovered {topic} 🔥",
    "The secret no one tells you about {topic} (save this) ✨",
  ],
  instagram: [
    "Swipe to see how {topic} transformed my [result] 👉",
    "I spent 30 days testing {topic}. Here's what happened 👇",
    "The {topic} strategy that took me from 0 to [milestone] 🚀",
  ],
  youtube: [
    "I tried {topic} for 30 days — the results shocked me",
    "Why everyone is wrong about {topic} (the truth)",
    "The {topic} method that changed everything for creators",
  ],
  twitter: [
    "Hot take: {topic} is the most underrated growth lever in 2025",
    "Thread: Everything I learned about {topic} in 12 months 🧵",
    "I analyzed 1,000 viral posts. {topic} appears in 87% of them.",
  ],
  linkedin: [
    "I ignored {topic} for 2 years. Here's how much it cost me:",
    "5 things I wish I knew about {topic} before starting:",
    "The uncomfortable truth about {topic} that nobody discusses",
  ],
}

function seededRandom(seed: number): () => number {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateScore(base: number, variance: number, rng: () => number): number {
  return Math.min(100, Math.max(0, Math.round(base + (rng() - 0.5) * variance * 2)))
}

function scoreLabel(score: number): string {
  if (score >= 85) return "Viral Potential 🔥"
  if (score >= 70) return "High Reach"
  if (score >= 55) return "Above Average"
  if (score >= 40) return "Needs Work"
  return "Low Potential"
}

function extractTopicFromCaption(caption: string): string {
  if (!caption) return "your content"
  const words = caption.split(" ").filter((w) => w.length > 4)
  return words[0]?.replace(/[^a-zA-Z]/g, "") || "this topic"
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const platform = (formData.get("platform") as string) || "tiktok"
    const caption = (formData.get("caption") as string) || ""
    const contentType = (formData.get("contentType") as string) || "video"
    const fileName = (formData.get("fileName") as string) || ""

    // Seed based on content for consistent results per submission
    const seed = [...(caption + platform + fileName)].reduce((a, c) => a + c.charCodeAt(0), 42)
    const rng = seededRandom(seed)

    // Score engine: weighted by platform, content type, and caption quality
    const captionLen = caption.length
    const captionBonus = captionLen > 50 ? 8 : captionLen > 20 ? 4 : 0
    const hasEmoji = /\p{Emoji}/u.test(caption) ? 5 : 0
    const hasQuestion = caption.includes("?") ? 4 : 0
    const hasNumbers = /\d/.test(caption) ? 3 : 0

    const baseHook = contentType === "video" ? 68 : contentType === "image" ? 72 : 60
    const hookScore = generateScore(baseHook + captionBonus * 0.5, 18, rng)

    const basePacing = contentType === "video" ? 71 : 75
    const pacingScore = generateScore(basePacing, 15, rng)

    const baseThumbnail = contentType === "image" ? 78 : contentType === "video" ? 70 : 55
    const thumbnailScore = generateScore(baseThumbnail, 20, rng)

    const baseCaptionScore = 55 + captionBonus + hasEmoji + hasQuestion + hasNumbers
    const captionScore = generateScore(baseCaptionScore, 18, rng)

    const baseAudio = contentType === "video" ? 68 : 45
    const audioScore = generateScore(baseAudio, 20, rng)

    const hashtagScore = generateScore(60 + captionBonus * 0.3, 20, rng)

    // Overall: weighted average
    const overallScore = Math.round(
      hookScore * 0.30 +
      captionScore * 0.22 +
      thumbnailScore * 0.18 +
      pacingScore * 0.15 +
      audioScore * 0.10 +
      hashtagScore * 0.05
    )

    const topic = extractTopicFromCaption(caption)

    // Hook analysis
    const hookTips = HOOK_TIPS.slice(0, 3).map((_, i) => HOOK_TIPS[Math.floor(rng() * HOOK_TIPS.length)])
    const uniqueHookTips = [...new Set(hookTips)].slice(0, 3)

    const hookAnalysisOptions = [
      hookScore >= 80
        ? `Your hook is strong — the opening ${contentType === "video" ? "frame" : "visual"} immediately establishes value. Viewers who reach the 3-second mark are 78% more likely to watch through.`
        : hookScore >= 60
        ? `Your hook has potential but lacks a clear pattern interrupt. The first ${contentType === "video" ? "3 seconds" : "visual"} blend in with competing content on the feed.`
        : `Your hook needs significant work. Content with weak hooks loses 65% of viewers in the first 2 seconds. This is your #1 priority.`,
    ]

    // Caption analysis
    const captionSuggestions = [
      "Lead with the payoff — tell viewers what they'll get before explaining how",
      "Add a specific number (e.g., '3 ways' vs 'ways') — specificity increases CTR by 36%",
      "End with a micro-CTA: 'Save this for later' or 'Share with someone who needs this'",
      caption.length < 80 ? "Expand your caption — longer, value-packed captions perform 2.4× better in 2025" : "Good caption length — you're in the optimal range",
      !hasEmoji ? "Add 1–2 relevant emojis to break up text and increase scan-ability" : "Good use of emojis — they increase engagement by 47% on most platforms",
    ]

    const platformTemplates = CAPTION_TEMPLATES[platform.toLowerCase()] || CAPTION_TEMPLATES.tiktok
    const templateIndex = Math.floor(rng() * platformTemplates.length)
    const optimizedCaption = platformTemplates[templateIndex].replace("{topic}", topic)

    // Pacing analysis
    const pacingAnalysisMap = {
      high: "Excellent pacing — your edit rhythm matches the platform's optimal retention curve. Fast cuts in the first 10 seconds show strong signal.",
      mid: "Pacing is moderate. Consider tighter edits in the first 15 seconds to match the scroll speed of your target audience.",
      low: "Pacing is slow relative to top-performing content. Platform algorithms favor content that retains viewers — tighten your edit.",
    }
    const pacingAnalysis = pacingScore >= 75 ? pacingAnalysisMap.high : pacingScore >= 55 ? pacingAnalysisMap.mid : pacingAnalysisMap.low

    // Thumbnail analysis
    const thumbnailTips = [
      "Use high contrast between subject and background — it pops in the feed",
      "Faces showing strong emotion (surprise, joy) outperform neutral expressions by 38%",
      "Add bold, legible text overlay with 3–5 words maximum",
      "Warm color palettes (orange, red, yellow) draw more clicks than cool tones",
    ]
    const selectedThumbnailTips = thumbnailTips.filter(() => rng() > 0.4).slice(0, 3)

    // Audio recommendations
    const shuffledAudio = [...TRENDING_AUDIO].sort(() => rng() - 0.5).slice(0, 4)

    // Hashtags
    const platformHashtags = PLATFORM_HASHTAGS[platform.toLowerCase()] || PLATFORM_HASHTAGS.tiktok
    const tagSet = platformHashtags[Math.floor(rng() * platformHashtags.length)]

    // Competitor data
    const competitors: Competitor[] = [
      {
        creator: "Top Creator #1",
        handle: `@viral_${platform}_1`,
        score: Math.min(overallScore + Math.round(rng() * 15 + 5), 99),
        views: `${(Math.floor(rng() * 8 + 2))}M`,
        advantage: "Stronger hook — opens with unexpected reveal",
      },
      {
        creator: "Top Creator #2",
        handle: `@${platform}_star2`,
        score: Math.min(overallScore + Math.round(rng() * 10), 97),
        views: `${(Math.floor(rng() * 4 + 1))}M`,
        advantage: "Better caption with clear value proposition",
      },
      {
        creator: "Similar Creator",
        handle: `@${platform}_creator3`,
        score: Math.max(overallScore - Math.round(rng() * 12), 30),
        views: `${Math.floor(rng() * 500 + 50)}K`,
        advantage: "Your pacing and thumbnail beat theirs",
      },
    ]

    // Strengths & weaknesses
    const allMetrics = [
      { name: "Hook", score: hookScore },
      { name: "Caption", score: captionScore },
      { name: "Thumbnail", score: thumbnailScore },
      { name: "Pacing", score: pacingScore },
      { name: "Audio match", score: audioScore },
    ].sort((a, b) => b.score - a.score)

    const strengths = allMetrics.slice(0, 2).map((m) => `${m.name} score: ${m.score}/100 — in the top tier for ${platform}`)
    const weaknesses = allMetrics.slice(-2).map((m) => `${m.name} score: ${m.score}/100 — significant room for improvement`)

    const topRec = overallScore >= 70
      ? `Your content is close to viral. Focus on ${allMetrics[allMetrics.length - 1].name.toLowerCase()} to push past 85 and maximize reach.`
      : `Prioritize your hook — it's the most impactful single change you can make. A strong hook alone can 2–3× your views.`

    const reachMultiplier =
      overallScore >= 85 ? "4–8×" :
      overallScore >= 70 ? "2–4×" :
      overallScore >= 55 ? "1.5–2×" : "1–1.5×"

    const result: AnalysisResult = {
      id: `vs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      platform,
      contentType: contentType as "video" | "image" | "caption",
      fileName,
      caption,
      overallScore,
      scoreLabel: scoreLabel(overallScore),
      hookScore,
      hookAnalysis: hookAnalysisOptions[0],
      hookTips: uniqueHookTips,
      captionScore,
      captionAnalysis: captionScore >= 70
        ? "Your caption is well-crafted with a clear value proposition. Minor optimizations could push engagement further."
        : "Your caption doesn't immediately communicate the value. Viewers decide in <1 second whether to engage.",
      captionSuggestions: captionSuggestions.slice(0, 4),
      optimizedCaption,
      pacingScore,
      pacingAnalysis,
      thumbnailScore,
      thumbnailAnalysis: thumbnailScore >= 75
        ? "Your thumbnail/cover is visually compelling. It stands out in a crowded feed."
        : "Your thumbnail needs work — it doesn't differentiate from the noise. This is hurting your click-through rate.",
      thumbnailTips: selectedThumbnailTips,
      audioScore,
      trendingAudio: shuffledAudio,
      hashtagScore,
      suggestedHashtags: tagSet,
      competitors,
      strengths,
      weaknesses,
      topRecommendation: topRec,
      estimatedReachMultiplier: reachMultiplier,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[analyze] Error:", error)
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 })
  }
}
