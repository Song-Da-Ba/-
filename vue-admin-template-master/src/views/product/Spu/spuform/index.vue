<template>
  <div>
    <el-form ref="form" :model="spuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="item in trademarkList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spuInfo.description"
          placeholder="描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="imgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAndArrtName"
          :placeholder="`还有${unselectAttrList.length}未选择`"
        >
          <el-option
            :label="item.name"
            :value="`${item.id}:${item.name}`"
            v-for="item in unselectAttrList"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrIdAndArrtName"
          >添加销售属性</el-button
        >
        <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="danger"
                class="el-icon-delete"
                size="mini"
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
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,
        description: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        tmId: "",
      },
      trademarkList: [],
      imgList: [],
      saleAttrList: [],
      attrIdAndArrtName: "",
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
    };
  },
  methods: {
    //删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.imgList = fileList;
    },
    //查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传图片
    handleSuccess(response, file, fileList) {
      // console.log(response,file,fileList);
      this.imgList = fileList;
    },
    // 初始化数据
    initData(row) {
      //获取spu信息
      this.$store.dispatch("spu/getSpuInfo", row.id).then(() => {
        this.spuInfo = this.$store.state.spu.spuInfo;
      });
      //获取品牌信息
      this.$store.dispatch("spu/getTrademarkList").then(() => {
        this.trademarkList = this.$store.state.spu.trademarkList;
      });
      //获取图片列表信息
      this.$store.dispatch("spu/getImgList", row.id).then(() => {
        let list = this.$store.state.spu.imgList;
        list.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.imgList = list;
      });
      //获取销售属性信息
      this.$store.dispatch("spu/getSaleAttrList").then(() => {
        this.saleAttrList = this.$store.state.spu.saleAttrList;
      });
    },
    //添加销售属性值
    addAttrValue() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndArrtName.split(":");
      let attr = { baseSaleAttrId, saleAttrName };
      this.spuInfo.spuSaleAttrList.push(attr);
      this.attrIdAndArrtName = "";
    },
    close() {
      this.$emit("close", 0);
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(row) {
      //属性值不为空
      if (row.inputValue.trim() == "") {
        this.$message.error("输入属性值不能为空！");
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
        return;
      }
      //属性值不能相同
      let result = row.spuSaleAttrValueList.some(item=>item.saleAttrValueName == row.inputValue)
      if(result){
        this.$message.error('属性值不能相同！')
        return
      }
      //添加属性值
      const { baseSaleAttrId, saleAttrName } = row;
      if (row.inputValue) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId,
          saleAttrName,
          saleAttrValueName: row.inputValue,
        });
      }
      row.inputVisible = false;
      row.inputValue = "";
    },
  },
  computed: {
    unselectAttrList() {
      return this.saleAttrList.filter((item1) => {
        return this.spuInfo.spuSaleAttrList.every((item2) => {
          return item1.name != item2.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
