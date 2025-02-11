import { makeInstaller } from "@yaque-element/utils";
import components from "./components";
import "@yaque-element/theme/index.css";
const installer = makeInstaller(components);

export * from "@yaque-element/components";
export default installer;
