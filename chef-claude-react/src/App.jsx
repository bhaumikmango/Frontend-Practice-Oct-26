import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";

export default function App() {
  return (
    <div className="app-layout">
      <Header />
      <Main />
      <footer className="footer">
        <p>
          Chef Claude • Crafted with React & Mistral-7B Inference API
        </p>
      </footer>
    </div>
  );
}
