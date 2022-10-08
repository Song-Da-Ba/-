<template>
  <!--  -->
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="一级菜单" :model="formInline">
          <!-- v-model="formInline.region" -->
        <el-select  placeholder="请选择" @change="getCategory1()" v-model="formInline.category1Id" :disabled="show">
      <el-option :label="c1.name" :value="c1.id" v-for="(c1) in list1" :key="c1.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="二级菜单">
          <!-- v-model="formInline.region" -->
        <el-select  placeholder="请选择" @change="getCategory2()" v-model="formInline.category2Id" :disabled="show">
      <el-option :label="c2.name" :value="c2.id" v-for="(c2) in list2" :key="c2.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="三级菜单">
          <!-- v-model="formInline.region" -->
        <el-select  placeholder="请选择" @change="getCategory3()" v-model="formInline.category3Id" :disabled="show">
      <el-option :label="c3.name" :value="c3.id" v-for="(c3) in list3" :key="c3.id"></el-option>
    </el-select>
  </el-form-item>
  </el-form>
</template>

<script>
export default {
  name:'CategorySelect',
  props:['show'],
  data(){
    return{
      list1:[],
      list2:[],
      list3:[],
      formInline:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(){
      this.$store.dispatch('attr/getCategory1').then(()=>{
        this.list1 = this.$store.state.attr.list1
      })
    },
    getCategory1(){
      this.list2 = []
      this.list3 = []
      this.formInline.category2Id = ''
      this.formInline.category3Id = ''
      this.$store.dispatch('attr/getCategory2',this.formInline.category1Id).then(()=>{
        this.list2 = this.$store.state.attr.list2
      })
    },
    getCategory2(){
      this.list3 = []
      this.formInline.category3Id = ''
      this.$store.dispatch('attr/getCategory3',this.formInline.category2Id).then(()=>{
        this.list3 = this.$store.state.attr.list3
      })
    },
    getCategory3(){
      this.$emit('getCategoryId',this.formInline)
    }
  },
}
</script>

<style>

</style>