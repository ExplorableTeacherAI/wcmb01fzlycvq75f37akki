/**
 * Section 1 — Chance and Probability (Orient)
 * ===========================================
 * Text only: the hook, the promise, and the fraction skills students already
 * have. No visual and no assessment by design.
 */

import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import { EditableH1, EditableParagraph, InlineToggle, InlineTooltip } from "@/components/atoms";
import { useVar } from "@/stores";
import { getVariableInfo, togglePropsFromDefinition } from "../variables";

/** The clause that follows whichever everyday situation is showing. */
function EverydayChanceClause() {
    const situation = useVar<string>("everydayChance", "a song on shuffle");
    if (situation === "a raffle ticket") {
        return <span>is worth more the more tickets you hold.</span>;
    }
    if (situation === "a penalty kick") {
        return <span>is never really fifty-fifty, whatever the commentator says.</span>;
    }
    return <span>gives every track the same chance of being next.</span>;
}

export const introChanceBlocks: ReactElement[] = [
    <StackLayout key="layout-intro-chance-title" maxWidth="xl">
        <Block id="intro-chance-title" padding="md">
            <EditableH1 id="h1-intro-chance-title" blockId="intro-chance-title">
                Chance and Probability
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-chance-hook" maxWidth="xl">
        <Block id="intro-chance-hook" padding="sm">
            <EditableParagraph id="para-intro-chance-hook" blockId="intro-chance-hook">
                There is a bag of mixed sweets on the canteen counter. You cannot see
                inside it. You reach in, pull one out without looking, and until your
                hand opens nobody in the room knows which flavour you got.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-chance-idea" maxWidth="xl">
        <Block id="intro-chance-idea" padding="sm">
            <EditableParagraph id="para-intro-chance-idea" blockId="intro-chance-idea">
                That does not mean every flavour has the same chance. Some flavours are
                packed into the bag more than others, and that changes how likely each
                one is.{" "}
                <InlineTooltip
                    id="tooltip-intro-chance-probability"
                    tooltip="A number from 0 to 1 (or 0% to 100%) that says how likely something is to happen."
                >
                    Probability
                </InlineTooltip>
                {" "}is the maths of putting a number on it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-chance-promise" maxWidth="xl">
        <Block id="intro-chance-promise" padding="sm">
            <EditableParagraph id="para-intro-chance-promise" blockId="intro-chance-promise">
                Chance runs through the rest of your day as well:{" "}
                <InlineToggle
                    id="toggle-intro-everyday-chance"
                    varName="everydayChance"
                    options={["a song on shuffle", "a raffle ticket", "a penalty kick"]}
                    {...togglePropsFromDefinition(getVariableInfo("everydayChance"))}
                />
                {" "}<EverydayChanceClause /> By the end of this page you will be able to
                work out the chance of one pick and write it as a fraction, then{" "}
                <InlineTooltip
                    id="tooltip-intro-chance-simplify"
                    tooltip="Rewrite a fraction with smaller numbers that mean the same amount, such as 2/4 written as 1/2."
                >
                    simplify
                </InlineTooltip>
                {" "}it or turn it into a percentage.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
