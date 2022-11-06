<template>
  <div>
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="item in tradeMarkList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spu.description"
          placeholder="描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAndAttrName"
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
        >
          <el-option
            :label="item.name"
            :value="`${item.id}:${item.name}`"
            v-for="item in unSelectSaleAttr"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table :data="spu.spuSaleAttrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                closable
                @close="handleClose(index, row)"
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
                >{{ item.saleAttrValueName }}</el-tag
              >
              <el-input
                ref="saleAttrInput"
                v-if="row.show"
                size="mini"
                v-model="row.valueName"
                placeholder=""
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="handleInputConfirm(row)"
                class="saleAttrValueName"
              ></el-input>
              <el-button
                size="mini"
                v-else
                @click="addSaleAttrValueName(row)"
                :disabled="show"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button type="primary" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  reqSpu,
  reqTrademarkList,
  reqSpuImageList,
  reqbaseSaleAttrList,
} from "@/api/product/spu";
import _ from "loadsh";
export default {
  name: "SpuForm",
  data() {
    return {
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [], //销售属性的数据（项目全部的销售属性）
      attrIdAndAttrName: "", //收集未选择的销售属性的id-----
      dialogImageUrl: "",
      dialogVisible: false,
      show: false,
    };
  },
  methods: {
    async getSpuInfo(spu) {
      let result = await reqSpu(spu.id);
      if (result.code == 200) {
        // console.log(result.data);
        this.spu = result.data;
      }
      try {
        let tradeMarkList = await reqTrademarkList();
        if (tradeMarkList.code == 200) {
          this.tradeMarkList = tradeMarkList.data;
        }
      } catch (error) {}

      let spuImageList = await reqSpuImageList(spu.id);
      if (spuImageList.code == 200) {
        // console.log(spuImageList.data);
        spuImageList.data.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList.data;
      }

      let saleAttrList = await reqbaseSaleAttrList();
      if (saleAttrList.code == 200) {
        this.saleAttrList = saleAttrList.data;
      }
    },
    //图片列表删除
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //添加销售属性
    addSaleAttr() {
      if (this.attrIdAndAttrName.length == 0) {
        this.$message({
          message: "请选择需要添加的销售属性",
          type: "error",
        });
      } else {
        const [baseSaleAttrId, saleAttrName] =
          this.attrIdAndAttrName.split(":");
        let obj = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
        if (this.spu.spuSaleAttrList.length < 3) {
          this.spu.spuSaleAttrList.push(obj);
          this.attrIdAndAttrName = "";
        }
      }
    },
    //添加属性值名称列表
    addSaleAttrValueName(row) {
      this.$set(row, "show", true);
       this.$set(row, "valueName", '');
      this.$nextTick(() => {
        this.$refs.saleAttrInput.focus();
      });
    },
    handleInputConfirm: _.debounce(function (row) {
      const { baseSaleAttrId, valueName } = row;
      try {
        if (valueName.trim() == "") {
          // this.$refs.saleAttrInput.focus();
          // this.$message({
          //   message: "输入值不能为空！",
          //   type: "error",
          // });
          // this.show = true;
          row.show = false;
          return;
        }
        let result = row.spuSaleAttrValueList.some((item) => {
          return item.saleAttrValueName == valueName;
        });
        if (result) {
          this.$refs.saleAttrInput.focus();
          this.$message({
            message: "输入值不能重复！",
            type: "error",
          });
          this.show = true;
          return;
        }
        let obj = { baseSaleAttrId, saleAttrValueName: valueName };
        row.spuSaleAttrValueList.push(obj);
        row.show = false;
        this.show = false;
        
      } catch (error) {}
      
    }, 100),
    //属性值名称列表标签删除
    handleClose(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
      // console.log(row.spuSaleAttrValueList);
    },
    close() {
      this.$emit("close", 0);
    },
  },
  computed: {
    unSelectSaleAttr() {
      let arr = [];
      this.saleAttrList.forEach((allItem) => {
        let result = this.spu.spuSaleAttrList.some((item) => {
          return item.saleAttrName === allItem.name;
        });
        if (!result) arr.push(allItem);
      });
      return arr;
    },
  },
};
</script>

<style>
.el-tag.el-tag--success {
  margin-right: 10px;
}
.saleAttrValueName {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
