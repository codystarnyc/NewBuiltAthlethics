import { openai } from '../../config/openai';
import type { MealPlanRequest, GeneratedMealPlan } from '../../types';

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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a professional nutritionist AI. Generate a detailed meal plan as JSON with this structure:
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
          "prepTimeMinutes": number
        }
      ],
      "totals": { "calories": number, "protein": number, "carbs": number, "fat": number }
    }
  ],
  "summary": { "avgCalories": number, "avgProtein": number, "avgCarbs": number, "avgFat": number }
}
Meals must be practical, varied day-to-day, and hit the calorie/macro targets.
Return ONLY valid JSON, no markdown.`,
      },
      {
        role: 'user',
        content: `Generate a ${daysCount}-day meal plan with ${mealsPerDay} meals per day.

${macroTargets}

${constraints.length > 0 ? 'Constraints:\n' + constraints.join('\n') : 'No specific dietary constraints.'}`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 8000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from meal plan generation');

  return JSON.parse(content) as GeneratedMealPlan;
}
