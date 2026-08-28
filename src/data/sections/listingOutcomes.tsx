/**
 * Section 2 — Listing Every Outcome (Introduce)
 * =============================================
 * Constructivist figure: ten identical sweets sit in the bag and the student
 * clicks each one to move it into a list of possible picks. A faded ghost stays
 * behind in the bag so the change is always visible against what it changed
 * from. The count of listed outcomes is the number the whole lesson divides by.
 */

import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineFeedback,
    InlineLinkedHighlight,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure } from "@/components/molecules";
import { useVar, useSetVar } from "@/stores";
import {
    clozePropsFromDefinition,
    getVariableInfo,
    linkedHighlightPropsFromDefinition,
} from "../variables";

// ── Domain model ─────────────────────────────────────────────────────────────

const SWEET_COUNT = 10;

// ── View constants ───────────────────────────────────────────────────────────

const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 300;

const BAG_LEFT = 40;
const BAG_TOP = 44;
const BAG_WIDTH = 480;
const BAG_HEIGHT = 118;

const BAG_RADIUS = 18;
const LIST_RADIUS = 14;
const LIST_Y = 238;
const LIST_FIRST_X = 56;
const LIST_PITCH = 50;

const INK = "#334155";
const INK_STRUCTURE = "#64748B";
const INK_QUIET = "#CBD5E1";
const PAPER_FILL = "#F1F5F9";
const ACCENT = "#8E90F5";

/** One muted colour per sweet — ten different flavours in the bag. */
const SWEET_COLORS = [
    "#62D0AD", // teal
    "#8E90F5", // indigo
    "#F7B23B", // amber
    "#AC8BF9", // violet
    "#F8A0CD", // rose
    "#62CCF9", // sky
    "#F4A89A", // coral
    "#A8D5A2", // sage
    "#FFCBA4", // peach
    "#C9B8E8", // lavender
];

const EMPTY_MASK = "0".repeat(SWEET_COUNT);

const EASE_150 = { transition: "opacity 150ms ease, stroke-width 150ms ease" } as const;
const EASE_MOVE = { transition: "transform 480ms cubic-bezier(0.2, 0.8, 0.2, 1)" } as const;

/** Home position of sweet `index` inside the bag (2 rows of 5). */
const bagPosition = (index: number) => ({
    x: 100 + (index % 5) * 80,
    y: index < 5 ? 84 : 134,
});

/** Position of sweet `index` once it has been listed as a possible pick. */
const listPosition = (index: number) => ({
    x: LIST_FIRST_X + index * LIST_PITCH,
    y: LIST_Y,
});

// ── The bespoke drawing ──────────────────────────────────────────────────────

