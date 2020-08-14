<template>
    <div id="nav-wrap">
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" 
        @close="handleClose" :collapse="isCollapse" background-color="transparent" 
        text-color="#fff" active-text-color="#fff" router>
            <template v-for="(item,index) in routers">
                <!--
                <el-submenu v-if="!item.hidden" :key="item.id" :index="index+''">
                    <template slot="title">
                        <i :class="item.meta.icon"></i>
                        <span slot="title">{{ item.meta.name}}</span>
                    </template>
                <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">{{ subItem.meta.name}}</el-menu-item>
                </el-submenu>
                -->
                <el-submenu :key="item.id" :index="index+''">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title}}</span>
                    </template>
                <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.url">{{ subItem.title}}</el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script>
import { TreeMenus } from "@/api/news.js";
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
export default {
    name: 'navMenu',
    setup(props,{ root }){
        /**
         * data数据
         */
        const isCollapse = ref(false);
        var a = TreeMenus();
        const routers = toRefs(a.data);
        
        console.log(routers);
        //const routers = reactive(root.$router.options.routes);
        /**
         * 函数方法区
         */
        const handleOpen  = (key, keyPath) => {
            console.log(key, keyPath);
        }
        const handleClose = (key, keyPath) => {
            console.log(key, keyPath);
        }
        /**
         * return的数据
         */
        return {
            isCollapse,
            routers,
            handleOpen,
            handleClose,
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#nav-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: $navMenu;
    height: 100vh;
    background-color: #344a5f;
}

</style>