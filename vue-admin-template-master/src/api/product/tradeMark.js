//品牌管理
// 品牌列表 /admin/product/baseTrademark/{page}/{limit}
import request from '@/utils/request'
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
// 添加品牌或修改品牌 /admin/product/baseTrademark/save
export const reqAddOrUpDataTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
  } else {
    return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
  }
}
// 删除品牌 /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark= (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})