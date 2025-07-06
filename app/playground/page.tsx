"use client";

import DynamicEditor from "../components/commons/DynamicEditor/DynamicEditor";
import { Box, Container, Paper, Typography, Card, CardContent, Divider, Chip, Stack } from "@mui/material";
import { useState } from "react";

const SAMPLE_MARKDOWN = `# Welcome to DynamicEditor Playground 🎮

This is a **powerful** markdown editor built with Meta&apos;s Lexical framework and styled with Material-UI icons.

## Key Features ✨

- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Code Support**: Inline \`code\` and code blocks
- **Lists**: Both numbered and bullet points
- **Quotes**: Blockquotes for emphasis
- **Headings**: H1 through H6 support
- **Real-time Conversion**: Live markdown output
- **Fullscreen Mode**: Distraction-free editing
- **Undo/Redo**: Full history support

### Text Formatting Examples

This text has **bold**, *italic*, and ~~strikethrough~~ formatting.

You can also use \`inline code\` for technical terms.

### Lists

#### Unordered List:
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered List:
1. Step one
2. Step two
3. Step three

### Blockquotes

> "The best way to predict the future is to create it." 
> 
> — Peter Drucker

### Code Blocks

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

\`\`\`python
def hello_world():
    print("Hello, World!")
    
hello_world()
\`\`\`

## Try the Editor

Use the toolbar above to format your text, or try these keyboard shortcuts:

- **Ctrl+B** (or **Cmd+B**): Bold
- **Ctrl+I** (or **Cmd+I**): Italic  
- **Ctrl+Z** (or **Cmd+Z**): Undo
- **Ctrl+Y** (or **Cmd+Y**): Redo

Start editing this text or replace it with your own content!`;

export default function DynamicEditorPlayground() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          DynamicEditor Playground
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A modern, feature-rich markdown editor built with Lexical and Material-UI
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip label="Lexical" color="primary" size="small" />
          <Chip label="Material-UI" color="secondary" size="small" />
          <Chip label="TypeScript" color="info" size="small" />
          <Chip label="Next.js" color="success" size="small" />
        </Stack>
      </Box>

      {/* Editor Section */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3, mb: 4 }}>
        <Paper elevation={2} sx={{ height: "600px", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" component="h2">
              Editor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edit your markdown content using the rich text toolbar
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <DynamicEditor
              value={markdown}
              onChange={setMarkdown}
              placeholder="Start writing your markdown content..."
              className="playground-editor"
            />
          </Box>
        </Paper>

        {/* Output Section */}
        <Paper elevation={2} sx={{ height: "600px", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" component="h2">
                  Markdown Output
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time markdown representation
                </Typography>
              </Box>
              <Chip label={`${markdown.length} chars`} size="small" variant="outlined" />
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
                fontSize: "14px",
                lineHeight: 1.5,
                margin: 0,
                background: "transparent",
              }}>
              {markdown}
            </pre>
          </Box>
        </Paper>
      </Box>

      {/* Features Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Features Overview
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎨 Rich Formatting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bold, italic, underline, strikethrough, and inline code formatting
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📝 Structure
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Headings, lists, blockquotes, and organized content structure
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💻 Code Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Syntax highlighting for code blocks and inline code snippets
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔄 Real-time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live markdown conversion and instant preview of changes
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Technical Details */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Technical Details
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            This editor is built using <strong>Meta&apos;s Lexical</strong> framework, which provides a modern,
            extensible, and performant rich text editing experience. The component is fully integrated with{" "}
            <strong> Material-UI</strong> for consistent theming and iconography.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Key Technologies:</strong> Lexical, Material-UI, TypeScript, Next.js, React
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
