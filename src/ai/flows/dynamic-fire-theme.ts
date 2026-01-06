'use server';

/**
 * @fileOverview A flow that dynamically adjusts the website theme based on fire detection, using generative AI.
 *
 * - generateFireTheme - A function that generates a fire-themed style or reverts to the normal theme.
 * - DynamicFireThemeInput - The input type for the generateFireTheme function.
 * - DynamicFireThemeOutput - The return type for the generateFireTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicFireThemeInputSchema = z.object({
  fireDetected: z
    .boolean()
    .describe('Indicates whether a fire has been detected or not.'),
  environmentalData: z
    .string()
    .optional()
    .describe(
      'Optional environmental data that can be used to determine the validity of the fire detection.'
    ),
});
export type DynamicFireThemeInput = z.infer<typeof DynamicFireThemeInputSchema>;

const DynamicFireThemeOutputSchema = z.object({
  themeStyle: z
    .string()
    .describe(
      'A CSS style string that represents either the fire theme or the normal theme.'
    ),
  alertDismissed: z
    .boolean()
    .describe(
      'A boolean value indicating if the alert has been dismissed based on environmental factors.'
    ),
});
export type DynamicFireThemeOutput = z.infer<typeof DynamicFireThemeOutputSchema>;

export async function generateFireTheme(
  input: DynamicFireThemeInput
): Promise<DynamicFireThemeOutput> {
  return dynamicFireThemeFlow(input);
}

const fireThemePrompt = ai.definePrompt({
  name: 'fireThemePrompt',
  input: {schema: DynamicFireThemeInputSchema},
  output: {schema: DynamicFireThemeOutputSchema},
  prompt: `You are a theme generator for a fire response website. Based on whether a fire is detected and environmental data, generate a CSS style string to apply a fire theme or a normal theme.

If fireDetected is true, generate a CSS style string that uses the following styles:
--primary-color: #C70039;
--background-color: #222222;
--accent-color: #FFC300;
color: white;

If fireDetected is false, generate a CSS style string that uses the following styles:
--primary-color: #C70039;
--background-color: #EEEEEE;
--accent-color: #FFC300;
color: black;

If environmentalData indicates a false alarm (e.g., system test, sensor malfunction), set alertDismissed to true and generate the normal theme. Otherwise set alertDismissed to false.

Here is the fire detection status: {{{fireDetected}}}
Here is the environmental data: {{{environmentalData}}}

Return a JSON object including a CSS style string named 'themeStyle' and a boolean for alertDismissed.
`,
});

const dynamicFireThemeFlow = ai.defineFlow(
  {
    name: 'dynamicFireThemeFlow',
    inputSchema: DynamicFireThemeInputSchema,
    outputSchema: DynamicFireThemeOutputSchema,
  },
  async input => {
    const {output} = await fireThemePrompt(input);
    return output!;
  }
);
