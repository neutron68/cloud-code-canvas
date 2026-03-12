import { useState, useEffect, useRef } from "react";
import { Globe, RefreshCw, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  htmlCode: string;
  cssCode?: string;
  jsCode?: string;
  isVisible: boolean;
}

const HTMLPreview = ({ htmlCode, cssCode, jsCode, isVisible }: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && isVisible) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {
        // Build complete HTML document
        let fullHTML = htmlCode;

        // If HTML doesn't have DOCTYPE, add it
        if (!fullHTML.toLowerCase().includes('<!doctype')) {
          fullHTML = `<!DOCTYPE html>\n${fullHTML}`;
        }

        // If HTML doesn't have html tags, wrap it
        if (!fullHTML.toLowerCase().includes('<html')) {
          fullHTML = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Preview</title>\n</head>\n<body>\n${fullHTML}\n</body>\n</html>`;
        }

        // Inject CSS if provided
        if (cssCode) {
          const styleTag = `<style>${cssCode}</style>`;
          if (fullHTML.includes('</head>')) {
            fullHTML = fullHTML.replace('</head>', `${styleTag}\n</head>`);
          } else if (fullHTML.includes('<body>')) {
            fullHTML = fullHTML.replace('<body>', `<head>${styleTag}</head>\n<body>`);
          }
        }

        // Inject JavaScript if provided
        if (jsCode) {
          const scriptTag = `<script>${jsCode}</script>`;
          if (fullHTML.includes('</body>')) {
            fullHTML = fullHTML.replace('</body>', `${scriptTag}\n</body>`);
          } else {
            fullHTML += scriptTag;
          }
        }

        // Write to iframe
        iframeDoc.open();
        iframeDoc.write(fullHTML);
        iframeDoc.close();
      }
    }
  }, [htmlCode, cssCode, jsCode, isVisible, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className={`flex flex-col bg-card border-l border-border ${isFullscreen ? 'fixed inset-0 z-50' : 'w-1/2'}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-neon-blue" />
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Live Preview
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            className="h-6 px-2 text-xs"
            title="Refresh preview"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleOpenInNewTab}
            className="h-6 px-2 text-xs"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-6 px-2 text-xs"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          title="HTML Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      </div>

      {/* Preview Footer */}
      <div className="px-3 py-1 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Live preview updates automatically</span>
          <span className="font-mono">localhost:preview</span>
        </div>
      </div>
    </div>
  );
};

export default HTMLPreview;