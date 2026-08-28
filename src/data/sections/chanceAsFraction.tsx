/**
 * Section 4 — Chance as a Fraction (Explore, goal-directed linked pair)
 * ====================================================================
 * A LINKED PAIR: the bag of sweets (concrete) beside the fraction it produces
 * (abstract). Both drawings read `fractionBagStrawberry` — nothing else joins
 * them — and both are clickable, so the student can work from either side.
 * `fractionViewHighlight` solves the correspondence problem: hovering the
 * strawberry sweets, the numerator, or the phrase in the prose pops all three
 * while everything else recedes. The visible tie is the shared cell pitch: the
 * ten sweets and the ten bar cells sit at identical x positions and spacing.
 */

import { type ReactElement } from "react";
import { SplitLayout, StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineFeedback,
    InlineLinkedHighlight,
    InlineScrubbleNumber,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure, FigureSlider, FormulaBlock } from "@/components/molecules";
import { useVar, useSetVar } from "@/stores";
import {
    clozePropsFromDefinition,
    getVariableInfo,
    linkedHighlightPropsFromDefinition,
    numberPropsFromDefinition,
} from "../variables";

// ── Domain model ─────────────────────────────────────────────────────────────

const SWEET_COUNT = 10;
const DEFAULT_STRAWBERRY = 3;
const TARGET_STRAWBERRY = 5; // the one bag out of ten that really is fifty-fifty

const greatestCommonDivisor = (a: number, b: number): number =>
    b === 0 ? a : greatestCommonDivisor(b, a % b);

const formatChance = (p: number) => `${Math.round(p * 100)}%`;

// ── Shared view geometry — THE VISIBLE TIE ───────────────────────────────────
// Both figures use the same width, the same first x and the same pitch, so the
// nth sweet and the nth bar cell sit at exactly the same place across the pair.

const VIEW_WIDTH = 360;
const VIEW_HEIGHT = 220;
const CELL_FIRST_X = 50;
const CELL_PITCH = 30;
const PAD = 24;

const cellX = (index: number) => CELL_FIRST_X + index * CELL_PITCH;

const SWEET_RADIUS = 13;
const SWEET_Y = 100;
const BAR_TOP = 62;
const BAR_HEIGHT = 26;
const BAR_CELL_WIDTH = 28;

const INK = "#334155";
const INK_STRUCTURE = "#64748B";
const INK_QUIET = "#CBD5E1";
const PAPER_FILL = "#F1F5F9";
const ACCENT = "#8E90F5";
const SUCCESS = "#22c55e";

const EASE_150 = { transition: "opacity 150ms ease, stroke-width 150ms ease" } as const;

// ── The shared highlight channel (the correspondence problem, solved) ────────

const useFractionHighlight = () => {
    const highlight = useVar<string>("fractionViewHighlight", "");
    const setVar = useSetVar();

    /** Groups: 'wanted' sweets, 'rest' sweets, 'wantedLabel', 'total'. */
    const opacity = (group: string) => {
        if (!highlight) return 1;
        if (highlight === "wanted") {
            return group === "wanted" || group === "wantedLabel" ? 1 : 0.35;
        }
        return group === "wantedLabel" ? 0.35 : 1;
    };

    return {
        highlight,
        opacity,
        isActive: (group: string) => highlight === group,
        hoverProps: (group: string) => ({
            onPointerEnter: () => setVar("fractionViewHighlight", group),
            onPointerLeave: () => setVar("fractionViewHighlight", ""),
        }),
    };
};

/** Clicking cell `index` fills the bag up to it, or empties from it. */
const useFillBag = () => {
    const setVar = useSetVar();
    const strawberry = useVar<number>("fractionBagStrawberry", DEFAULT_STRAWBERRY);
    return (index: number) =>
        setVar("fractionBagStrawberry", index < strawberry ? index : index + 1);
};

// ── View A: the bag (concrete) ───────────────────────────────────────────────

