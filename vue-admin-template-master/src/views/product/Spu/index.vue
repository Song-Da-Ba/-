<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!show" />
    </el-card>
    <el-card>
      <div v-show="scene==0">
        <el-button type="primary" icon="el-icon-plus" @click="addSpu" :disabled="!categoryIdList.category3Id">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号 " width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSpu"
              ></hint-button>
              <el-tooltip content="修改spu" placement="bottom" effect="light">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updataSpu(row)"
              ></el-button>
              </el-tooltip>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
              ></HintButton>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除spu"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--  @size-change="handleSizeChange"   -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper,sizes,->,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @close="close" ref="spu"></SpuForm>
      <SkuForm v-show="scene==2"></SkuForm>
    </el-card>
  </div>
</template>
<script>
import SpuForm from './spuform'
import SkuForm from './skuform'
export default {
  name: "Spu",
  components:{
    SpuForm,
    SkuForm
  },
  data() {
    return {
      show: true,
      categoryIdList: {},
      page: 1,
      limit: 3,
      total: 0,
      records:[],
      scene:0 ,
    };
  },
  methods: {
    getCategoryId(value) {
      this.categoryIdList = value;
      if (this.categoryIdList.category3Id) {
        this.getSpuList();
      }
    },
    getSpuList(pages=1) {
      this.page = pages
      const { page, limit, categoryIdList } = this;
      this.$store
        .dispatch("spu/getSpuList", {
          page,
          limit,
          category3Id: categoryIdList.category3Id,
        })
        .then(() => {
          //console.log(this.$store.state);
          //this.page = this.$store.state.spu.spuList.pages
          this.total = this.$store.state.spu.spuList.total;
          this.records = this.$store.state.spu.records 
        });
    },
    handleSizeChange(size){
      this.limit = size
      this.getSpuList()
    },
    addSpu(){
      this.scene = 1
    },
    //修改spu
    updataSpu(row){
      this.scene = 1
      this.$refs.spu.initData(row)
    },
    close(scene){
      this.scene = scene
    }
  },
};
</script>

<style></style>
