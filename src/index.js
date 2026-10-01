import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/fira-sans/400.css";
import "@fontsource/fira-sans/500.css";
import "@fontsource/fira-sans/600.css";
import "@fontsource/fira-sans/700.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@fontsource/anton/400.css";
import "@fontsource/playfair-display/700.css";
import "./styles/variables.css";
import "./styles/responsive.css";
import App from "./App";

/**
 * Google Translate rewrites text nodes directly in the DOM. When React
 * later tries to remove/reorder those same nodes (e.g. on route change)
 * it can throw "Failed to execute 'removeChild'/'insertBefore' on 'Node'"
 * and crash the app. This patches both methods to fail soft instead of
 * throwing, which is the standard, safe workaround for this well-known
 * React + Google Translate conflict.
 */
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console) console.warn("Skipped removeChild call for non-child node (Google Translate DOM conflict).");
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) console.warn("Skipped insertBefore call for non-child reference node (Google Translate DOM conflict).");
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
