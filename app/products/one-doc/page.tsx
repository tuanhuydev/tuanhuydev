import styles from "./onedoc.module.css";
import SiteFooter from "@resources/landing/components/SiteFooter";
import ThemeToggle from "@resources/landing/components/ThemeToggle";
import { BASE_URL, ONEDOC_DOWNLOAD_URL } from "lib/commons/constants/base";
import { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const TITLE = "One Doc — a local-first document editor | tuanhuydev";
const DESCRIPTION =
  "One Doc is a local-first desktop word processor with real paged layout, markdown nodes and an in-house diagram editor. Your documents stay on your machine. Download for Mac and Windows.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: "One Doc — a local-first document editor that's yours",
    description: "A desktop word processor that keeps documents on your machine, not in someone else's cloud.",
    url: `${BASE_URL}/products/one-doc`,
    siteName: "tuanhuydev",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
  alternates: { canonical: `${BASE_URL}/products/one-doc` },
};

export const dynamic = "force-static";

const downloads = {
  macArm: `${ONEDOC_DOWNLOAD_URL}/One-Doc-1.0.0-mac-arm64.dmg`,
  macX64: `${ONEDOC_DOWNLOAD_URL}/One-Doc-1.0.0-mac-x64.dmg`,
  windows: `${ONEDOC_DOWNLOAD_URL}/One-Doc-Setup-1.0.0-windows-x64.exe`,
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const MacIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size}>
    <rect x="4" y="5" width="16" height="11" rx="1.5" />
    <path d="M2 20h20" />
  </svg>
);

const WindowsIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 4.5 10.5 3.4v7.6H3zM11.5 3.3 21 2v9h-9.5zM3 12h7.5v7.6L3 18.5zM11.5 12H21v9l-9.5-1.3z" />
  </svg>
);

const Figure = ({
  label,
  className = "",
  theme,
  children,
}: {
  label: string;
  className?: string;
  theme?: string;
  children: ReactNode;
}) => (
  <figure className={`${styles.win} ${className}`} data-theme={theme} role="img" aria-label={label}>
    <div aria-hidden="true">{children}</div>
  </figure>
);

