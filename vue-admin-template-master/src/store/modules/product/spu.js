import { reqSpuList, reqSpuInfo, reqTrademarkList, reqspuImageList, reqSaleAttrList } from "@/api/product/spu"
const actions = {
  async getSpuList({ commit }, data) {
    let result = await reqSpuList(data)
    //console.log(result);
    commit('GETSPULIST', result.data)
    return result.message
  },
  async getSpuInfo({ commit }, spuId) {
    let result = await reqSpuInfo(spuId)
    console.log(result);
    commit('GETSPUINFO', result.data)
    return result.message
  },
  async getTrademarkList({ commit }) {
    let result = await reqTrademarkList()
    commit('GETTRADEMARKLIST', result.data)
    return result.message
  },
  async getImgList({ commit }, spuId) {
    let result = await reqspuImageList(spuId)
    commit('GETIMGLIST', result.data)
    return result.message
  },
  async getSaleAttrList({ commit }) {
    let result = await reqSaleAttrList()
    commit('GETSALEATTRLIST', result.data)
    return result.message
  }
}
const mutations = {
  GETSPULIST(state, data) {
    state.spuList = data
    state.records = data.records
  },
  GETSPUINFO(state, data) {
    state.spuInfo = data
  },
  GETTRADEMARKLIST(state, data) {
    state.trademarkList = data
  },
  GETIMGLIST(state, data) {
    state.imgList = data
  },
  GETSALEATTRLIST(state, data) {
    state.saleAttrList = data
  }
}
const getters = {
}
const state = {
  spuList: {},
  records: [],
  spuInfo: {},
  trademarkList: [],
  imgList: [],
  saleAttrList:[]
}
export default {
  namespaced: true,
  actions,
  mutations,
  getters,
  state
}