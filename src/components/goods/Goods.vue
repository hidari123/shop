<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <!--      提示区-->
      <el-alert title="添加商品信息" type="info" center :closable="false" show-icon></el-alert>
      <!--      步骤条区-->
      <el-steps align-center :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--      tab栏区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList"
                           :props="{ expandTrigger: 'hover', ...cateProps }" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!--            复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="callback" v-for="(callback, index) in item.attr_vals"
                             :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--
             action 表示图片要上传到的后台API地址
             handlePreview 点击预览触发
             handleRemove 删除图片触发
             fileList 指定文件列表
             list-type 指定预览组件的呈现方式
            -->
            <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                       list-type="picture" :headers="headersObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 Two-way Data-Binding -->
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce"/>
            <!--            添加按钮-->
            <el-button type="primary" class="AddBtn" @click="addShop">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--    图片预览-->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" alt="" class="perviewImg"/>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Goods',
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入商品分类',
            trigger: 'blur'
          }
        ]
      },
      // 存放商品列表数据
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态参数列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的路径
      previewPath: '',
      // 图片预览的对话框
      previewDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.cateList = res.data
    },
    // 级联选择项变化触发
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // 处理图片预览相关
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 监听图片上传成功的数据
    handleSuccess (response) {
      // 拼接得到一个图片的信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 图片信息对象 push 到 pics 数组中
      this.addForm.pics.push(picInfo)
    },
    addShop () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理动态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 执行添加的业务逻辑
        // 需要数组 但是返回的是字符串 报错
        // 需要深拷贝 JSON.parse(JSON.stringify())
        const form = JSON.parse(JSON.stringify(this.addForm))
        // form.attrs = this.addForm.attrs
        form.goods_cat = this.addForm.goods_cat.join(',')
        // 发起请求添加商品数据
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功!')
        await this.$router.push('/goods')
        // 不能直接做转换因为在 级联选择器 中双向绑定了 goods_cat 作为key
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      })
    },
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态列表失败!')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态列表失败!')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中找到这个图片的对应的索引值
      const index = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的splice方法,把图片信息对象,从pics数组中移除
      this.addForm.pics.splice(index, 1)
      console.log('移除图片', file, this.addForm)
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less">
.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.perviewImg {
  width: 100%;
}

.AddBtn {
  margin-top: 15px !important;
}
</style>
