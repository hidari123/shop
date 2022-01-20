<template>
  <el-container class="home-container">
    <!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    主体区域-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--        侧边栏菜单区-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eef"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!--          一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!--            一级菜单模板区-->
            <template slot="title">
              <!--              图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--              文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--            二级菜单模板区-->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!--              图标-->
                <i class="el-icon-menu"></i>
                <!--              文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      右侧主体内容-->
      <el-main>
        <!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-view',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      // 是否折叠
      isCollapse: false,
      // 保存被激活的地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/login')
    },
    // 获得所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    img {
      height: 50px;
    }

    span {
      padding-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
