import React from "react";
import ReactMarkdown from "react-markdown";
import { UtensilsCrossed, Sparkles, Copy, Check, ChefHat } from "lucide-react";

export default function ClaudeRecipe({ recipe, recipeSectionRef }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recipe);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy recipe", err);
    }
  };

  return (
    <section
      className="recipe-container"
      aria-live="polite"
      ref={recipeSectionRef}
      id="claude-recipe-section"
    >
      <div className="recipe-card">
        <div className="recipe-header-bar">
          <div className="recipe-badge">
            <ChefHat size={18} />
            <span>Chef Claude Recommends</span>
          </div>
          <button
            type="button"
            className="copy-btn"
            onClick={handleCopy}
            title="Copy recipe text"
            id="copy-recipe-btn"
          >
            {copied ? (
              <>
                <Check size={16} /> Copied!
              </>
            ) : (
              <>
                <Copy size={16} /> Copy Recipe
              </>
            )}
          </button>
        </div>

        <article className="markdown-body">
          <ReactMarkdown>{recipe}</ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
