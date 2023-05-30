import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/base.css";
import { createAuth0 } from "@auth0/auth0-vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(router(app));
app.use(createPinia());
app.use(
  createAuth0({
    domain: "70-days.eu.auth0.com",
    client_id: "1I2PMQ4NP1aJkKmyWekBvCDwOyq04crl",
    redirect_uri: window.location.origin,
  })
);
app.use(PrimeVue);

app.mount("#app");
