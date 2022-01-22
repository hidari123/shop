<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <!--      添加角色按钮区-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!--      添加角色对话框-->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <!--        内容主体区-->
        <el-form :model="addForm" :rules="addFormRoles" ref="addFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--        底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
      </el-dialog>

      <!--      修改角色对话框-->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <!--        内容主体区-->
        <el-form :model="editForm" :rules="editFormRoles" ref="editFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--        底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
      </el-dialog>

      <!--      角色列表区-->
      <el-table :data="rolesList" border stripe>
        <!--        展开列-->

        <el-table-column type="expand">
          <template v-slot="scoped">
            <el-row :class="['bdtop', i1 === 0 ?  'bdbottom' : '', 'vcenter']"
                    v-for="(item1, i1) in scoped.row.children" :key="item1.id">
              <!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scoped.row, item1.id)">{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--              渲染二级和三级权限-->
              <el-col :span="19">
                <!--              通过 for 循环渲染二级权限-->
                <el-row v-for="(item2, i2) in item1.children" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scoped.row, item2.id)">{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                            :class="[i3 === 0 ? '' : 'bdtop']" closable
                            @close="removeRightById(scoped.row, item3.id)">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
                <!--            <pre>{{ scoped.row }}</pre>-->
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template width="300px" v-slot="scoped">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scoped.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scoped.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scoped.row)"
                       @close="setRightDialogClose">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--    分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <!--树形控件-->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Roles',
  data () {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证规则对象
      addFormRoles: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 5,
            message: '长度在2～5个字符之间',
            trigger: 'blur',
            mobile: ''
          }
        ],
        roleDesc: [
          {
            message: '请输入角色描述',
            trigger: 'blur'
          }]
      },
      // 控制添加角色对话框的显示和隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色的验证规则对象
      editFormRoles: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 5,
            message: '长度在2～5个字符之间',
            trigger: 'blur',
            mobile: ''
          }
        ],
        roleDesc: [
          {
            message: '请输入角色描述',
            trigger: 'blur'
          }]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点 id 值的数组
      defKeys: [],
      // 当前即将分配权限的角色 id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        // 可以发起添加角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.addDialogVisible = false
        await this.getRolesList()
      })
    },
    // 展示编辑角色的对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 修改角色用户信息提交
    editRoleInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        // 发起修改角色信息的请求
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleDesc: this.editForm.roleDesc,
          roleName: this.editForm.roleName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败！')
        }
        this.editDialogVisible = false
        this.$message.success('更新角色信息成功！')
        await this.getRolesList()
      })
    },
    // 清空修改角色对话框
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除角色信息
    async removeRoleById (id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户确认删除，返回字符串： confirm
      // 用户取消删除，返回字符串： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色信息失败')
      }
      this.$message.success('删除角色信息成功！')
      await this.getRolesList()
    },
    // 根据id删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框询问用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户确认删除，返回字符串： confirm
      // 用户取消删除，返回字符串： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限信息失败')
      }
      this.$message.success('删除权限信息成功！')
      // 刷新后会直接关闭，不能刷新
      // await this.getRolesList()
      role.children = res.data
    },
    async showSetRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      // 获取到的权限数据保存到 data 中
      this.rightsList = res.data
      // 当前即将分配权限的 id
      this.roleId = role.id
      // 递归获取三级节点的 id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归形式 获取角色下所有三级权限id 并保存到 defKays 数组中
    getLeafKeys (node, arr) {
      // 如果当前 node 节点不包含 children 属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose () {
      // 清空 defKeys 数组  避免累积
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('更新权限失败！')
      }
      this.$message.success('更新权限成功！')
      this.setRightDialogVisible = false
      await this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
