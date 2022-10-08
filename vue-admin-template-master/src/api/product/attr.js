// 获取三级联动  /admin/product/getCategory1 
import request from '@/utils/request'
export const reqCategory1 = () => request({ url: '/admin/product/getCategory1', method: 'get' })
export const reqCategory2 = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
export const reqCategory3 = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })
//获取品牌属性列表
export const reqCategoryList = ({ category1Id, category2Id, category3Id }) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
//添加或修改品牌属性
export const reqAddAttr = (data)=> request({url:'/admin/product/saveAttrInfo',method:'post',data})
//删除品牌属性
export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })

