import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";


// Import VXETable
import "vxe-table/lib/style.css";
import VXETable from "vxe-table";

const app = createApp(App);
const backendURL = import.meta.env.VITE_AXIOS_HTTP_BASEURL;
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$http = axios;

const httpClient = axios.create({
    withCredentials: true,
    baseURL: backendURL,
});

library.add(fas, faCalendar, far, fab);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(LoadingPlugin);

// Import VXETable
app.use(VXETable);

app.mount("#app");

export default httpClient;
