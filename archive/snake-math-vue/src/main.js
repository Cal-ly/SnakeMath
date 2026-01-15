import './assets/styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import VueMathjax from 'vue-mathjax-next'

const app = createApp(App)

// Configure MathJax for optimal rendering
app.use(VueMathjax, {
  config: {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
  }
})

app.mount('#app')
