import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'

import "@aws-amplify/ui-vue/styles.css"



Amplify.configure(awsconfig)

createApp(App).use(router, axios).mount('#app')
