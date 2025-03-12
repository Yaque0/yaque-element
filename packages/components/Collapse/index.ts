import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";
import { withInstall } from "@yaque-element/utils";

export const YaqueCollapse = withInstall(Collapse);
export const YaqueCollapseItem = withInstall(CollapseItem);

export * from "./types";
