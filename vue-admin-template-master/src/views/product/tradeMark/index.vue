<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="addProduct"
      >添加</el-button
    >
    <!-- 表格组件  -->
    <el-table :data="records" border style="width: 100%">
      <el-table-column
        prop="prop"
        type="index"
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="updataTradeMark(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; textAlign: center"
      background
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :total="productListInfo.total"
      :page-size="limit"
      layout="prev, pager, next, jumper,sizes,->,total"
      @size-change="handleSizeChange"
      @current-change="getData"
    >
    </el-pagination>

    <!-- 对话框 -->
    <!-- Form     v-model="form.name" -->
    <el-dialog
      :title="form.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="form.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdataTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      productListInfo:{},
      records:[],
      page: 1,
      //每页展示数据条数
      limit: 3,
      dialogFormVisible: false,
      form: {
        logoUrl: "",
        tmName: "",
      },
      //表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "change" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请添加品牌图片" }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //请求品牌列表
    getData(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      this.$store.dispatch("tradeMark/getTradeMark", { page, limit }).then(()=>{
        this.productListInfo = this.$store.state.tradeMark.productListInfo
        this.records = this.productListInfo.records
      })
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getData();
    },
    //添加按钮
    addProduct() {
      this.dialogFormVisible = true;
      this.form = { logoUrl: "", tmName: "" };
      //this.refs.ruleForm.resetFields()
    },
    //确定添加品牌
    addOrUpdataTradeMark() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          this.$store.dispatch("tradeMark/getAddOrUpDataTradeMark", this.form)
            .then(() => {
              this.$message({
                message: this.form.id ? "品牌修改成功！" : "品牌添加成功！",
                type: "success",
              });
              this.getData(this.page);
            });
        } else {
          //console.log("error submit!!");
          return false;
        }
      });
    },
    //修改品牌
    updataTradeMark(row) {
      this.dialogFormVisible = true;
      this.form = { ...row };
    },
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data;
      //this.form.logUrl = URL.createObjectURL(file.raw);
    },
    //删除品牌
    handleDelete(row) {
      //弹窗
      this.$confirm(`删除${row.tmName}品牌, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("tradeMark/getdeleteTradeMark", row.id)
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getData(this.records.length > 1 ? this.page : this.page - 1);
            });
          //let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
