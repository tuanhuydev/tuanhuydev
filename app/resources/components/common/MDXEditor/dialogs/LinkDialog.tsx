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

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    text: string;
    url: string;
  };
  onFormDataChange: (data: { text: string; url: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LinkDialog({ open, onOpenChange, formData, onFormDataChange, onSubmit }: LinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Enter the link text and URL.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="linkText">Link Text</Label>
              <Input
                id="linkText"
                placeholder="Click here"
                value={formData.text}
                onChange={(e) => onFormDataChange({ ...formData, text: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkUrl">
                URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="linkUrl"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => onFormDataChange({ ...formData, url: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Insert Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
