import { createApp } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import "../src/fonts.css";
import "virtual:uno.css";
import App from "./App.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: { template: "<div />" } },
    { path: "/missions", component: { template: "<div />" } },
    { path: "/operatives", component: { template: "<div />" } },
    { path: "/settings", component: { template: "<div />" } },
  ],
});

createApp(App).use(router).mount("#app");
