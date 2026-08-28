/**
 * Section 3 — Is It Always 50-50? (Explore, prediction-first)
 * ==========================================================
 * The student commits to a guess before anything is counted: drag the teal
 * marker along the 0 to 1 line, then press Check. The true chance appears in
 * indigo, and the gap between the two markers is drawn. Clicking a sweet
 * changes the bag, so the wrong belief can be tested again and again.
 */

import React, { useRef, useState, type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeChoice,
    InlineFeedback,
    InlineScrubbleNumber,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure } from "@/components/molecules";
import { useVar, useSetVar } from "@/stores";
import { clamp, useSpring } from "@/lib/motion";
import {
    choicePropsFromDefinition,
    getVariableInfo,
    numberPropsFromDefinition,
} from "../variables";

// ── Domain model ─────────────────────────────────────────────────────────────

const SWEET_COUNT = 10;
const DEFAULT_STRAWBERRY = 4;
const DEFAULT_GUESS = 0.5;

/** One formatter for every chance in this figure, the slider and the prose. */
const formatChance = (p: number) => `${Math.round(p * 100)}%`;

// ── View constants ───────────────────────────────────────────────────────────

const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 320;

const SWEET_RADIUS = 18;
const SWEET_FIRST_X = 80;
const SWEET_PITCH = 44;
const SWEET_Y = 76;

const LINE_LEFT = 80;
const LINE_RIGHT = 480;
const LINE_Y = 214;

const INK = "#334155";
const INK_STRUCTURE = "#64748B";
const INK_QUIET = "#CBD5E1";
const PAPER_FILL = "#F1F5F9";
const STRAWBERRY = "#8E90F5";
const GUESS = "#62D0AD";

const sweetX = (index: number) => SWEET_FIRST_X + index * SWEET_PITCH;
const lineX = (p: number) => LINE_LEFT + p * (LINE_RIGHT - LINE_LEFT);

// ── The bespoke drawing ──────────────────────────────────────────────────────