function OutcomeListDrawing() {
    const setVar = useSetVar();
    const mask = useVar<string>("outcomeListedMask", EMPTY_MASK);
    const listedCount = mask.split("").filter((c) => c === "1").length;
    const highlight = useVar<string>("outcomeBagHighlight", "");

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("outcomeBagHighlight", id),
        onPointerLeave: () => setVar("outcomeBagHighlight", ""),
    });

    const isListed = (index: number) => mask[index] === "1";

    const toggle = (index: number) => {
        const chars = mask.split("");
        chars[index] = chars[index] === "1" ? "0" : "1";
        const next = chars.join("");
        setVar("outcomeListedMask", next);
        setVar("outcomeListedCount", chars.filter((c) => c === "1").length);
    };

    return (
        <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full"
            role="img"
            aria-label="A bag holding ten sweets, and a list of the possible picks below it"
        >
            {/* The bag — every sweet inside it is one thing that could come out. */}
            <g opacity={dim("bag")} style={EASE_150} {...hoverProps("bag")}>
                <text x={BAG_LEFT} y={32} fill={INK} fontSize="13">
                    The bag
                </text>
                {highlight === "bag" && (
                    <rect
                        x={BAG_LEFT}
                        y={BAG_TOP}
                        width={BAG_WIDTH}
                        height={BAG_HEIGHT}
                        rx="16"
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth="8"
                        opacity={0.28}
                    />
                )}
                <rect
                    x={BAG_LEFT}
                    y={BAG_TOP}
                    width={BAG_WIDTH}
                    height={BAG_HEIGHT}
                    rx="16"
                    fill="none"
                    stroke={highlight === "bag" ? ACCENT : INK_STRUCTURE}
                    strokeWidth={highlight === "bag" ? 3 : 2}
                    style={EASE_150}
                />
                {/* Ghost of every sweet's home: the before-state stays visible. */}
                {Array.from({ length: SWEET_COUNT }, (_, index) => {
                    const home = bagPosition(index);
                    return (
                        <circle
                            key={`ghost-${index}`}
                            cx={home.x}
                            cy={home.y}
                            r={BAG_RADIUS}
                            fill="none"
                            stroke={INK_QUIET}
                            strokeWidth="2"
                            strokeDasharray="3 4"
                        />
                    );
                })}
            </g>

            {/* The list of possible picks. */}
            <g opacity={dim("list")} style={EASE_150} {...hoverProps("list")}>
                <text x={BAG_LEFT} y={206} fill={INK} fontSize="13">
                    Possible picks
                </text>
                <text
                    x={VIEW_WIDTH - 40}
                    y={206}
                    fill={listedCount === SWEET_COUNT ? ACCENT : INK}
                    fontSize="13"
                    textAnchor="end"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {`${listedCount} of ${SWEET_COUNT} listed`}
                </text>
                {Array.from({ length: SWEET_COUNT }, (_, index) => {
                    const slot = listPosition(index);
                    return (
                        <circle
                            key={`slot-${index}`}
                            cx={slot.x}
                            cy={slot.y}
                            r={LIST_RADIUS}
                            fill="none"
                            stroke={INK_QUIET}
                            strokeWidth="2"
                            strokeDasharray="3 4"
                        />
                    );
                })}
            </g>

            {/* The sweets themselves — each one travels from bag to list. */}
            {Array.from({ length: SWEET_COUNT }, (_, index) => {
                const listedHere = isListed(index);
                const sweetColor = SWEET_COLORS[index % SWEET_COLORS.length];
                const target = listedHere ? listPosition(index) : bagPosition(index);
                const scale = listedHere ? LIST_RADIUS / BAG_RADIUS : 1;
                return (
                    <g
                        key={`sweet-${index}`}
                        opacity={dim(listedHere ? "list" : "bag")}
                        style={EASE_150}
                    >
                        <g
                            style={{
                                ...EASE_MOVE,
                                transform: `translate(${target.x}px, ${target.y}px) scale(${scale})`,
                                cursor: "pointer",
                                touchAction: "none",
                            }}
                            onClick={() => toggle(index)}
                            onPointerEnter={() =>
                                setVar("outcomeBagHighlight", listedHere ? "list" : "bag")
                            }
                            onPointerLeave={() => setVar("outcomeBagHighlight", "")}
                        >
                            <circle r={BAG_RADIUS + 8} fill="transparent" />
                            <circle
                                r={BAG_RADIUS}
                                fill={listedHere ? sweetColor : PAPER_FILL}
                                stroke={sweetColor}
                                strokeWidth="2.5"
                            />
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

function OutcomeListFigure() {
    const setVar = useSetVar();

    return (
        <Figure
            id="listing-outcomes-bag"
            onReset={() => {
                setVar("outcomeListedMask", EMPTY_MASK);
                setVar("outcomeListedCount", 0);
            }}
            caption="Ten sweets sit in the bag. Click a sweet to move it down into the list of possible picks, and click it again to send it back."
        >
            <OutcomeListDrawing />
            <InteractionHintSequence
                hintKey="listing-outcomes-click-sweet"
                steps={[
                    {
                        gesture: "click",
                        label: "Click a sweet to list it",
                        position: { x: "18%", y: "28%" },
                    },
                ]}
            />
        </Figure>
    );
}

// ── Blocks ───────────────────────────────────────────────────────────────────

export const listingOutcomesBlocks: ReactElement[] = [
    <StackLayout key="layout-listing-outcomes-heading" maxWidth="xl">
        <Block id="listing-outcomes-heading" padding="md">
            <EditableH2 id="h2-listing-outcomes-heading" blockId="listing-outcomes-heading">
                Listing Every Outcome
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-listing-outcomes-setup" maxWidth="xl">
        <Block id="listing-outcomes-setup" padding="sm">
            <EditableParagraph id="para-listing-outcomes-setup" blockId="listing-outcomes-setup">
                Before you can talk about chance, you need to know what could happen.
                This bag holds{" "}
                <InlineLinkedHighlight
                    id="link-listing-outcomes-bag"
                    varName="outcomeBagHighlight"
                    highlightId="bag"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("outcomeBagHighlight"))}
                >
                    ten sweets
                </InlineLinkedHighlight>
                , and every single sweet is one thing that could come out. Click each
                sweet to move it into{" "}
                <InlineLinkedHighlight
                    id="link-listing-outcomes-list"
                    varName="outcomeBagHighlight"
                    highlightId="list"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("outcomeBagHighlight"))}
                >
                    your list
                </InlineLinkedHighlight>
                {" "}and watch the count climb.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-listing-outcomes-figure" maxWidth="xl">
        <Block id="listing-outcomes-figure" padding="sm" hasVisualization>
            <OutcomeListFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-listing-outcomes-reflect" maxWidth="xl">
        <Block id="listing-outcomes-reflect" padding="sm">
            <EditableParagraph id="para-listing-outcomes-reflect" blockId="listing-outcomes-reflect">
                Ten sweets, ten possible picks. Every colour in the bag is its own
                outcome, and the list has one place for each of them. That total is the
                number you are about to divide by.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-listing-outcomes-question" maxWidth="xl">
        <Block id="listing-outcomes-question" padding="md">
            <EditableParagraph id="para-listing-outcomes-question" blockId="listing-outcomes-question">
                A different bag holds four mint sweets and three orange ones. If you take
                one sweet without looking, the number of sweets that could come out is{" "}
                <InlineFeedback
                    varName="answerOutcomeTotal"
                    correctValue={["7", "seven"]}
                    position="terminal"
                    successMessage="— yes, seven sweets means seven possible picks"
                    failureMessage="— not yet."
                    hint="Count every sweet in the bag, not just the two flavours"
                    reviewBlockId="listing-outcomes-figure"
                    reviewLabel="Look at the bag again"
                    visualizationHint={{
                        blockId: "listing-outcomes-figure",
                        hintKey: "feedback-listing-outcomes",
                        label: "Try it in the bag",
                        resetVars: { outcomeListedMask: EMPTY_MASK, outcomeListedCount: 0 },
                        steps: [
                            {
                                gesture: "click",
                                label: "Click every sweet in turn and count what lands in the list",
                                position: { x: "18%", y: "28%" },
                                completionVar: "outcomeListedCount",
                                completionValue: 10,
                                completionTolerance: 0.5,
                            },
                        ],
                    }}
                >
                    <InlineClozeInput
                        varName="answerOutcomeTotal"
                        correctAnswer={["7", "seven"]}
                        {...clozePropsFromDefinition(getVariableInfo("answerOutcomeTotal"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
