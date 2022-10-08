import request from '@/utils/request'
// /admin/product/{page}/{limit} get
export const reqSpuList = ({ page, limit, category3Id }) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })
// /admin/product/getSpuById/{spuId} get 获取spu基本信息
export const reqSpuInfo = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
// /admin/product/baseTrademark/getTrademarkList get 获取品牌数据
export const reqTrademarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })
// 获取图片/admin/product/spuImageList/{spuId}
export const reqspuImageList = (spuId)=> request({url:`/admin/product/spuImageList/${spuId}`,method:"get"})
// /admin/product/baseSaleAttrList 获取全部销售属性
export const reqSaleAttrList = () => request({url:'/admin/product/baseSaleAttrList',method:'get'})