function ChanceLineDrawing() {
    const setVar = useSetVar();
    const guess = useVar<number>("guessChance", DEFAULT_GUESS);
    const strawberry = useVar<number>("chanceLineStrawberry", DEFAULT_STRAWBERRY);
    const checked = useVar<number>("chanceLineChecked", 0) === 1;

    const [dragging, setDragging] = useState(false);
    const [hovered, setHovered] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const trueChance = strawberry / SWEET_COUNT;
    const trueX = useSpring(lineX(trueChance), { stiffness: 180, damping: 20 });
    const handleScale = useSpring(dragging || hovered ? 1.15 : 1, {
        stiffness: 400,
        damping: 26,
    });

    // Direct 1:1 tracking while dragging, snapped to the variable's step.
    const handlePointerMove = (event: React.PointerEvent<SVGCircleElement>) => {
        if (!dragging || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH;
        const raw = (x - LINE_LEFT) / (LINE_RIGHT - LINE_LEFT);
        setVar("guessChance", clamp(Math.round(raw * 20) / 20, 0, 1));
    };

    // Clicking a sweet fills the bag up to that sweet, or empties from it.
    const clickSweet = (index: number) => {
        setVar("chanceLineStrawberry", index < strawberry ? index : index + 1);
    };

    const guessX = lineX(guess);
    const strawberryRunCentre = sweetX((strawberry - 1) / 2);
    const lemonRunCentre = sweetX((strawberry + SWEET_COUNT - 1) / 2);

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full"
            role="img"
            aria-label="Ten sweets above a chance line running from impossible to certain"
        >
            <defs>
                <filter id="fifty-fifty-handle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* The bag, laid out in the open so every sweet is countable. */}
            <text x="32" y="34" fill={INK} fontSize="13" style={{ fontVariantNumeric: "tabular-nums" }}>
                {`The bag: ${strawberry} strawberry, ${SWEET_COUNT - strawberry} lemon`}
            </text>
            {Array.from({ length: SWEET_COUNT }, (_, index) => {
                const isStrawberry = index < strawberry;
                return (
                    <g
                        key={`sweet-${index}`}
                        style={{ cursor: "pointer", touchAction: "none" }}
                        onClick={() => clickSweet(index)}
                    >
                        <circle cx={sweetX(index)} cy={SWEET_Y} r={SWEET_RADIUS + 6} fill="transparent" />
                        <circle
                            cx={sweetX(index)}
                            cy={SWEET_Y}
                            r={SWEET_RADIUS}
                            fill={isStrawberry ? STRAWBERRY : PAPER_FILL}
                            stroke={isStrawberry ? STRAWBERRY : INK_STRUCTURE}
                            strokeWidth="2"
                            style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
                        />
                    </g>
                );
            })}
            {/* Direct labels under each run of sweets — no legend. */}
            {strawberry > 0 && (
                <text x={strawberryRunCentre} y={SWEET_Y + 36} fill={STRAWBERRY} fontSize="12" textAnchor="middle">
                    strawberry
                </text>
            )}
            {strawberry < SWEET_COUNT && (
                <text x={lemonRunCentre} y={SWEET_Y + 36} fill={INK_STRUCTURE} fontSize="12" textAnchor="middle">
                    lemon
                </text>
            )}

            {/* The chance line: impossible on the left, certain on the right. */}
            <line
                x1={LINE_LEFT}
                y1={LINE_Y}
                x2={LINE_RIGHT}
                y2={LINE_Y}
                stroke={INK_STRUCTURE}
                strokeWidth="2"
                strokeLinecap="round"
            />
            {[0, 0.5, 1].map((tick) => (
                <line
                    key={tick}
                    x1={lineX(tick)}
                    y1={LINE_Y - 6}
                    x2={lineX(tick)}
                    y2={LINE_Y + 6}
                    stroke={INK_QUIET}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            ))}
            <text x={LINE_LEFT} y={LINE_Y + 26} fill={INK_STRUCTURE} fontSize="11" textAnchor="middle">
                impossible
            </text>
            <text x={lineX(0.5)} y={LINE_Y + 26} fill={INK_STRUCTURE} fontSize="11" textAnchor="middle">
                even chance
            </text>
            <text x={LINE_RIGHT} y={LINE_Y + 26} fill={INK_STRUCTURE} fontSize="11" textAnchor="middle">
                certain
            </text>

            {/* The gap between guess and truth, drawn only once revealed. */}
            {checked && Math.abs(guessX - trueX) > 1 && (
                <line
                    x1={guessX}
                    y1={LINE_Y - 34}
                    x2={trueX}
                    y2={LINE_Y - 34}
                    stroke={INK_QUIET}
                    strokeWidth="2"
                    strokeDasharray="4 5"
                    strokeLinecap="round"
                />
            )}

            {/* The true chance — appears in indigo, the strawberry colour. */}
            {checked && (
                <g style={{ transition: "opacity 200ms ease" }}>
                    <line
                        x1={trueX}
                        y1={LINE_Y - 34}
                        x2={trueX}
                        y2={LINE_Y + 4}
                        stroke={STRAWBERRY}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <circle cx={trueX} cy={LINE_Y - 34} r="7" fill={STRAWBERRY} />
                </g>
            )}

            {/* The student's own guess — the one draggable thing on the line. */}
            <g transform={`translate(${guessX} ${LINE_Y}) scale(${handleScale})`}>
                <circle r="13" fill={GUESS} filter="url(#fifty-fifty-handle-shadow)" />
            </g>
            <circle
                cx={guessX}
                cy={LINE_Y}
                r="24"
                fill="transparent"
                style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
                onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDragging(true);
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDragging(false)}
                onPointerCancel={() => setDragging(false)}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
            />

            {/* Readouts, both in the same format. */}
            <text x="32" y={286} fill={GUESS} fontSize="13" style={{ fontVariantNumeric: "tabular-nums" }}>
                {`Your guess: ${formatChance(guess)}`}
            </text>
            <text
                x={VIEW_WIDTH - 32}
                y={286}
                fill={checked ? STRAWBERRY : INK_QUIET}
                fontSize="13"
                textAnchor="end"
                style={{ fontVariantNumeric: "tabular-nums" }}
            >
                {checked
                    ? `True chance: ${strawberry} out of ${SWEET_COUNT} = ${formatChance(trueChance)}`
                    : "True chance: hidden until you check"}
            </text>
        </svg>
    );
}

