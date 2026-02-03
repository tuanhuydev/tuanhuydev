import type { ElementTransformer } from "@lexical/markdown";
import {
  DecoratorNode,
  NodeKey,
  $applyNodeReplacement,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
  ElementNode,
} from "lexical";
import { ReactNode, useState } from "react";

export type SerializedAdBannerNode = Spread<
  {
    imgUrl: string;
    link: string;
    alt?: string;
    description?: string;
  },
  SerializedLexicalNode
>;

// Shared utility to parse ad-banner syntax
export function parseAdBannerSyntax(text: string): {
  imgUrl: string;
  link: string;
  alt: string;
  description: string;
} {
  try {
    const imgUrlMatch = text.match(/imgUrl="([^"]*)"/);
    const linkMatch = text.match(/link="([^"]*)"/);
    const altMatch = text.match(/alt="([^"]*)"/);
    const descriptionMatch = text.match(/description="([^"]*)"/);

    return {
      imgUrl: imgUrlMatch ? imgUrlMatch[1] : "",
      link: linkMatch ? linkMatch[1] : "#",
      alt: altMatch ? altMatch[1] : "",
      description: descriptionMatch ? descriptionMatch[1] : "",
    };
  } catch (error) {
    console.error("Failed to parse ad-banner syntax:", error);
    // Return safe defaults on error
    return {
      imgUrl: "",
      link: "#",
      alt: "this is image",
      description: "this is description",
    };
  }
}

export class AdBannerNode extends DecoratorNode<ReactNode> {
  __imgUrl: string;
  __link: string;
  __alt?: string;
  __description?: string;

  static getType(): string {
    return "ad-banner";
  }

  static clone(node: AdBannerNode): AdBannerNode {
    return new AdBannerNode(node.__imgUrl, node.__link, node?.__alt, node?.__description, node.__key);
  }

  constructor(imgUrl: string = "", link: string = "", alt?: string, description?: string, key?: NodeKey) {
    super(key);
    this.__imgUrl = imgUrl;
    this.__link = link;
    this.__alt = alt;
    this.__description = description;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.style.display = "block";
    div.style.userSelect = "none";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): boolean {
    return false;
  }

  decorate(): ReactNode {
    return (
      <AdBanner
        imgUrl={this.__imgUrl}
        link={this.__link}
        alt={this.__alt ?? "image"}
        description={this.__description}
      />
    );
  }
  setImgUrl(imgUrl: string): AdBannerNode {
    const writable = this.getWritable();
    writable.__imgUrl = imgUrl;
    return writable;
  }
  getImgUrl(): string {
    return this.__imgUrl;
  }

  getLink(): string {
    return this.__link;
  }

  static importJSON(serializedNode: SerializedAdBannerNode): AdBannerNode {
    return $createAdBannerNode(
      serializedNode.imgUrl,
      serializedNode.link,
      serializedNode.alt,
      serializedNode.description,
    );
  }

  exportJSON(): SerializedAdBannerNode {
    return {
      ...super.exportJSON(),
      imgUrl: this.__imgUrl,
      link: this.__link,
      alt: this.__alt,
      description: this.__description,
    };
  }
}

export function $createAdBannerNode(imgUrl: string, link: string, alt?: string, description?: string): AdBannerNode {
  return $applyNodeReplacement(new AdBannerNode(imgUrl, link, alt, description));
}

export function $isAdBannerNode(node: LexicalNode | null | undefined): node is AdBannerNode {
  return node instanceof AdBannerNode;
}

interface AdBannerProps {
  imgUrl: string;
  link: string;
  alt: string;
  description?: string;
}

export function AdBanner({ imgUrl, link, alt, description }: AdBannerProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const placeholderUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2393c5fd;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='100' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='600' fill='white'%3EAd Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="my-6 w-full" contentEditable={false}>
      {/* Ad Banner */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-amber-400 dark:border-amber-500"
        style={{
          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        }}>
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-50 group-hover:opacity-75 transition-opacity duration-300 blur-md -z-10" />

        {/* Content Container - Flex Layout - Fixed Height */}
        <div className="relative bg-white dark:bg-slate-900 m-[2px] rounded-md overflow-hidden flex flex-row h-[100px]">
          <div className="absolute top-2 left-2 z-20">
            <span className="text-[10px] font-bold text-amber-300 dark:text-amber-100 uppercase tracking-wider px-2 py-1 bg-amber-100 dark:bg-amber-500 rounded-full shadow-md">
              ⭐ Ad
            </span>
          </div>

          <div className="relative w-[140px] flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageError || !imgUrl ? placeholderUrl : imgUrl}
              alt={alt || "Ad image"}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="relative flex-1 px-3 py-2 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 min-w-0">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10 dark:opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-xl" />
            </div>

            <div className="relative z-10 pr-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                {alt || "Featured Advertisement"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {description || "Discover amazing products and services. Click to learn more!"}
              </p>
            </div>

            {/* Learn More Button */}
            <div className="relative z-10 flex items-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-700 text-white text-xs font-semibold rounded-md transition-colors duration-200 shadow-sm group-hover:shadow-md">
                Learn More
                <svg
                  className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </a>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export const AD_BANNER_TRANSFORMER: ElementTransformer = {
  dependencies: [AdBannerNode],
  export: (node: LexicalNode, _exportChildren: (elementNode: ElementNode) => string) => {
    if (!$isAdBannerNode(node)) {
      return null;
    }
    const imgUrl = node.getImgUrl();
    const link = node.getLink();
    const alt = node.__alt || "";
    const description = node.__description || "";
    // Output format: custom bracket syntax
    return `[ad-banner imgUrl="${imgUrl}" link="${link}" alt="${alt}" description="${description}"]`;
  },
  regExp: /\[ad-banner\s+[^\]]+\]/,
  replace: (parentNode, _children, match) => {
    const fullMatch = match[0];

    // Use shared parser
    const { imgUrl, link, alt, description } = parseAdBannerSyntax(fullMatch);

    const adNode = $createAdBannerNode(imgUrl, link, alt, description);

    // Replace the parent element with the AdBanner
    parentNode.replace(adNode);
  },
  type: "element",
};
