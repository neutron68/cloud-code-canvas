import { AlertCircle, AlertTriangle, Info, CheckCircle, X, Lightbulb, Wrench } from "lucide-react";
import { CodeError } from "@/lib/errorDetection";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  errors: CodeError[];
  warnings: CodeError[];
  summary: string;
  canRun: boolean;
  onClose: () => void;
  onJumpToLine: (line: number) => void;
  onApplyFix?: (line: number, fix: string) => void;
}

const ErrorPanel = ({ errors, warnings, summary, canRun, onClose, onJumpToLine, onApplyFix }: Props) => {
  const allIssues = [...errors, ...warnings].sort((a, b) => a.line - b.line);

  const getSeverityIcon = (severity: CodeError['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: CodeError['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-red-500/50 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/5';
      case 'info':
        return 'border-blue-500/50 bg-blue-500/5';
    }
  };

  const getCategoryBadge = (category: CodeError['category']) => {
    const colors = {
      syntax: 'bg-red-500/20 text-red-400',
      semantic: 'bg-orange-500/20 text-orange-400',
      style: 'bg-blue-500/20 text-blue-400',
      security: 'bg-purple-500/20 text-purple-400',
    };

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[category]}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 scroll-contain"
      onWheel={(e) => e.stopPropagation()}>
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col scroll-contain"
        onWheel={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            {canRun ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <h2 className="text-lg font-semibold">Code Analysis</h2>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 px-6 py-3 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">{errors.length} Errors</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{warnings.length} Warnings</span>
          </div>
          <div className="flex-1" />
          {!canRun && (
            <span className="text-sm text-red-500 font-medium">
              ⚠ Code cannot run until errors are fixed
            </span>
          )}
        </div>

        {/* Issues List */}
        <ScrollArea className="flex-1 p-6">
          {allIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Issues Found!</h3>
              <p className="text-muted-foreground">Your code looks great. Ready to run!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allIssues.map((issue, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)} hover:shadow-md transition-shadow`}
                >
                  {/* Issue Header */}
                  <div className="flex items-start gap-3 mb-2">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => onJumpToLine(issue.line)}
                          className="text-sm font-mono font-semibold hover:underline"
                        >
                          Line {issue.line}:{issue.column}
                        </button>
                        {getCategoryBadge(issue.category)}
                        <span className="text-xs text-muted-foreground font-mono">
                          {issue.code}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{issue.message}</p>
                    </div>
                  </div>

                  {/* Suggestion */}
                  <div className="flex items-start gap-2 mt-3 p-3 bg-muted/50 rounded border border-border/50">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Suggestion:
                      </p>
                      <p className="text-sm">{issue.suggestion}</p>
                    </div>
                  </div>

                  {/* Quick Fix */}
                  {issue.fix && onApplyFix && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApplyFix(issue.line, issue.fix!)}
                        className="text-xs"
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        Apply Quick Fix
                      </Button>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {issue.fix}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Click on line numbers to jump to the issue in the editor
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPanel;