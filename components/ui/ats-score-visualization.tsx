"use client";

import * as React from "react";
import type { ATSScoreResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ATSScoreVisualizationProps {
  score: ATSScoreResult;
}

export function ATSScoreVisualization({ score }: ATSScoreVisualizationProps) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">ATS Score</h3>
        <div className="mt-2 space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Overall</span>
              <span className="font-medium">{score.overallScore}%</span>
            </div>
            <Progress value={score.overallScore} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Keyword Match</span>
              <span className="font-medium">{score.keywordMatch}%</span>
            </div>
            <Progress value={score.keywordMatch} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Format</span>
              <span className="font-medium">{score.formatScore}%</span>
            </div>
            <Progress value={score.formatScore} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Content</span>
              <span className="font-medium">{score.contentScore}%</span>
            </div>
            <Progress value={score.contentScore} className="h-2" />
          </div>
        </div>
      </div>

      {score.strengths?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Strengths</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {score.strengths.map((item, index) => (
              <li key={`strength-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {score.missingKeywords?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Missing Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {score.missingKeywords.map((kw, index) => (
              <span
                key={`missing-${index}`}
                className="rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-xs"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {score.improvementTips?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Improvement Tips</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {score.improvementTips.map((tip, index) => (
              <li key={`tip-${index}`}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
