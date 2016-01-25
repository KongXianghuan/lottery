import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import Index from './components/Index'
import Res from './components/Res'
import store from './lib/store'
import data from './mock/data'

if (!store.get('data')) {
  store.set('data', data)
}

Vue.config.debug = true
Vue.use(Router)

const router = new Router()

router.map({
  '/': {
    name: 'index',
    component: Index
  },
  '/res': {
    name: 'res',
    component: Res
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})


router.start(App, 'app')