function FractionBagDrawing() {
    const strawberry = useVar<number>("fractionBagStrawberry", DEFAULT_STRAWBERRY);
    const { opacity, isActive, hoverProps } = useFractionHighlight();
    const fillTo = useFillBag();

    return (
        <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full"
            role="img"
            aria-label="Ten sweets in a row, some of them strawberry"
        >
            <text x={PAD} y="36" fill={INK} fontSize="13">
                The bag
            </text>

            {Array.from({ length: SWEET_COUNT }, (_, index) => {
                const isStrawberry = index < strawberry;
                const group = isStrawberry ? "wanted" : "rest";
                return (
                    <g
                        key={`sweet-${index}`}
                        opacity={opacity(group)}
                        style={{ ...EASE_150, cursor: "pointer", touchAction: "none" }}
                        onClick={() => fillTo(index)}
                        {...hoverProps(group === "wanted" ? "wanted" : "total")}
                    >
                        <circle cx={cellX(index)} cy={SWEET_Y} r={SWEET_RADIUS + 7} fill="transparent" />
                        {isStrawberry && isActive("wanted") && (
                            <circle cx={cellX(index)} cy={SWEET_Y} r={SWEET_RADIUS + 4} fill={ACCENT} opacity={0.28} />
                        )}
                        <circle
                            cx={cellX(index)}
                            cy={SWEET_Y}
                            r={SWEET_RADIUS}
                            fill={isStrawberry ? ACCENT : PAPER_FILL}
                            stroke={isStrawberry ? ACCENT : INK_STRUCTURE}
                            strokeWidth={isStrawberry && isActive("wanted") ? 3 : 2}
                            style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
                        />
                    </g>
                );
            })}

            {/* Bracket under the whole row — the counterpart of the denominator. */}
            <g opacity={opacity("total")} style={EASE_150} {...hoverProps("total")}>
                {isActive("total") && (
                    <path
                        d={`M ${cellX(0) - 14} 124 L ${cellX(0) - 14} 130 L ${cellX(SWEET_COUNT - 1) + 14} 130 L ${cellX(SWEET_COUNT - 1) + 14} 124`}
                        fill="none"
                        stroke={INK_STRUCTURE}
                        strokeWidth="8"
                        opacity={0.28}
                        strokeLinecap="round"
                    />
                )}
                <path
                    d={`M ${cellX(0) - 14} 124 L ${cellX(0) - 14} 130 L ${cellX(SWEET_COUNT - 1) + 14} 130 L ${cellX(SWEET_COUNT - 1) + 14} 124`}
                    fill="none"
                    stroke={INK_STRUCTURE}
                    strokeWidth={isActive("total") ? 3 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text
                    x={VIEW_WIDTH - PAD}
                    y="160"
                    fill={INK}
                    fontSize="12"
                    textAnchor="end"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {`${SWEET_COUNT} sweets in the bag`}
                </text>
            </g>

            <text
                x={PAD}
                y="160"
                fill={ACCENT}
                fontSize="12"
                opacity={opacity("wantedLabel")}
                style={{ ...EASE_150, fontVariantNumeric: "tabular-nums" }}
            >
                {`${strawberry} strawberry`}
            </text>
        </svg>
    );
}

function FractionBagFigure() {
    const setVar = useSetVar();

    return (
        <Figure
            id="chance-fraction-bag"
            onReset={() => setVar("fractionBagStrawberry", DEFAULT_STRAWBERRY)}
            caption="Click a sweet to change how many are strawberry."
        >
            <FractionBagDrawing />
            <div className="px-6 pb-5">
                <FigureSlider
                    varName="fractionBagStrawberry"
                    label="Strawberry sweets"
                    {...numberPropsFromDefinition(getVariableInfo("fractionBagStrawberry"))}
                    formatValue={(value) => `${value} of ${SWEET_COUNT}`}
                />
            </div>
            <InteractionHintSequence
                hintKey="chance-fraction-click-sweet"
                steps={[
                    {
                        gesture: "click",
                        label: "Click a sweet to change the bag",
                        position: { x: "14%", y: "45%" },
                    },
                ]}
            />
        </Figure>
    );
}

// ── View B: the fraction (abstract) ──────────────────────────────────────────

function FractionValueDrawing() {
    const strawberry = useVar<number>("fractionBagStrawberry", DEFAULT_STRAWBERRY);
    const { opacity, isActive, hoverProps } = useFractionHighlight();
    const fillTo = useFillBag();

    const divisor = strawberry === 0 ? SWEET_COUNT : greatestCommonDivisor(strawberry, SWEET_COUNT);
    const simplified = `${strawberry / divisor}/${SWEET_COUNT / divisor}`;
    const percent = formatChance(strawberry / SWEET_COUNT);
    const showsSimplified = divisor > 1 && strawberry > 0 && strawberry < SWEET_COUNT;
    const rightHandSide = showsSimplified ? `= ${simplified} = ${percent}` : `= ${percent}`;

    return (
        <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full"
            role="img"
            aria-label="A bar of ten cells and the fraction it produces"
        >
            <text x={PAD} y="36" fill={INK} fontSize="13">
                The chance of strawberry
            </text>

            {/* The bar: ten cells at the same pitch as the ten sweets. */}
            {Array.from({ length: SWEET_COUNT }, (_, index) => {
                const isFilled = index < strawberry;
                const group = isFilled ? "wanted" : "rest";
                return (
                    <g
                        key={`cell-${index}`}
                        opacity={opacity(group)}
                        style={{ ...EASE_150, cursor: "pointer", touchAction: "none" }}
                        onClick={() => fillTo(index)}
                        {...hoverProps(isFilled ? "wanted" : "total")}
                    >
                        <rect
                            x={cellX(index) - BAR_CELL_WIDTH / 2}
                            y={BAR_TOP}
                            width={BAR_CELL_WIDTH}
                            height={BAR_HEIGHT}
                            rx="4"
                            fill={isFilled ? ACCENT : PAPER_FILL}
                            stroke={isFilled ? ACCENT : INK_STRUCTURE}
                            strokeWidth={isFilled && isActive("wanted") ? 3 : 2}
                            style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
                        />
                    </g>
                );
            })}

            {/* The fraction itself: numerator and denominator are the two groups. */}
            <g opacity={opacity("wanted")} style={EASE_150} {...hoverProps("wanted")}>
                <text
                    x="104"
                    y="150"
                    fill={ACCENT}
                    fontSize="26"
                    textAnchor="middle"
                    fontWeight={isActive("wanted") ? 700 : 500}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {strawberry}
                </text>
            </g>
            <line x1="74" y1="160" x2="134" y2="160" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            <g opacity={opacity("total")} style={EASE_150} {...hoverProps("total")}>
                <text
                    x="104"
                    y="192"
                    fill={INK}
                    fontSize="26"
                    textAnchor="middle"
                    fontWeight={isActive("total") ? 700 : 500}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {SWEET_COUNT}
                </text>
            </g>

            <text
                x="152"
                y="170"
                fill={INK}
                fontSize="18"
                style={{ fontVariantNumeric: "tabular-nums" }}
            >
                {rightHandSide}
            </text>

            {strawberry === TARGET_STRAWBERRY && (
                <text x={PAD} y="212" fill={SUCCESS} fontSize="12">
                    That one really is fifty-fifty.
                </text>
            )}

            {/* Quiet guide tying the bar to the fraction below it. */}
            <line
                x1={cellX(0) - BAR_CELL_WIDTH / 2}
                y1={BAR_TOP + BAR_HEIGHT + 8}
                x2={cellX(SWEET_COUNT - 1) + BAR_CELL_WIDTH / 2}
                y2={BAR_TOP + BAR_HEIGHT + 8}
                stroke={INK_QUIET}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function FractionValueFigure() {
    const setVar = useSetVar();

    return (
        <Figure
            id="chance-fraction-value"
            onReset={() => setVar("fractionBagStrawberry", DEFAULT_STRAWBERRY)}
            caption="The same bag written as a fraction. Clicking a cell changes the bag too."
        >
            <FractionValueDrawing />
            <InteractionHintSequence
                hintKey="chance-fraction-click-cell"
                steps={[
                    {
                        gesture: "click",
                        label: "Click a cell to fill it",
                        position: { x: "14%", y: "34%" },
                    },
                ]}
            />
        </Figure>
    );
}

/** The same fraction, read out for a real class raffle. */
function RaffleReadout() {
    const strawberry = useVar<number>("fractionBagStrawberry", DEFAULT_STRAWBERRY);
    const divisor = strawberry === 0 ? SWEET_COUNT : greatestCommonDivisor(strawberry, SWEET_COUNT);
    const simplified = `${strawberry / divisor}/${SWEET_COUNT / divisor}`;
    return (
        <span style={{ color: ACCENT, fontVariantNumeric: "tabular-nums" }}>
            {`${strawberry} out of ${SWEET_COUNT}, or ${simplified}, or ${formatChance(strawberry / SWEET_COUNT)}`}
        </span>
    );
}

// ── Blocks ───────────────────────────────────────────────────────────────────

export const chanceAsFractionBlocks: ReactElement[] = [
    <StackLayout key="layout-chance-fraction-heading" maxWidth="xl">
        <Block id="chance-fraction-heading" padding="md">
            <EditableH2 id="h2-chance-fraction-heading" blockId="chance-fraction-heading">
                Chance as a Fraction
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-chance-fraction-setup" maxWidth="xl">
        <Block id="chance-fraction-setup" padding="sm">
            <EditableParagraph id="para-chance-fraction-setup" blockId="chance-fraction-setup">
                The chance of a pick is{" "}
                <InlineLinkedHighlight
                    id="link-chance-fraction-wanted"
                    varName="fractionViewHighlight"
                    highlightId="wanted"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("fractionViewHighlight"))}
                >
                    the sweets you want
                </InlineLinkedHighlight>
                {" "}over{" "}
                <InlineLinkedHighlight
                    id="link-chance-fraction-total"
                    varName="fractionViewHighlight"
                    highlightId="total"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("fractionViewHighlight"))}
                >
                    all the sweets in the bag
                </InlineLinkedHighlight>
                . Right now{" "}
                <InlineScrubbleNumber
                    varName="fractionBagStrawberry"
                    {...numberPropsFromDefinition(getVariableInfo("fractionBagStrawberry"))}
                />
                {" "}of the ten are strawberry. Click the sweets and the fraction beside
                them rewrites itself.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-chance-fraction-pair" ratio="1:1" gap="lg" align="start">
        <Block id="chance-fraction-bag" padding="sm" hasVisualization>
            <FractionBagFigure />
        </Block>
        <Block id="chance-fraction-value" padding="sm" hasVisualization>
            <FractionValueFigure />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-chance-fraction-formula" maxWidth="xl">
        <Block id="chance-fraction-formula" padding="lg">
            <FormulaBlock
                latex="P(\text{strawberry}) = \frac{\highlight{wanted}{\text{sweets you want}}}{\highlight{total}{\text{sweets in the bag}}}"
                linkedHighlights={{
                    wanted: {
                        varName: "fractionViewHighlight",
                        color: "#8E90F5",
                        bgColor: "rgba(142, 144, 245, 0.22)",
                    },
                    total: {
                        varName: "fractionViewHighlight",
                        color: "#64748B",
                        bgColor: "rgba(100, 116, 139, 0.18)",
                    },
                }}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-chance-fraction-challenge" maxWidth="xl">
        <Block id="chance-fraction-challenge" padding="sm">
            <EditableParagraph id="para-chance-fraction-challenge" blockId="chance-fraction-challenge">
                Here is the challenge: build the bag where the chance of strawberry is
                exactly one half. With ten sweets there is only one way to do it. That is
                the only bag where fifty-fifty is the honest answer.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-chance-fraction-raffle" maxWidth="xl">
        <Block id="chance-fraction-raffle" padding="sm">
            <EditableParagraph id="para-chance-fraction-raffle" blockId="chance-fraction-raffle">
                Swap the sweets for a class raffle. Ten tickets go into the hat and you
                hold{" "}
                <InlineScrubbleNumber
                    varName="fractionBagStrawberry"
                    {...numberPropsFromDefinition(getVariableInfo("fractionBagStrawberry"))}
                />
                {" "}of them, so your chance of hearing your own name is <RaffleReadout />.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-chance-fraction-question-core" maxWidth="xl">
        <Block id="chance-fraction-question-core" padding="md">
            <EditableParagraph id="para-chance-fraction-question-core" blockId="chance-fraction-question-core">
                A bag holds three apple sweets and nine grape ones. Written as a fraction,
                the chance of picking an apple sweet is{" "}
                <InlineFeedback
                    varName="answerAppleFraction"
                    correctValue={["3/12", "1/4", "3 out of 12", "3 over 12", "1 out of 4"]}
                    position="terminal"
                    successMessage="— yes, three apples out of twelve sweets altogether, which is one quarter"
                    failureMessage="— not yet."
                    hint="The top number is the sweets you want, the bottom is every sweet in the bag"
                    reviewBlockId="chance-fraction-formula"
                    reviewLabel="Look at the rule again"
                    visualizationHint={{
                        blockId: "chance-fraction-bag",
                        hintKey: "feedback-chance-fraction",
                        label: "Try it in the bag",
                        resetVars: { fractionBagStrawberry: 3 },
                        steps: [
                            {
                                gesture: "click",
                                label: "Click until three sweets are indigo, then read the fraction beside them",
                                position: { x: "14%", y: "45%" },
                                completionVar: "fractionBagStrawberry",
                                completionValue: 3,
                                completionTolerance: 0.5,
                            },
                        ],
                    }}
                >
                    <InlineClozeInput
                        varName="answerAppleFraction"
                        correctAnswer={["3/12", "1/4", "3 out of 12", "3 over 12", "1 out of 4"]}
                        {...clozePropsFromDefinition(getVariableInfo("answerAppleFraction"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-chance-fraction-question-extension" maxWidth="xl">
        <Block id="chance-fraction-question-extension" padding="md">
            <EditableParagraph id="para-chance-fraction-question-extension" blockId="chance-fraction-question-extension">
                Going further with that same bag of twelve, the chance of an apple sweet
                written as a percentage is{" "}
                <InlineFeedback
                    varName="answerApplePercent"
                    correctValue={["25%", "25", "25 %", "0.25"]}
                    position="terminal"
                    successMessage="— one quarter of the bag, so a quarter of a hundred"
                    failureMessage="— close, keep going."
                    hint="Simplify the fraction first, then turn that quarter into hundredths"
                >
                    <InlineClozeInput
                        varName="answerApplePercent"
                        correctAnswer={["25%", "25", "25 %", "0.25"]}
                        {...clozePropsFromDefinition(getVariableInfo("answerApplePercent"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
