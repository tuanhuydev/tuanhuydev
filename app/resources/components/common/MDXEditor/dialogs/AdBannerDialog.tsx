import { Button } from "@resources/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@resources/components/common/Dialog";
import { Input } from "@resources/components/common/Input";
import { Label } from "@resources/components/common/Label";

interface AdBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    imgUrl: string;
    link: string;
    alt: string;
  };
  onFormDataChange: (data: { imgUrl: string; link: string; alt: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdBannerDialog({ open, onOpenChange, formData, onFormDataChange, onSubmit }: AdBannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Insert Ad Banner</DialogTitle>
            <DialogDescription>Add an advertisement banner to your content.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="imgUrl">
                Image URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="imgUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imgUrl}
                onChange={(e) => onFormDataChange({ ...formData, imgUrl: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link">
                Link URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="link"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(e) => onFormDataChange({ ...formData, link: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                placeholder="Advertisement description"
                value={formData.alt}
                onChange={(e) => onFormDataChange({ ...formData, alt: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Insert Ad Banner</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
