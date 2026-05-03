import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Zap, TrendingUp, Eye, MessageSquare, Music, Hash,
  BarChart3, Target, ArrowRight, Star, Users, Award,
  Video, Image, FileText, ChevronRight, Flame
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "Hook Strength Analysis",
      description: "AI dissects your first 3 seconds — the make-or-break window that determines if viewers stay or scroll.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: BarChart3,
      title: "Virality Score 0–100",
      description: "A single, powerful score backed by 50+ engagement signals trained on millions of viral posts.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: MessageSquare,
      title: "Caption Optimizer",
      description: "Rewrite suggestions that maximize CTR, emotional resonance, and platform-specific algorithms.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Hash,
      title: "Trending Hashtags",
      description: "Real-time hashtag intelligence. Get tags that are rising now — not the ones that peaked last month.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Music,
      title: "Audio Recommendations",
      description: "Match your content to trending sounds before they peak. Riding audio waves = 3–8× more reach.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      title: "Competitor Comparison",
      description: "See how your content stacks up against top creators in your niche. Know exactly what you're up against.",
      color: "from-fuchsia-500 to-pink-500",
    },
  ]

  const platforms = [
    { name: "TikTok", color: "#010101", emoji: "🎵" },
    { name: "Instagram", color: "#E1306C", emoji: "📸" },
    { name: "YouTube", color: "#FF0000", emoji: "▶️" },
    { name: "Twitter/X", color: "#1DA1F2", emoji: "𝕏" },
    { name: "LinkedIn", color: "#0A66C2", emoji: "💼" },
  ]

  const stats = [
    { value: "59M+", label: "Views analyzed" },
    { value: "94%", label: "Accuracy rate" },
    { value: "3.2×", label: "Avg reach boost" },
    { value: "12K+", label: "Creators trust us" },
  ]

  const steps = [
    { icon: Video, step: "01", title: "Upload Content", desc: "Drop your video, image, or paste your caption." },
    { icon: Zap, step: "02", title: "AI Analysis", desc: "Our model scores 50+ virality signals in seconds." },
    { icon: TrendingUp, step: "03", title: "Get Your Score", desc: "Receive a detailed breakdown with actionable edits." },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center grid-pattern">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, oklch(0.55 0.27 290) 0%, transparent 70%)" }} />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
              <Flame className="w-4 h-4" />
              <span>59M+ pieces of content analyzed</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Will your content
              <br />
              <span className="gradient-text text-glow">go viral?</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Upload your video or post and let AI score its viral potential,
              explain what works, and give you{" "}
              <span className="text-foreground font-medium">specific edits</span> to maximize reach.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button size="lg" className="gradient-primary border-0 text-white px-8 py-6 text-lg font-semibold rounded-xl glow-primary" asChild>
                <Link href="/analyze">
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze My Content — Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-border/60 hover:bg-secondary rounded-xl" asChild>
                <Link href="/upgrade">
                  See Pricing
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Platform chips */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <span className="text-sm text-muted-foreground mr-1">Works with:</span>
              {platforms.map((p) => (
                <span key={p.name} className="text-sm px-3 py-1 rounded-full bg-secondary border border-border/50 text-muted-foreground">
                  {p.emoji} {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Eye className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="text-4xl font-bold mb-4">From upload to insight in{" "}
              <span className="gradient-text">30 seconds</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="relative z-10 text-center space-y-4">
                  <div className="inline-flex w-16 h-16 rounded-2xl gradient-primary items-center justify-center mx-auto">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-mono text-primary/60 font-bold">{step.step}</div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score Preview Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Live Score Preview
                </div>
                <h2 className="text-4xl font-bold leading-tight">
                  See every angle of your content&apos;s{" "}
                  <span className="gradient-text">viral potential</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  No vague metrics. Get a score for every dimension that matters —
                  hook strength, pacing, caption quality, thumbnail appeal, and more.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Hook Strength (First 3s)", score: 87, color: "bg-violet-500" },
                    { label: "Caption Optimization", score: 72, color: "bg-pink-500" },
                    { label: "Thumbnail Appeal", score: 91, color: "bg-amber-500" },
                    { label: "Trending Audio Match", score: 65, color: "bg-cyan-500" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-bold">{item.score}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock score card */}
              <div className="relative">
                <div className="absolute inset-0 gradient-primary opacity-5 rounded-3xl blur-3xl scale-110" />
                <div className="relative bg-card border border-border/60 rounded-3xl p-8 gradient-border card-hover">
                  <div className="text-center mb-8">
                    <div className="text-sm text-muted-foreground mb-2 font-medium">Overall Virality Score</div>
                    <div className="relative inline-flex items-center justify-center w-40 h-40">
                      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.18 0.015 285)" strokeWidth="10" />
                        <circle cx="60" cy="60" r="50" fill="none" strokeWidth="10"
                          stroke="url(#scoreGrad)" strokeLinecap="round"
                          strokeDasharray="314" strokeDashoffset="56"
                          style={{ filter: "drop-shadow(0 0 8px oklch(0.55 0.27 290 / 0.5))" }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="oklch(0.55 0.27 290)" />
                            <stop offset="100%" stopColor="oklch(0.65 0.27 340)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute text-center">
                        <div className="text-5xl font-black gradient-text">82</div>
                        <div className="text-xs text-muted-foreground">VIRAL</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Hook", value: "Strong ✓", green: true },
                      { label: "Pacing", value: "Fast ✓", green: true },
                      { label: "Caption", value: "Needs work", green: false },
                      { label: "Hashtags", value: "3 trending ✓", green: true },
                    ].map((item) => (
                      <div key={item.label} className="bg-secondary/50 rounded-xl p-3">
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className={`text-sm font-semibold mt-0.5 ${item.green ? "text-emerald-400" : "text-amber-400"}`}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                    <div className="text-xs font-medium text-primary mb-1">🔥 Top Suggestion</div>
                    <div className="text-sm text-muted-foreground">
                      Add a pattern interrupt at 0:02 — viewers drop off 43% here.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Award className="w-3.5 h-3.5" />
              Full Feature Suite
            </div>
            <h2 className="text-4xl font-bold mb-4">Everything creators need to{" "}
              <span className="gradient-text">grow faster</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border/50 card-hover group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">Analyze any content type</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Video, label: "Short Videos", detail: "TikTok, Reels, Shorts" },
                { icon: Image, label: "Images & Carousels", detail: "Photos, infographics" },
                { icon: FileText, label: "Captions & Copy", detail: "Text-only analysis" },
              ].map((type) => (
                <div key={type.label} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border/50">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by creators who{" "}
              <span className="gradient-text">dominate the feed</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Chen",
                handle: "@alexcreates",
                avatar: "AC",
                followers: "2.1M",
                quote: "ViralScore told me my hook was weak before I posted. Fixed it in 10 min. The video hit 4M views.",
                stars: 5,
              },
              {
                name: "Priya Sharma",
                handle: "@priyalifestyle",
                avatar: "PS",
                followers: "890K",
                quote: "The caption optimizer is insane. My engagement rate went from 3% to 9% in two weeks.",
                stars: 5,
              },
              {
                name: "Marcus Williams",
                handle: "@marcusfinance",
                avatar: "MW",
                followers: "450K",
                quote: "Competitor comparison helped me understand why my content wasn't landing. Game changer.",
                stars: 5,
              },
            ].map((review) => (
              <div key={review.name} className="p-6 rounded-2xl bg-card border border-border/50 space-y-4 card-hover">
                <div className="flex gap-1">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{review.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{review.name}</div>
                    <div className="text-xs text-muted-foreground">{review.handle} · {review.followers} followers</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, oklch(0.55 0.27 290 / 0.08) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Users className="w-3.5 h-3.5" />
              Join 12,000+ creators
            </div>
            <h2 className="text-5xl font-bold leading-tight">
              Stop guessing.{" "}
              <span className="gradient-text">Start going viral.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Upload your first piece of content and get a full virality report — free, no credit card required.
            </p>
            <Button size="lg" className="gradient-primary border-0 text-white px-10 py-6 text-lg font-semibold rounded-xl glow-primary" asChild>
              <Link href="/analyze">
                Analyze Your Content Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
