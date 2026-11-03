// PREDICT, THEN RUN.   node predict/modules/main.js
import { headerClick } from "./header.js";
import { footerClick } from "./footer.js";

headerClick();
headerClick();
console.log("footer sees:", footerClick());
// Prediction:  (is `clicks` shared between header and footer, or does each get its own?)
