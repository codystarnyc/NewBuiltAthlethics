import { env } from '../../config/env';
import { getTextModel } from '../../config/gemini';
import { getOpenAI } from '../../config/openai';
import type { MealPlanRequest, GeneratedMealPlan } from '../../types';

const SYSTEM_PROMPT = `You are a professional nutritionist AI following the FuelTrack PFC protocol.
Generate a detailed meal plan as JSON with this structure:
{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast|lunch|dinner|snack",
          "name": "Meal name",
          "description": "Brief description",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "ingredients": [{ "name": "...", "amount": "..." }],
          "instructions": ["step 1", "step 2"],
          "prepTimeMinutes": number,
          "pfcOrder": ["protein source first", "fat source second", "carb source last"],
          "insulinScore": number (1-10, lower is better for blood sugar stability)
        }
      ],
      "totals": { "calories": number, "protein": number, "carbs": number, "fat": number }
    }
  ],
  "summary": { "avgCalories": number, "avgProtein": number, "avgCarbs": number, "avgFat": number }
}

CRITICAL PFC SEQUENCING RULES:
- Structure each meal to prioritize protein first, then fats, then carbohydrates.
- List ingredients and instructions in PFC eating order.
- Include the recommended eating order in the pfcOrder field.
- Favor low glycemic index carbohydrate sources to minimize insulin spikes.
- Each meal should include a protein anchor (30%+ of meal calories from protein).

Meals must be practical, varied day-to-day, and hit the calorie/macro targets.
Return ONLY valid JSON, no markdown.`;

export async function generateMealPlan(request: MealPlanRequest): Promise<GeneratedMealPlan> {
  const daysCount = request.daysCount ?? 7;
  const mealsPerDay = request.mealsPerDay ?? 3;

  const constraints: string[] = [];
  if (request.diet) constraints.push(`Diet type: ${request.diet}`);
  if (request.allergies?.length) constraints.push(`Allergies: ${request.allergies.join(', ')}`);
  if (request.excludedIngredients?.length) constraints.push(`Excluded ingredients: ${request.excludedIngredients.join(', ')}`);
  if (request.ingredients?.length) constraints.push(`Available ingredients to prioritize: ${request.ingredients.join(', ')}`);

  const macroTargets = [
    `Daily calorie target: ${request.calorieTarget} kcal`,
    request.proteinTarget ? `Protein target: ${request.proteinTarget}g` : null,
    request.carbsTarget ? `Carbs target: ${request.carbsTarget}g` : null,
    request.fatTarget ? `Fat target: ${request.fatTarget}g` : null,
  ].filter(Boolean).join('\n');

  const userPrompt = `Generate a ${daysCount}-day meal plan with ${mealsPerDay} meals per day.

${macroTargets}

${constraints.length > 0 ? 'Constraints:\n' + constraints.join('\n') : 'No specific dietary constraints.'}`;

  if (env.visionProvider === 'gemini' && env.gemini.apiKey) {
    const model = getTextModel();
    const result = await model.generateContent([
      SYSTEM_PROMPT + '\n\n' + userPrompt,
    ]);

    const content = result.response.text();
    if (!content) throw new Error('No response from Gemini meal plan generation');
    return JSON.parse(content) as GeneratedMealPlan;
  }

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 8000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI meal plan generation');
  return JSON.parse(content) as GeneratedMealPlan;
}
