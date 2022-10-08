import { reqCategory1, reqCategory2, reqCategory3,reqCategoryList,reqAddAttr,reqDeleteAttr } from '@/api/product/attr.js'

const actions = {
  async getCategory1({ commit }) {
    let result = await reqCategory1()
    commit('GETCATEGORY1', result.data)
    return result.message
  },
  async getCategory2({ commit },id) {
    let result = await reqCategory2(id)
    commit('GETCATEGORY2', result.data)
    return result.message
  },
  async getCategory3({ commit },id) {
    let result = await reqCategory3(id)
    //console.log(result);
    commit('GETCATEGORY3', result.data)
    return result.message
  },
  async getCategoryList({ commit }, data) {
    let result = await reqCategoryList(data)
    //console.log(result);
    commit('GETCATEGORYLIST',result.data)
  },
  async getAttr({commit},data) {
    let result = await reqAddAttr(data)
    return result.message
  },
  async getDeleteAttr({commit},id) {
    let result = await reqDeleteAttr(id)
    console.log(result);
  }
}
const mutations = {
  GETCATEGORY1(state, list1) {
    state.list1 = list1
  },
  GETCATEGORY2(state, list2) {
    state.list2 = list2
  },
  GETCATEGORY3(state, list3) {
    state.list3 = list3
  },
  GETCATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList
  }
}
const getters = {
}
const state = {
  list1: [],
  list2: [],
  list3: [],
  categoryList:[]
}
export default {
  namespaced: true,
  actions,
  mutations,
  getters,
  state
}