import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "../styles/icons.css";
import "../styles/main.css";
import { initHomeBrandContent } from "./home-brand-content";
import { initHomeShowcase } from "./home-showcase";
import { initCart } from "./cart";
import { initSearch } from "./search";
import { initShell } from "./shell";

initShell();
initCart();
initSearch();
initHomeShowcase();
initHomeBrandContent();
