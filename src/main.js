// main.js
import { createApp } from 'vue';
import App from './App.vue';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Explicitly define the feature flag
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

createApp(App).mount('#app');
