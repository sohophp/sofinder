import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import type { SoFinderConfig } from "./types";
import "./styles.css";
import "./enhancements.css";

const element = document.getElementById("sofinder-root");
if (!element) throw new Error("SoFinder root element was not found.");
const config = JSON.parse(element.dataset.config || "{}") as SoFinderConfig;
createRoot(element).render(<StrictMode><App config={config}/></StrictMode>);