export default function OneDocPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <nav className={styles.nav} aria-label="Primary">
        <Link className={styles.brand} href="/products/one-doc">
          onedoc
        </Link>
        <div className={styles.navLinks}>
          <a className={styles.navLink} href="#about">
            About
          </a>
          <a className={styles.navLink} href="#features">
            Features
          </a>
          <a className={styles.navLink} href="#roadmap">
            Roadmap
          </a>
        </div>
        <ThemeToggle />
      </nav>

      <main id="main">
        {/* ── HERO ── */}
        <section className={styles.hero} aria-labelledby="hero-h">
          <div className={styles.wrap}>
            <span className={`${styles.badge} ${styles.bEarly}`}>One Doc</span>
            <h1 id="hero-h">A local-first document editor that&apos;s yours.</h1>
            <p className={styles.lead}>
              One Doc is a desktop word processor that keeps your documents on your machine, not in someone else&apos;s
              cloud. It aims to be a full replacement for Google Docs and Word, and it&apos;s in active development.
            </p>
            <div className={styles.cta}>
              <a className={`${styles.btn} ${styles.btnP}`} href={downloads.macArm}>
                <MacIcon />
                Mac <small>Apple Silicon</small>
              </a>
              <a className={`${styles.btn} ${styles.btnS}`} href={downloads.macX64}>
                <MacIcon />
                Mac <small>Intel</small>
              </a>
              <a className={`${styles.btn} ${styles.btnS}`} href={downloads.windows}>
                <WindowsIcon />
                Windows
              </a>
            </div>
            <p className={styles.fine}>
              Direct download. Documents are saved as <code>.odx</code>. One Doc is in active development, so keep
              backups of anything important.
            </p>

            <Figure
              className={`${styles.heroWin} ${styles.reveal}`}
              label="One Doc window showing a document titled Launch plan on a US Letter page, with a ruler above it, a formatting toolbar, an outline sidebar, a table, a checklist and a small Draft, Review, Export flow diagram.">
              <div className={styles.tb}>
                <div className={styles.dots}>
                  <i />
                  <i />
                  <i />
                </div>
                <div className={styles.ttl}>Launch plan.odx</div>
                <div className={styles.sv}>Saved</div>
              </div>
              <div className={styles.tools}>
                <span className={styles.chip}>Heading 1</span>
                <span className={styles.chip}>System UI</span>
                <span className={styles.chip}>16</span>
                <span className={styles.sep} />
                <span className={`${styles.chip} ${styles.chipOn}`}>
                  <b>B</b>
                </span>
                <span className={styles.chip}>
                  <i>I</i>
                </span>
                <span className={styles.chip}>
                  <u>U</u>
                </span>
                <span className={styles.sw} style={{ background: "#2a6fdb" }} />
                <span className={styles.sw} style={{ background: "#fde68a" }} />
                <span className={styles.sep} />
                <span className={styles.chip}>List</span>
                <span className={styles.chip}>Todo</span>
                <span className={styles.chip}>Link</span>
                <span className={styles.chip}>Table</span>
                <span className={styles.chip}>Chart</span>
                <span className={styles.chip}>Diagram</span>
              </div>
              <div className={styles.body}>
                <div className={styles.side}>
                  <h4>Outline</h4>
                  <div className={styles.sideOn}>Launch plan</div>
                  <div className={styles.sideSub}>Milestones</div>
                  <div className={styles.sideSub}>Checklist</div>
                  <div className={styles.sideSub}>Release flow</div>
                </div>
                <div className={styles.stage}>
                  <div className={styles.ruler} />
                  <div className={styles.paper}>
                    <h5>Launch plan</h5>
                    <p>Notes for the first public build. Everything here stays on this machine until I export it.</p>
                    <table>
                      <tbody>
                        <tr>
                          <th>Milestone</th>
                          <th>Owner</th>
                          <th>Status</th>
                        </tr>
                        <tr>
                          <td>Installer</td>
                          <td>Me</td>
                          <td>In progress</td>
                        </tr>
                        <tr>
                          <td>Docs</td>
                          <td>Me</td>
                          <td>Planned</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className={styles.todo}>
                      <div className={styles.todoDone}>
                        <span className={`${styles.cb} ${styles.cbCk}`} />
                        <span>Pagination checked on long tables</span>
                      </div>
                      <div>
                        <span className={styles.cb} />
                        <span>Write the release notes</span>
                      </div>
                      <div>
                        <span className={styles.cb} />
                        <span>Export a PDF and compare pages</span>
                      </div>
                    </div>
                    <div className={styles.flow}>
                      <span className={styles.fc}>Draft</span>
                      <span className={styles.fl} />
                      <span className={styles.fc}>Review</span>
                      <span className={styles.fl} />
                      <span className={styles.fc}>Export</span>
                    </div>
                    <div className={styles.bar} style={{ width: "92%" }} />
                    <div className={styles.bar} style={{ width: "78%" }} />
                    <div className={styles.bar} style={{ width: "86%" }} />
                  </div>
                </div>
              </div>
              <div className={styles.status}>
                <span>Page 1 of 2 · US Letter</span>
                <span>Light and dark app themes</span>
              </div>
            </Figure>
          </div>
        </section>

        {/* ── WHY ── */}
        <section className={`${styles.sec} ${styles.tint} ${styles.anchor}`} id="about" aria-labelledby="why-h">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Why One Doc</p>
            <h2 className={styles.h2} id="why-h">
              I wanted a word processor I actually own.
            </h2>
            <p className={styles.lead}>
              Most document tools assume your writing belongs on their servers. One Doc starts from the opposite
              assumption and builds up from there.
            </p>
            <div className={styles.cards}>
              <article className={`${styles.card} ${styles.reveal}`}>
                <div className={styles.ico}>
                  <svg {...iconProps}>
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M8 20h8M12 16v4" />
                  </svg>
                </div>
                <h3>Local-first, your files</h3>
                <p>
                  Documents live on your machine in a file format you can keep, back up and move. No account, no one
                  else&apos;s cloud in the middle.
                </p>
              </article>
              <article className={`${styles.card} ${styles.reveal}`}>
                <div className={styles.ico}>
                  <svg {...iconProps}>
                    <path d="M7 3h8l4 4v14H7z" />
                    <path d="M15 3v4h4M10 12h6M10 16h6" />
                  </svg>
                </div>
                <h3>A real paged word processor</h3>
                <p>
                  US Letter pages, real margins, and a PDF export that matches what you see on screen. Not a notes app
                  with a print button.
                </p>
              </article>
              <article className={`${styles.card} ${styles.reveal}`}>
                <div className={styles.ico}>
                  <svg {...iconProps}>
                    <circle cx="6" cy="12" r="2.5" />
                    <circle cx="18" cy="6" r="2.5" />
                    <circle cx="18" cy="18" r="2.5" />
                    <path d="M8.2 11l7.6-4M8.2 13l7.6 4" />
                  </svg>
                </div>
                <h3>Built to work with AI on your terms</h3>
                <p>
                  The plan is for you to decide exactly which files an AI tool can see, and keep everything else
                  private. That part is still ahead of us.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className={`${styles.sec} ${styles.anchor}`} id="features" aria-labelledby="feat-h">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Shipping today</p>
            <h2 className={styles.h2} id="feat-h">
              What&apos;s already in the build.
            </h2>
            <p className={styles.lead}>One Doc is in active development. Here&apos;s what you can use now.</p>

            <div className={`${styles.row} ${styles.reveal}`}>
              <div>
                <h3>Pages that behave like pages</h3>
                <p>
                  US Letter with 1&quot; margins, and pagination at the block level, so tables and diagrams never split
                  across a page break. Print or export to PDF and the pages match the screen.
                </p>
                <ul>
                  <li>Interactive ruler with draggable margins</li>
                  <li>Handles very large documents, with guard rails on extreme sizes</li>
                </ul>
              </div>
              <Figure
                className={styles.vis}
                label="A ruler with draggable margin markers above a US Letter page; a second page begins below a page break.">
                <div className={styles.stage} style={{ padding: "14px 14px 0" }}>
                  <div className={styles.ruler} style={{ marginTop: 0 }} />
                  <div className={styles.paper} style={{ height: 300, paddingTop: "12%" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: "10%",
                        border: "1px dashed #93b4e8",
                        pointerEvents: "none",
                      }}
                    />
                    <h5>Chapter one</h5>
                    <div className={styles.bar} style={{ width: "96%" }} />
                    <div className={styles.bar} style={{ width: "90%" }} />
                    <div className={styles.bar} style={{ width: "94%" }} />
                    <div className={styles.bar} style={{ width: "60%" }} />
                    <table>
                      <tbody>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                        </tr>
                        <tr>
                          <td>Keeps whole</td>
                          <td>1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className={styles.status}>
                  <span>Margins: 1&quot; · 1&quot; · 1&quot; · 1&quot;</span>
                  <span>Page 1 of 3</span>
                </div>
              </Figure>
            </div>

            <div className={`${styles.row} ${styles.flip} ${styles.reveal}`}>
              <div>
                <h3>Write markdown, get real document nodes</h3>
                <p>
                  Type markdown and it becomes structured content in the document, not text that merely looks formatted.
                  A slash-menu style suggestion list helps while you write.
                </p>
                <ul>
                  <li>Markdown custom node processing</li>
                  <li>Dynamic suggestions as you type</li>
                </ul>
              </div>
              <Figure
                className={styles.vis}
                label="Left: markdown source with a heading and a task list. Right: the same content rendered as a heading and checklist, with a suggestion menu open listing Heading, Table, Checklist and Diagram.">
                <div className={styles.split}>
                  <div className={styles.pane}>
                    <div className={styles.lbl}>You type</div>
                    <pre className={styles.code}>
                      <span>##</span> Weekly plan{"\n"}
                      <span>- [ ]</span> Draft outline{"\n"}
                      <span>- [x]</span> Pick a title{"\n"}
                      <span>/</span>ta
                    </pre>
                    <div className={styles.pop}>
                      <div className={styles.popOn}>
                        Table <span>/table</span>
                      </div>
                      <div>
                        Todo list <span>/todo</span>
                      </div>
                      <div>
                        Diagram <span>/diagram</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.pane} style={{ background: "var(--w-canvas)" }}>
                    <div className={styles.lbl}>You get</div>
                    <div className={styles.paper} style={{ height: 200, padding: 16 }}>
                      <h5 style={{ fontSize: 15 }}>Weekly plan</h5>
                      <div className={styles.todo}>
                        <div>
                          <span className={styles.cb} />
                          <span>Draft outline</span>
                        </div>
                        <div className={styles.todoDone}>
                          <span className={`${styles.cb} ${styles.cbCk}`} />
                          <span>Pick a title</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Figure>
            </div>

            <div className={`${styles.row} ${styles.reveal}`}>
              <div>
                <h3>Tables, checklists and charts</h3>
                <p>
                  Rich formatting that covers the everyday work: headings, lists, todo lists, links with a proper
                  dialog, system fonts, text color and highlight. Tables get row and column controls and header styling.
                  Images and charts render in the page.
                </p>
              </div>
              <Figure className={styles.vis} label="A page with a styled table, a checklist and a bar chart.">
                <div className={styles.stage} style={{ padding: 14 }}>
                  <div className={styles.paper} style={{ height: 300, padding: "14px 16px 0" }}>
                    <table>
                      <tbody>
                        <tr>
                          <th>Task</th>
                          <th>Due</th>
                        </tr>
                        <tr>
                          <td>Outline</td>
                          <td>Mon</td>
                        </tr>
                        <tr>
                          <td>Draft</td>
                          <td>Thu</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className={styles.todo}>
                      <div className={styles.todoDone}>
                        <span className={`${styles.cb} ${styles.cbCk}`} />
                        <span>Outline</span>
                      </div>
                      <div>
                        <span className={styles.cb} />
                        <span>Draft</span>
                      </div>
                    </div>
                    <div className={styles.chart}>
                      <i style={{ height: "40%" }} />
                      <i style={{ height: "65%" }} />
                      <i style={{ height: "50%" }} />
                      <i style={{ height: "85%" }} />
                      <i style={{ height: "70%" }} />
                    </div>
                    <div className={styles.cap}>Sample data</div>
                  </div>
                </div>
              </Figure>
            </div>

            <div className={`${styles.row} ${styles.flip} ${styles.reveal}`}>
              <div>
                <h3>A diagram editor built into the page</h3>
                <p>
                  Not an embedded third-party whiteboard. Diagrams are made of cards and connectors, with templates such
                  as flow and sequence. Edit mode gives you the canvas; view mode shows a clean, auto-fitted diagram in
                  the document.
                </p>
                <ul>
                  <li>Cards, connectors and templates</li>
                  <li>Edit mode and clean auto-fit view mode</li>
                </ul>
              </div>
              <Figure
                className={styles.vis}
                theme="dark"
                label="Dark-theme diagram editor in edit mode showing three cards, Input, Process and Output, joined by connectors, with an Edit and View toggle.">
                <div className={styles.tb}>
                  <div className={styles.dots}>
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className={styles.ttl}>Release flow</div>
                  <div className={styles.seg}>
                    <span className={styles.segOn}>Edit</span>
                    <span>View</span>
                  </div>
                </div>
                <div className={styles.stage} style={{ padding: 14, alignItems: "stretch" }}>
                  <div className={styles.dg}>
                    <div className={styles.dn} style={{ left: "6%", top: "16%" }}>
                      Draft
                    </div>
                    <div className={styles.cn} style={{ left: "22%", top: "calc(16% + 15px)", width: "16%" }} />
                    <div className={`${styles.dn} ${styles.dnSel}`} style={{ left: "40%", top: "16%" }}>
                      Review
                    </div>
                    <div className={styles.cv} style={{ left: "50%", top: "calc(16% + 32px)", height: 60 }} />
                    <div className={styles.dn} style={{ left: "40%", top: "calc(16% + 92px)" }}>
                      Export PDF
                    </div>
                    <div className={styles.cn} style={{ left: "60%", top: "calc(16% + 15px)", width: "12%" }} />
                    <div className={styles.dn} style={{ left: "74%", top: "16%" }}>
                      Publish
                    </div>
                  </div>
                </div>
                <div className={styles.status}>
                  <span>Template: Flow</span>
                  <span>1 card selected</span>
                </div>
              </Figure>
            </div>
          </div>
        </section>

        {/* ── YOUR FILES, YOUR RULES ── */}
        <section className={`${styles.sec} ${styles.tint}`} aria-labelledby="rules-h">
          <div className={styles.wrap}>
            <span className={`${styles.badge} ${styles.bNext}`}>Coming next</span>
            <h2 className={styles.h2} id="rules-h" style={{ marginTop: 16 }}>
              Your files, your rules.
            </h2>
            <p className={styles.lead}>
              The direction: One Doc bundles an MCP knowledge server, and you choose exactly which files it exposes.
              Private documents stay private, and the tools you pick can still read what you decide to share. This
              isn&apos;t available yet.
            </p>
            <ol className={styles.share} aria-label="How sharing will work">
              <li className={styles.node}>
                <h3>Documents</h3>
                <p>Everything lives on your machine.</p>
                <div className={styles.files}>
                  <div>
                    <span className={styles.tg} />
                    Research notes.odx
                  </div>
                  <div>
                    <span className={styles.tg} />
                    Project spec.odx
                  </div>
                  <div className={styles.off}>
                    <span className={`${styles.tg} ${styles.tgOff}`} />
                    Journal.odx
                  </div>
                </div>
              </li>
              <li className={`${styles.node} ${styles.nodeHl}`}>
                <h3>You choose what to share</h3>
                <p>Pick files one by one. Anything you leave off is never exposed.</p>
              </li>
              <li className={styles.node}>
                <h3>MCP server</h3>
                <p>A knowledge server inside One Doc serves only the files you picked.</p>
              </li>
              <li className={styles.node}>
                <h3>Other tools</h3>
                <p>AI clients and other tools that speak MCP.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section className={`${styles.sec} ${styles.anchor}`} id="roadmap" aria-labelledby="road-h">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Roadmap</p>
            <h2 className={styles.h2} id="road-h">
              Where it is, and where it&apos;s going.
            </h2>
            <div className={styles.road}>
              <div className={styles.col}>
                <span className={`${styles.badge} ${styles.bNow}`}>Shipping now</span>
                <ul>
                  <li>Paged layout, interactive ruler, PDF export that matches the screen</li>
                  <li>Rich formatting, tables, checklists, images and charts</li>
                  <li>In-house diagram editor</li>
                  <li>Markdown nodes and dynamic suggestions</li>
                  <li>Save, Open, Save As and Export PDF, a recent-files home screen, and the .odx format</li>
                  <li>Very large documents, with guard rails</li>
                </ul>
              </div>
              <div className={`${styles.col} ${styles.colNext}`}>
                <span className={`${styles.badge} ${styles.bNext}`}>Coming next</span>
                <ul>
                  <li>Document / AI mode toggle in the top bar</li>
                  <li>Turning your files into a vector database</li>
                  <li>Bundled MCP knowledge server, with you choosing which files it exposes</li>
                  <li>A possible move to a lighter native runtime</li>
                </ul>
                <p className={styles.fine}>Direction, not a promise of dates.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div style={{ marginTop: 96 }}>
        <SiteFooter />
      </div>
    </div>
  );
}
