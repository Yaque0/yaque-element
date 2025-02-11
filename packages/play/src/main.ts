import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import YaqueButton from "yaque-element";
console.log("====================================");
console.log(YaqueButton);
console.log("====================================");
createApp(App).use(YaqueButton).mount("#app");
