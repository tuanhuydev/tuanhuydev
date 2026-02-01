import { Button } from "@resources/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@resources/components/common/Dialog";
import { Label } from "@resources/components/common/Label";

interface MermaidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MermaidDialog({ open, onOpenChange, code, onCodeChange, onSubmit }: MermaidDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Insert Mermaid Diagram</DialogTitle>
            <DialogDescription>Create flowcharts, sequence diagrams, and more using Mermaid syntax.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="mermaidCode">Diagram Code</Label>
              <textarea
                id="mermaidCode"
                className="min-h-[200px] w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                placeholder="graph TD&#10;    A[Start] --> B[Process]&#10;    B --> C[End]"
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learn more about{" "}
                <a
                  href="https://mermaid.js.org/intro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">
                  Mermaid syntax
                </a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Insert Diagram</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
