"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FileViewerProps {
  url: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FileViewer({ url, title, isOpen, onClose }: FileViewerProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, url]);

  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden bg-background border-none shadow-2xl flex flex-col">
        <DialogHeader className="p-6 border-b border-border bg-card/50 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl md:text-2xl font-heading font-bold truncate pr-8">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-muted/20">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10 bg-background/50 backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                {t('common.loading')}
              </p>
            </div>
          )}
          
          <iframe
            src={`${url}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none shadow-inner"
            onLoad={() => setLoading(false)}
            title={title}
          />
        </div>

        <div className="p-4 bg-muted/10 border-t border-border flex items-center justify-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                AMEN Platform Secure Document Viewer
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
