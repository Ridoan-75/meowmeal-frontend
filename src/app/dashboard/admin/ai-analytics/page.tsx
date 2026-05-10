"use client";

import { useState } from "react";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Sparkles, RefreshCw } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface Recommendation {
  priority: "high" | "medium" | "low";
  action: string;
  impact: string;
}

interface PlatformAnalysis {
  overallHealth: string;
  healthScore: number;
  keyMetrics: {
    conversionRate: string;
    avgOrderValue: string;
    customerSatisfaction: string;
  };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendations: Recommendation[];
  summary: string;
}

export default function AIAnalyticsPage() {
  const [analysis, setAnalysis] = useState<PlatformAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/ai/analyze-platform");
      setAnalysis(res.data.data);
    } catch {
      setError("Failed to analyze platform. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-500";
      case "good": return "text-blue-500";
      case "fair": return "text-yellow-500";
      case "poor": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Platform Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get AI-powered insights about your platform performance
          </p>
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all",
            "bg-primary hover:brightness-110 shadow-lg shadow-primary/20",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
            <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing...</>
          ) : (
            <><Sparkles className="h-4 w-4" />Analyze Now</>
          )}
        </button>
      </div>

      {/* Empty State */}
      {!analysis && !loading && !error && (
        <div className="border border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Ready to Analyze</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Click  &quot;Analyze Now&quot; to get AI-powered insights about your platform
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="border border-border rounded-2xl p-16 flex flex-col items-center justify-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Analyzing Platform Data...</h3>
            <p className="text-muted-foreground text-sm mt-1">Gemini AI is processing your data</p>
          </div>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="space-y-6">

          {/* Health Score */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1 bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className="text-5xl font-black text-primary">{analysis.healthScore}</p>
              <p className={cn("text-sm font-semibold capitalize", getHealthColor(analysis.overallHealth))}>
                {analysis.overallHealth}
              </p>
            </div>
            <div className="sm:col-span-3 bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Executive Summary
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{analysis.summary}</p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  <p className="text-sm font-semibold mt-0.5">{analysis.keyMetrics.conversionRate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Order Value</p>
                  <p className="text-sm font-semibold mt-0.5">{analysis.keyMetrics.avgOrderValue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer Satisfaction</p>
                  <p className="text-sm font-semibold mt-0.5">{analysis.keyMetrics.customerSatisfaction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths, Weaknesses, Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-500">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-500">
                <Lightbulb className="h-4 w-4" />
                Opportunities
              </h3>
              <ul className="space-y-2">
                {analysis.opportunities.map((o, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0 mt-0.5 uppercase", getPriorityColor(rec.priority))}>
                    {rec.priority}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{rec.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}