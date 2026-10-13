import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/main.css";
import { initCart } from "./cart";
import { initDetail, initSearch } from "./search";
import { initShell } from "./shell";

initShell();
initCart();
initSearch();
initDetail();
