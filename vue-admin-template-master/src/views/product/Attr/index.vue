<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card style="margin: 20px 0">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!categoryIdList.category3Id"
        @click="addCategory"
        v-show="isShowTable"
        >添加属性</el-button
      >
      <!-- 表格 -->
      <el-table
        v-show="isShowTable"
        :data="categoryList"
        border
        align="center"
        style="width: 100%"
      >
        <el-table-column
          prop="prop"
          label="序号"
          width="80"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="prop" label="属性值列表" width="width">
          <template slot-scope="{ row }">
            <el-tag
              type="success"
              v-for="c in row.attrValueList"
              :key="c.id"
              style="margin: 0 20px"
              >{{ c.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updataAttr(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteAttr(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!isShowTable">
        <!-- 添加或修改品牌属性 :model="form" -->
        <el-form :inline="true" ref="form" label-width="80px" :model="data">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名称"
              v-model="data.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttr"
          :disabled="!data.attrName"
          ref="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 表格 -->
        <el-table
          style="width: 100%; margin: 20px 0"
          :data="data.attrValueList"
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                size="mini"
                v-if="row.flag"
                @blur="addAttrName(row)"
                @keyup.native.enter="addAttrName(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                icon="el-icon-info"
                icon-color="red"
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="getAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      categoryIdList: {},
      categoryList: [],
      isShowTable: true,
      data: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId(value) {
      this.categoryIdList = value;
      if (this.categoryIdList.category3Id) {
        this.getCategoryList();
      }
    },
    //获取品牌属性列表
    getCategoryList() {
      //console.log(1);
      this.$store
        .dispatch("attr/getCategoryList", this.categoryIdList)
        .then(() => {
          this.categoryList = this.$store.state.attr.categoryList;
        });
    },
    //添加属性
    addCategory() {
      this.isShowTable = false;
      this.data.categoryId = this.categoryIdList.category3Id;
      this.data.attrName = "";
      this.data.attrValueList = [];
    },
    //添加属性值
    addAttr() {
      this.data.attrValueList.push({
        attrId: this.data.id,
        valueName: "",
        flag: true,
      });
      let index = this.data.attrValueList.length - 1;
      //this.$refs[index].focus()
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
      //判断是否输入属性值，没输入弹窗
    },
    //保存
    getAttr() {
      let result = this.data.attrValueList.filter((item) => {
        return delete item.flag;
      });
      this.data.attrValueList = result;
      //console.log(this.data.attrValueList);
      this.$store.dispatch("attr/getAttr", this.data).then(() => {
        this.isShowTable = true;
        this.$message({
          message: "保存成功！",
          type: "success",
        });
        this.getCategoryList();
      });
    },
    //修改品牌属性
    updataAttr(row) {
      this.isShowTable = false;

      row.attrValueList.forEach((item) => {
        item.flag = false;
      });
      //深拷贝
      this.data = cloneDeep(row);
    },
    addAttrName(row) {
      //去除空格
      row.valueName = row.valueName.trim();
      //判断输入属性值不为空
      if (row.valueName === "") {
        this.$message.error("输入属性值不能为空！");
        this.$refs.addAttrValue.disabled = true;
        return;
      }
      //避免属性值重复
      let result = this.data.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      //console.log(result);
      if (result) {
        this.$message.error("已经存在相同的属性值名称，请重新输入！");
        this.$refs.addAttrValue.disabled = true;
        return;
      }
      //给对象添加响应式数据
      //this.$set(row,'flag',false)
      this.$refs.addAttrValue.disabled = false;
      row.flag = false;
    },
    //点击span
    toEdit(row, index) {
      //console.log(row);
      row.flag = true;
      this.$nextTick(() => {
        //console.log(this.$refs[index]);
        this.$refs[index].focus();
      });
    },
    //删除属性值
    deleteAttrValue(index) {
      this.data.attrValueList.splice(index, 1);
    },
    //
    deleteAttr(row) {
      this.$confirm(`删除${row.attrName}品牌, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("attr/getDeleteAttr", row.id).then(() => {
          
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          this.getCategoryList();
        });
      }).catch(()=>{
          this.$message({
            message: "取消删除！",
            type: "error",
          });
      })
      
    },
  },
};
</script>

<style></style>
