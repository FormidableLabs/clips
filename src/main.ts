import "./app.css";
import { mount } from "svelte";
import App from "./App.svelte";

const target = document.getElementById("app");
if (!target) {
  throw new Error("Could not find #app element");
}

const app = mount(App, { target });

export default app;
