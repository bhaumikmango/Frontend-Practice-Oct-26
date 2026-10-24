import React from "react";
import { Sparkles, Trash2, CookingPot, Loader2 } from "lucide-react";

export default function IngredientsList({
  ingredients,
  onGetRecipe,
  onRemoveIngredient,
  isLoading,
}) {
  const ingredientsListItems = ingredients.map((ingredient, index) => (
    <li key={`${ingredient}-${index}`} className="ingredient-item">
      <span className="ingredient-bullet"></span>
      <span className="ingredient-text">{ingredient}</span>
      <button
        type="button"
        className="remove-ingredient-btn"
        onClick={() => onRemoveIngredient(index)}
        aria-label={`Remove ${ingredient}`}
        title={`Remove ${ingredient}`}
      >
        <Trash2 size={16} />
      </button>
    </li>
  ));

  return (
    <section className="ingredients-section" id="ingredients-list-section">
      <div className="section-title-wrap">
        <h2 className="section-title">Ingredients on Hand:</h2>
        <span className="count-pill">{ingredients.length} items</span>
      </div>

      <ul className="ingredients-list" aria-label="Ingredients on hand">
        {ingredientsListItems}
      </ul>

      {ingredients.length >= 3 ? (
        <div className="get-recipe-container" id="ready-for-recipe-box">
          <div className="get-recipe-info">
            <div className="get-recipe-badge">
              <CookingPot size={20} />
              <h3>Ready for a recipe?</h3>
            </div>
            <p>Generate a gourmet recipe tailored specifically to your ingredients list.</p>
          </div>
          <button
            type="button"
            className="get-recipe-btn"
            id="get-recipe-button"
            onClick={onGetRecipe}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Cooking up ideas...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Get a Recipe</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="need-more-ingredients">
          <p>
            💡 Add at least <strong>{3 - ingredients.length}</strong> more ingredient
            {3 - ingredients.length === 1 ? "" : "s"} to ask Chef Claude for recipe ideas!
          </p>
        </div>
      )}
    </section>
  );
}
