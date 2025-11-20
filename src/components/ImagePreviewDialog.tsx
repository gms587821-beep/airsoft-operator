import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
  description?: string;
}

export const ImagePreviewDialog = ({
  open,
  onOpenChange,
  imageUrl,
  title,
  description,
}: ImagePreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="bg-muted/30 p-8">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          
          <div className="p-6 space-y-2">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
