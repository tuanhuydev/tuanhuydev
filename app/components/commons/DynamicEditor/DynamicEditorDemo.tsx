"use client";

import DynamicEditor from "./DynamicEditor";
import { Box, Typography, Paper } from "@mui/material";
import { useState } from "react";

export default function DynamicEditorDemo() {
  const [markdown, setMarkdown] = useState(`# Welcome to DynamicEditor

This is a **powerful** markdown editor built with Lexical.

## Features

- Rich text formatting
- Code blocks
- Lists and quotes
- Real-time markdown conversion

### Try it out!

Type some text and see the markdown output below.

> This is a quote block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

- Bullet point 1
- Bullet point 2
  - Nested item

1. Numbered list
2. Another item

---

**Bold text**, *italic text*, and \`inline code\`.
`);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        DynamicEditor Demo
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, height: 600 }}>
        {/* Editor */}
        <Paper elevation={2} sx={{ overflow: "hidden" }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            Editor
          </Typography>
          <DynamicEditor
            value={markdown}
            onChange={setMarkdown}
            placeholder="Start writing your content..."
            className="h-full"
          />
        </Paper>

        {/* Markdown Output */}
        <Paper elevation={2} sx={{ overflow: "hidden" }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            Markdown Output
          </Typography>
          <Box sx={{ p: 2, height: "calc(100% - 60px)", overflow: "auto" }}>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                fontSize: "14px",
                margin: 0,
              }}>
              {markdown}
            </pre>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
