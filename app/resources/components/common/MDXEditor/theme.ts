import { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  // Headings
  heading: {
    h1: "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-5 sm:mt-6 mb-2.5 sm:mb-3 pb-2 leading-tight",
    h2: "text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-4 sm:mt-5 mb-2 pb-1.5 leading-tight",
    h3: "text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mt-3 sm:mt-4 mb-1.5 sm:mb-2 leading-snug",
    h4: "text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-3 mb-1.5 leading-snug",
    h5: "text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2 sm:mt-3 mb-1 sm:mb-1.5 leading-normal",
    h6: "text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 mb-1 leading-normal",
  },

  // Standard Text
  paragraph: "my-2 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300",

  // Quotes
  quote:
    "border-l-4 border-blue-500 dark:border-blue-400 pl-3 sm:pl-4 py-1.5 sm:py-2 my-2 sm:my-3 bg-blue-50 dark:bg-slate-800/50 rounded-r-md italic text-sm sm:text-base text-gray-700 dark:text-gray-300",

  // Lists
  list: {
    ul: "list-disc pl-4 sm:pl-5 my-2 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300",
    ol: "list-decimal pl-4 sm:pl-5 my-2 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300",
    listitem: "leading-relaxed pl-0.5 sm:pl-1",
    nested: {
      listitem: "list-none",
    },
  },

  // Links
  link: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer",

  // Inline Formatting
  text: {
    bold: "font-bold text-gray-900 dark:text-white",
    italic: "italic text-gray-700 dark:text-gray-300",
    underline: "underline",
    strikethrough: "line-through text-gray-500 dark:text-gray-400",
    underlineStrikethrough: "underline line-through",
    code: "rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:text-pink-400",
  },

  // Code Block (VS Code Dark+ theme)
  code: "block rounded-lg overflow-auto text-xs sm:text-sm my-3 sm:my-4 bg-[#1E1E1E] p-4 font-mono border border-slate-800 shadow-md text-[#D4D4D4] leading-normal selection:bg-[#264F78]",

  // Syntax Highlighting Tokens
  codeHighlight: {
    atrule: "text-[#C586C0]",
    attr: "text-[#9CDCFE]",
    boolean: "text-[#569CD6]",
    builtin: "text-[#4EC9B0]",
    comment: "text-[#6A9955] italic",
    constant: "text-[#4FC1FF]",
    function: "text-[#DCDCAA]",
    important: "text-[#569CD6]",
    keyword: "text-[#569CD6]",
    number: "text-[#B5CEA8]",
    operator: "text-[#D4D4D4]",
    prolog: "text-[#6A9955]",
    property: "text-[#9CDCFE]",
    punctuation: "text-[#D4D4D4]",
    regex: "text-[#D16969]",
    selector: "text-[#D7BA7D]",
    string: "text-[#CE9178]",
    symbol: "text-[#4FC1FF]",
    tag: "text-[#569CD6]",
    url: "text-[#9CDCFE]",
    variable: "text-[#9CDCFE]",
  },

  // Tables
  table:
    "w-full my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs sm:text-sm",
  tableCell:
    "px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-slate-200 dark:border-slate-700",
  tableCellHeader:
    "bg-slate-50 dark:bg-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white border-b border-slate-200 dark:border-slate-700",
  tableRow: "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",

  // Misc
  hr: "my-4 border-t border-gray-200 dark:border-gray-700",
  image: "w-full max-w-full h-auto my-2 sm:my-3 rounded-lg overflow-hidden shadow-md",
};
