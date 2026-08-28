/**
 * Section 1 — Chance and Probability (Orient)
 * ===========================================
 * Text only: the hook, the promise, and the fraction skills students already
 * have. No visual and no assessment by design.
 */

import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import { EditableH1, EditableParagraph } from "@/components/atoms";

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
                one is. Probability is the maths of putting a number on it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-chance-promise" maxWidth="xl">
        <Block id="intro-chance-promise" padding="sm">
            <EditableParagraph id="para-intro-chance-promise" blockId="intro-chance-promise">
                By the end of this page you will be able to work out the chance of one
                pick and write it as a fraction, then simplify it or turn it into a
                percentage, exactly as you already do with fractions.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
