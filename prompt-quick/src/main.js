import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faHeart, faComment } from '@fortawesome/free-regular-svg-icons'

library.add(faEye, faHeart, faComment)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
