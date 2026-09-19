/**
 * Variables Configuration
 * =======================
 * 
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 * 
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 * 
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /**
     * Correct answer for cloze input validation.
     * Accepts a single string, pipe-separated alternates (e.g. "first | 1 | 1st"),
     * or an array of accepted answers (e.g. ["first", "1", "1st"]).
     */
    correctAnswer?: string | string[];
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 * 
 * SUPPORTED TYPES:
 * 
 * 1. NUMBER (slider):
 *    { defaultValue: 5, type: 'number', min: 0, max: 10, step: 1 }
 * 
 * 2. TEXT (free text):
 *    { defaultValue: 'Hello', type: 'text', placeholder: 'Enter text...' }
 * 
 * 3. SELECT (dropdown):
 *    { defaultValue: 'sine', type: 'select', options: ['sine', 'cosine', 'tangent'] }
 * 
 * 4. BOOLEAN (toggle):
 *    { defaultValue: true, type: 'boolean' }
 * 
 * 5. ARRAY (list of numbers):
 *    { defaultValue: [1, 2, 3], type: 'array' }
 * 
 * 6. OBJECT (complex data):
 *    { defaultValue: { x: 5, y: 10 }, type: 'object', schema: '{ x: number, y: number }' }
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ─────────────────────────────────────────
    // SECTION 1 — Chance and Probability
    // ─────────────────────────────────────────
    everydayChance: {
        defaultValue: 'a song on shuffle',
        type: 'select',
        label: 'Everyday chance',
        description: 'An everyday situation the student cycles through in the opening',
        options: ['a song on shuffle', 'a raffle ticket', 'a penalty kick'],
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.18)',
    },

    // ─────────────────────────────────────────
    // SECTION 2 — Listing Every Outcome
    // ─────────────────────────────────────────
    outcomeListedMask: {
        defaultValue: '0000000000',
        type: 'text',
        label: 'Listed sweets',
        description: 'One character per sweet: 1 when that sweet has been moved into the list of possible picks',
    },
    outcomeListedCount: {
        defaultValue: 0,
        type: 'number',
        label: 'Outcomes listed',
        description: 'How many sweets have been listed as possible picks so far',
        min: 0,
        max: 10,
        step: 1,
        color: '#8E90F5',
    },
    outcomeBagHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Outcome figure highlight',
        description: 'Which part of the listing figure is currently highlighted: bag or list',
        color: '#8E90F5',
        bgColor: 'rgba(142, 144, 245, 0.22)',
    },

    // ─────────────────────────────────────────
    // SECTION 3 — Is It Always 50-50?
    // ─────────────────────────────────────────
    guessChance: {
        defaultValue: 0.5,
        type: 'number',
        label: 'Your guess',
        description: 'Where the student predicts the chance of strawberry sits on the 0 to 1 line',
        min: 0,
        max: 1,
        step: 0.05,
        color: '#62D0AD',
    },
    chanceLineStrawberry: {
        defaultValue: 4,
        type: 'number',
        label: 'Strawberry sweets',
        description: 'How many of the ten sweets in the prediction bag are strawberry',
        min: 0,
        max: 10,
        step: 1,
        color: '#F8A0CD',
    },
    chanceLineChecked: {
        defaultValue: 0,
        type: 'number',
        label: 'Guess checked',
        description: 'Set to 1 once the student has revealed the true chance marker',
        min: 0,
        max: 1,
        step: 1,
    },

    // ─────────────────────────────────────────
    // SECTION 4 — Chance as a Fraction
    // ─────────────────────────────────────────
    fractionBagStrawberry: {
        defaultValue: 3,
        type: 'number',
        label: 'Strawberry sweets',
        description: 'How many of the ten sweets in the fraction bag are strawberry',
        min: 0,
        max: 10,
        step: 1,
        color: '#F8A0CD',
    },
    fractionViewHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Fraction pair highlight',
        description: 'Which quantity is highlighted across the bag and the fraction: wanted or total. Its color is the wanted (strawberry) pink; the total uses totalOutcomes',
        color: '#F8A0CD',
        bgColor: 'rgba(248, 160, 205, 0.22)',
    },

    // ─────────────────────────────────────────
    // LESSON-WIDE COLOURS (prose matches the figures)
    // ─────────────────────────────────────────
    strawberrySweets: {
        defaultValue: 'strawberry',
        type: 'spotColor',
        label: 'Strawberry sweets',
        description: 'Colour of the sweets you want (strawberry) and of the true-chance marker in every figure',
        color: '#F8A0CD',
    },
    totalOutcomes: {
        defaultValue: 'total',
        type: 'spotColor',
        label: 'All the sweets in the bag',
        description: 'Colour of the total number of possible outcomes: the listed count, the bracket under the bag and the denominator',
        color: '#8E90F5',
        bgColor: 'rgba(142, 144, 245, 0.22)',
    },

    // ─────────────────────────────────────────
    // ASSESSMENT ANSWERS
    // ─────────────────────────────────────────
    answerOutcomeTotal: {
        defaultValue: '',
        type: 'text',
        label: 'Answer: number of possible outcomes',
        description: 'Student answer for how many sweets could come out of a bag of seven',
        placeholder: '???',
        correctAnswer: ['7', 'seven'],
        color: '#8E90F5',
    },
    answerLikelyCompare: {
        defaultValue: '',
        type: 'select',
        label: 'Answer: comparing two chances',
        description: 'Student answer comparing the chance of red with the chance of blue',
        placeholder: '???',
        correctAnswer: 'less likely than',
        options: ['less likely than', 'just as likely as', 'more likely than'],
        color: '#8E90F5',
    },
    answerAppleFraction: {
        defaultValue: '',
        type: 'text',
        label: 'Answer: chance as a fraction',
        description: 'Student answer for the chance of picking an apple sweet, written as a fraction',
        placeholder: '???',
        correctAnswer: ['3/12', '1/4', '3 out of 12', '3 over 12', '1 out of 4'],
        color: '#8E90F5',
    },
    answerApplePercent: {
        defaultValue: '',
        type: 'text',
        label: 'Answer: chance as a percentage',
        description: 'Extension answer for the same chance written as a percentage',
        placeholder: '???',
        correctAnswer: ['25%', '25', '25 %', '0.25'],
        color: '#62D0AD',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
