"use client";

import { Button } from "@app/components/ui/button";
import { Send } from "lucide-react";
import { useRef } from "react";

export interface CommentForm {
  content: string;
}

export interface CommentFormProps {
  onSubmit: (formData: CommentForm) => Promise<void>;
}

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment");
    if (!comment) return;
    await onSubmit({ content: comment as string });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return (
    <form className="flex gap-2 text-base rounded-md bg-slate-100 dark:bg-slate-800 p-2 mb-2" onSubmit={handleSubmit}>
      <input
        id="comment"
        name="comment"
        type="text"
        ref={inputRef}
        autoComplete="off"
        autoFocus
        placeholder="Write a comment..."
        className="py-2 px-4 border-none rounded-sm grow outline-none focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
      <Button type="submit" size="icon" variant="ghost" aria-label="send" className="rounded-sm">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