function ChanceLineFigure() {
    const setVar = useSetVar();
    const checked = useVar<number>("chanceLineChecked", 0) === 1;

    return (
        <Figure
            id="fifty-fifty-chance-line"
            onReset={() => {
                setVar("guessChance", DEFAULT_GUESS);
                setVar("chanceLineStrawberry", DEFAULT_STRAWBERRY);
                setVar("chanceLineChecked", 0);
            }}
            caption="Drag the teal marker to where you think the chance of strawberry sits, then check it. Clicking a sweet changes the bag."
        >
            <ChanceLineDrawing />
            <div className="flex justify-center px-6 pb-5">
                <button
                    type="button"
                    onClick={() => setVar("chanceLineChecked", 1)}
                    disabled={checked}
                    className="rounded-lg border border-slate-200 px-4 py-1.5 text-[13px] text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                    {checked ? "True chance shown" : "Check my guess"}
                </button>
            </div>
            <InteractionHintSequence
                hintKey="fifty-fifty-drag-guess"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the teal marker along the line",
                        position: { x: "50%", y: "67%" },
                        dragPath: {
                            type: "line",
                            startOffset: { x: -30, y: 0 },
                            endOffset: { x: 30, y: 0 },
                        },
                    },
                ]}
            />
        </Figure>
    );
}

// ── Blocks ───────────────────────────────────────────────────────────────────

export const fiftyFiftyBlocks: ReactElement[] = [
    <StackLayout key="layout-fifty-fifty-heading" maxWidth="xl">
        <Block id="fifty-fifty-heading" padding="md">
            <EditableH2 id="h2-fifty-fifty-heading" blockId="fifty-fifty-heading">
                Is It Always 50-50?
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-fifty-fifty-setup" maxWidth="xl">
        <Block id="fifty-fifty-setup" padding="sm">
            <EditableParagraph id="para-fifty-fifty-setup" blockId="fifty-fifty-setup">
                Here is the same bag, opened up: four strawberry sweets and six lemon
                ones. Before you count anything, drag the teal marker to where you think
                the chance of pulling out a strawberry sits, then check it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-fifty-fifty-figure" maxWidth="xl">
        <Block id="fifty-fifty-figure" padding="sm" hasVisualization>
            <ChanceLineFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-fifty-fifty-reflect" maxWidth="xl">
        <Block id="fifty-fifty-reflect" padding="sm">
            <EditableParagraph id="para-fifty-fifty-reflect" blockId="fifty-fifty-reflect">
                Your marker is sitting at{" "}
                <InlineScrubbleNumber
                    varName="guessChance"
                    {...numberPropsFromDefinition(getVariableInfo("guessChance"))}
                    formatValue={(value) => `${Math.round(value * 100)}%`}
                />
                , and the true chance is the indigo marker. Two possible flavours do not
                mean two equal chances. Click any sweet to change the bag, and the
                indigo marker moves at once.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-fifty-fifty-question" maxWidth="xl">
        <Block id="fifty-fifty-question" padding="md">
            <EditableParagraph id="para-fifty-fifty-question" blockId="fifty-fifty-question">
                A bag holds two red counters and eight blue ones. Taking a red counter is{" "}
                <InlineFeedback
                    varName="answerLikelyCompare"
                    correctValue="less likely than"
                    position="mid"
                    successMessage="✓"
                    failureMessage="✗"
                    hint="There are far fewer reds, so red and blue cannot share the chance evenly"
                    visualizationHint={{
                        blockId: "fifty-fifty-figure",
                        hintKey: "feedback-fifty-fifty",
                        label: "Try it in the bag",
                        resetVars: { chanceLineStrawberry: 4, guessChance: 0.5, chanceLineChecked: 0 },
                        steps: [
                            {
                                gesture: "click",
                                label: "Click sweets until only two are indigo",
                                position: { x: "24%", y: "24%" },
                                completionVar: "chanceLineStrawberry",
                                completionValue: 2,
                                completionTolerance: 0.5,
                            },
                            {
                                gesture: "click",
                                label: "Now check the guess and read where the indigo marker lands",
                                position: { x: "50%", y: "88%" },
                                completionVar: "chanceLineChecked",
                                completionValue: 1,
                                completionTolerance: 0.5,
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answerLikelyCompare"
                        correctAnswer="less likely than"
                        options={["less likely than", "just as likely as", "more likely than"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerLikelyCompare"))}
                    />
                </InlineFeedback>{" "}
                taking a blue one.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
