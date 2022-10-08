import { reqSpuList } from "@/api/product/spu"
const actions = {
  async getSpuList({ commit }, data) {
    let result = await reqSpuList(data)
    //console.log(result);
    commit('GETSPULIST', result.data)
    return data.message
  }
}
const mutations = {
  GETSPULIST(state, data) {
    state.spuList = data
    state.records = data.records
  }
}
const getters = {
}
const state = {
  spuList: {},
  records:[]
}
export default {
  namespaced: true,
  actions,
  mutations,
  getters,
  state
}