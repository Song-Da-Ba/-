import request from '@/utils/request'
// /admin/product/{page}/{limit} get
export const reqSpuList = ({ page, limit, category3Id }) =>
  request(
    {
      url: `/admin/product/${page}/${limit}`,
      method: 'get',
      params: { category3Id }
    })
// spu信息
export const reqSpu = (spuId) =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get',
  })
// 品牌下拉框信息 admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () =>
  request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
  })
// 图片信息 admin/product/spuImageList/{spuId}  
export const reqSpuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
  })
//平台全部销售属性下拉框信息 /admin/product/baseSaleAttrList  
export const reqbaseSaleAttrList = () =>
  request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
  })