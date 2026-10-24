/**
 * Service to request recipe suggestions using the Hugging Face Inference API.
 * Uses Mistral-7B-Instruct-v0.2/v0.3 or custom fallback if key is missing/limited.
 */

const SYSTEM_PROMPT = `You are Chef Claude, an expert, enthusiastic, and friendly culinary master.
You are given a list of available ingredients. Your task is to recommend a delicious, realistic recipe that primarily utilizes those ingredients, along with common pantry essentials (salt, pepper, olive oil, water, butter, basic spices).
Format your response cleanly in Markdown:
- Recipe Title as a header (# Title)
- Brief enticing description
- Prep & Cook Time, Servings
- Ingredients checklist (- item)
- Step-by-step cooking instructions (1. Step)
- Chef Claude's Pro Tip at the end.`;

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  const apiKey = import.meta.env.VITE_HF_ACCESS_TOKEN?.trim();

  // If no API key provided, supply a helpful fallback demo recipe
  if (!apiKey) {
    console.warn("VITE_HF_ACCESS_TOKEN is not set. Generating preview recipe.");
    // Simulate slight delay for realistic UX
    await new Promise((r) => setTimeout(r, 1200));
    return generateLocalDemoRecipe(ingredientsArr);
  }

  const prompt = `<s>[INST] ${SYSTEM_PROMPT}\n\nI have the following ingredients: ${ingredientsString}.\nPlease give me a detailed, gourmet recipe I can make with these ingredients! [/INST]`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      // Check if model is loading
      if (response.status === 503 && errData.estimated_time) {
        throw new Error(
          `Mistral model is currently spinning up on Hugging Face (est: ${Math.round(
            errData.estimated_time
          )}s). Please try again shortly!`
        );
      }
      throw new Error(
        errData.error || `Hugging Face API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    let recipeText = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      recipeText = data[0].generated_text;
    } else if (typeof data === "string") {
      recipeText = data;
    } else if (data?.generated_text) {
      recipeText = data.generated_text;
    } else {
      recipeText = JSON.stringify(data);
    }

    return recipeText.trim();
  } catch (error) {
    console.error("Recipe generation error:", error);
    throw error;
  }
}

function generateLocalDemoRecipe(ingredients) {
  const main = ingredients[0] || "Featured Ingredient";
  const formatted = ingredients.map((item) => `- ${item}`).join("\n");
  return `# Chef Claude's Artisanal ${main.charAt(0).toUpperCase() + main.slice(1)} Medley

> *Notice: Running in preview mode because \`VITE_HF_ACCESS_TOKEN\` was not found in your \`.env\` file. Add your token to activate live Mistral-7B generation!*

A vibrant, aromatic creation carefully crafted around your pantry staples: **${ingredients.join(", ")}**.

---

### ⏱️ Details
- **Prep Time:** 15 minutes
- **Cook Time:** 20 minutes
- **Servings:** 2-3 portions
- **Difficulty:** Easy-Medium

---

### 🛒 Ingredients Required
${formatted}
- Olive oil or butter (2 tbsp)
- Sea salt & freshly ground black pepper (to taste)
- 2 cloves garlic, finely minced
- A squeeze of fresh lemon juice or pinch of chili flakes

---

### 🍳 Step-by-Step Instructions
1. **Prepare the Base:** Clean and slice your ingredients into uniform bite-sized pieces to ensure even cooking.
2. **Infuse Aromatics:** In a wide heavy-bottom skillet or saucepan, warm 2 tablespoons of olive oil over medium-low heat. Add minced garlic and sauté until fragrant (approx. 60 seconds).
3. **Sear & Sauté:** Turn heat up to medium-high. Add **${ingredients.slice(0, 2).join(" and ")}**, tossing gently until lightly caramelized and tender.
4. **Combine & Simmer:** Add remaining ingredients: **${ingredients.slice(2).join(", ") || "fresh herbs"}**. Season with sea salt, freshly cracked pepper, and any choice herbs.
5. **Garnish & Plate:** Remove from heat, finish with a drizzle of virgin olive oil and a dash of lemon juice.

---

### 👨‍🍳 Chef Claude's Pro Tip
*Always taste your sauce and seasoning before serving! If the dish feels like it's missing something, a tiny touch of acid (lemon juice or balsamic vinegar) will instantly elevate all the underlying flavors.*`;
}
