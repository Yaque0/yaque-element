import { makeInstaller } from "@yaque-element/utils";
import components from "./components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "@yaque-element/theme/index.css";
import printLogo from "./printLogo";
printLogo();
const installer = makeInstaller(components);
library.add(fas);

export * from "@yaque-element/components";
export default installer;
