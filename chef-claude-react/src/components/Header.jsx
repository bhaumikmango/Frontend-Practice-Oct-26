import React from "react";
import { ChefHat, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="header" id="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="logo-icon-wrapper">
            <ChefHat className="logo-icon" size={32} />
          </div>
          <div>
            <h1 className="header-title">Chef Claude</h1>
            <p className="header-subtitle">AI-Powered Culinary Assistant</p>
          </div>
        </div>
        <div className="header-badge">
          <Sparkles size={16} className="badge-sparkle" />
          <span>Powered by Mistral-7B</span>
        </div>
      </div>
    </header>
  );
}
