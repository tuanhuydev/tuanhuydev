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

  return (
    <div className="my-6 w-full" contentEditable={false}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group flex items-center gap-4 rounded-2xl border border-[#e6e5e1] bg-white hover:border-[#172733] transition-colors duration-150 overflow-hidden"
        style={{ textDecoration: "none" }}>
        {/* Thumbnail */}
        <div className="relative w-24 h-20 flex-shrink-0 bg-[#f0f7f9] rounded-lg overflow-hidden sm:w-32 sm:h-24 ml-3">
          {imgUrl && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt={alt || "Ad image"}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover !my-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#a3a3a3] text-xs font-medium">Ad</div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 py-4 pr-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{ color: "#a3a3a3", borderColor: "#e6e5e1" }}>
              Ad
            </span>
          </div>
          {alt && <p className="text-sm font-semibold leading-snug text-[#0d0d0d] line-clamp-1 mb-1">{alt}</p>}
          {description && <p className="text-xs leading-relaxed text-[#525252] line-clamp-2">{description}</p>}
        </div>

        {/* Arrow */}
        <div className="pr-5 text-[#a3a3a3] text-lg flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#172733]">
          ↗
        </div>
      </a>
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
