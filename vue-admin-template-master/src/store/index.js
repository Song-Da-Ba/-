import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tradeMark from './modules/product/tradeMark'
import attr from './modules/product/attr'
import spu from './modules/product/spu'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tradeMark,
    attr,
    spu
  },
  getters
})

export default store
