import { createApp } from 'vue'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.vue'
import { useTheme } from './composables/useTheme'

useTheme().init()
createApp(App).mount('#app')
