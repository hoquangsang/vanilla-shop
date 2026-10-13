import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "../styles/icons.css";
import "../styles/main.css";
import { initCart } from "./cart";
import { initDetail, initSearch } from "./search";
import { initShell } from "./shell";

initShell();
initCart();
initSearch();
initDetail();
