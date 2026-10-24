import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from "../ai";
import { Plus, AlertCircle, RotateCcw } from "lucide-react";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([
    "all the main spices",
    "pasta",
    "ground beef",
    "tomato paste",
  ]);
  const [recipe, setRecipe] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const recipeSectionRef = React.useRef(null);

  // Auto-scroll to recipe once loaded
  React.useEffect(() => {
    if (recipe && recipeSectionRef.current) {
      recipeSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  function handleAddIngredient(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newIngredient = formData.get("ingredient")?.toString().trim();

    if (!newIngredient) return;

    // Avoid exact duplicate additions
    if (ingredients.some((i) => i.toLowerCase() === newIngredient.toLowerCase())) {
      setErrorMessage(`"${newIngredient}" is already in your pantry list.`);
      return;
    }

    setErrorMessage("");
    setIngredients((prev) => [...prev, newIngredient]);
    event.currentTarget.reset();
  }

  function handleRemoveIngredient(indexToRemove) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function handleResetAll() {
    setIngredients([]);
    setRecipe("");
    setErrorMessage("");
  }

  async function handleGetRecipe() {
    if (ingredients.length < 3) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const generatedRecipe = await getRecipeFromMistral(ingredients);
      setRecipe(generatedRecipe);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.message || "Failed to fetch recipe from Chef Claude. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="main-container" id="main-content">
      {/* Search / Input Form */}
      <section className="form-section">
        <form onSubmit={handleAddIngredient} className="add-ingredient-form" id="ingredient-form">
          <input
            type="text"
            aria-label="Add ingredient"
            placeholder="e.g. oregano, chicken breast, mushrooms..."
            name="ingredient"
            className="ingredient-input"
            id="ingredient-input"
            autoComplete="off"
            required
          />
          <button type="submit" className="add-btn" id="add-ingredient-btn">
            <Plus size={18} />
            <span>Add Ingredient</span>
          </button>
        </form>

        {ingredients.length > 0 && (
          <div className="reset-bar">
            <button
              type="button"
              className="reset-btn"
              onClick={handleResetAll}
              title="Clear all ingredients"
            >
              <RotateCcw size={14} /> Clear All
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}
      </section>

      {/* Ingredients List & Call To Action */}
      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          onGetRecipe={handleGetRecipe}
          onRemoveIngredient={handleRemoveIngredient}
          isLoading={isLoading}
        />
      )}

      {/* Render Markdown Recipe */}
      {recipe && <ClaudeRecipe recipe={recipe} recipeSectionRef={recipeSectionRef} />}
    </main>
  );
}
