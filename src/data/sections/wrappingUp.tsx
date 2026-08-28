/**
 * Section 5 — Wrapping Up (Conclusion)
 * ====================================
 * Text only: the promise kept, the one idea worth carrying away, and where it
 * leads next. No new terms, no new questions.
 */

import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import { EditableH2, EditableParagraph } from "@/components/atoms";

export const wrappingUpBlocks: ReactElement[] = [
    <StackLayout key="layout-wrapping-up-heading" maxWidth="xl">
        <Block id="wrapping-up-heading" padding="md">
            <EditableH2 id="h2-wrapping-up-heading" blockId="wrapping-up-heading">
                Wrapping Up
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-up-idea" maxWidth="xl">
        <Block id="wrapping-up-idea" padding="sm">
            <EditableParagraph id="para-wrapping-up-idea" blockId="wrapping-up-idea">
                A bag of sweets turned out to be a fraction all along. Count the sweets
                you want, count every sweet in the bag, and write the first over the
                second. That is the chance of a single pick.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-up-fifty" maxWidth="xl">
        <Block id="wrapping-up-fifty" padding="sm">
            <EditableParagraph id="para-wrapping-up-fifty" blockId="wrapping-up-fifty">
                The bag you built also settled the fifty-fifty question. A chance is only
                one half when both counts match, and the rest of the time the fraction
                tells you exactly how far from the middle you are.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-up-next" maxWidth="xl">
        <Block id="wrapping-up-next" padding="sm">
            <EditableParagraph id="para-wrapping-up-next" blockId="wrapping-up-next">
                Next comes the question every weather forecast, every card game and every
                bit of sports commentary runs on: what happens to those fractions when
                you take more than one pick.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
