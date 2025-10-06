import './styles/index.css'
import 'virtual:svg-icons-register' // 导入SVG图标注册

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'
import './styles/index.css'

import App from './App.vue'
import router from './router'
import ComSvgIcon from './components/com-svg-icon.vue'
import ComBack from './components/back.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TDesign)
app.component('ComSvgIcon', ComSvgIcon)
app.component('ComBack', ComBack)

app.mount('#app')
window.addEventListener('unhandledrejection', (event) => {
  // 处理未捕获的 Promise 拒绝
  console.log('Unhandled Rejection:', event.reason)
  // 可以在这里添加自定义的错误处理逻辑
})
