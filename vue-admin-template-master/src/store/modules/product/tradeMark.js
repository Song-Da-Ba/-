import { reqTradeMark,reqAddOrUpDataTradeMark,reqDeleteTradeMark } from '@/api/product/tradeMark.js'

const actions = {
  //获取品牌列表信息
  async getTradeMark({ commit }, data) {
    const { page, limit } = data
    let result = await reqTradeMark(page, limit)
    if (result.code == 200) {
      //console.log(result);
      commit('GETTRADEMARK', result.data)
      return result.message
    } else {
      return Promise.reject(new Error(result.message))
    }
  },
  //添加或修改品牌
  async getAddOrUpDataTradeMark({ commit }, data) {
    let result = await reqAddOrUpDataTradeMark(data)
    return result.message
  },
  //删除品牌
  async getdeleteTradeMark({commit},data){
    let result = await reqDeleteTradeMark(data)
    return result.message
  },
}
const mutations = {
  GETTRADEMARK(state, productListInfo) {
    state.productListInfo = productListInfo
    //state.records = productListInfo.records
  }
}
const getters = {
  records(state) {
    return state.productListInfo.records || []
  },
  productListInfo(state) {
    return state.productListInfo || {}
  }
}
const state = {
  productListInfo: {},
}

export default {
  namespaced: true,
  actions,
  mutations,
  getters,
  state
}