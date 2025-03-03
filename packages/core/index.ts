import { makeInstaller } from "@yaque-element/utils";
import components from "./components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "@yaque-element/theme/index.css";

const installer = makeInstaller(components);
library.add(fas);

export * from "../components";
export default installer;
