<template>
    <div id="login">
        <div class="login-warp">
            <ul class="menu-tab">
                <!-- <li class="current" v-for="(item,index) in menuTab" :key="item.id">登录{{index}}</li> -->
                <li
                    v-for="item in menuTab"
                    :key="item.id"
                    :class="{'current':item.current}"
                    @click="toggleMenu(item)"
                >{{item.txt}}</li>
            </ul>
            <!-- 表单 start -->
            <i class="fa fa-camera-retro"></i>
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                class="login-form"
                size="medium"
            >
                <el-form-item prop="username">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <label>密码</label>
                    <el-input
                        type="password"
                        v-model="ruleForm.password"
                        autocomplete="off"
                        maxlength="20"
                        minlength="6"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="rePassword" v-if=" model === 'register'">
                    <label>重复密码</label>
                    <el-input
                        type="password"
                        v-model="ruleForm.rePassword"
                        autocomplete="off"
                        maxlength="20"
                        minlength="6"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <label>验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="14">
                            <el-input v-model.number="ruleForm.code" maxlength="6" minlength="6"></el-input>
                        </el-col>
                        <el-col :span="10">
                            <el-button type="success" class="block">获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="danger"
                        @click="submitForm('ruleForm')"
                        class="login-btn block"
                    >提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
//引入相关组件
import { reactive,ref } from "@vue/composition-api"
import { filterStr,validateEmall,validatePassword,validateCode } from "@/utils/validate.js";
export default {
    name: "login",
    setup(props,context){
        //这里面放置data数据，生命周期，自定义的函数
        const menuTab = reactive([
            { txt: "登录", current: true,type:'login' },
            { txt: "注册", current: false,type:'register' }
        ])
        //模块值
        const model = ref('login')
        /**
         * 声明函数
         */
        const toggleMenu = (e => {//vue 数据驱动视图渲染
            //初始化菜单数组
            menuTab.forEach(element => {
                element.current = false;
            });
            //将选中的值进行高光渲染
            e.current = true;
            model.value = e.type;
        })
        const submitForm = (formName => {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        })
    },
    data() {
        //验证用户名
        var CheckUsername = (rule, value, callback) => {
            //过滤特殊字符
            this.ruleForm.username = filterStr(value);
            value = this.ruleForm.username;
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else if (validateEmall(value)) {
                callback(new Error("用户名格式有误"));
            } else {
                callback(); //true
            }
        };
        //验证密码
        var CheckPassword = (rule, value, callback) => {
            this.ruleForm.password = filterStr(value);
            value = this.ruleForm.password;
            if (value === "") {
                callback(new Error("请输入密码"));
            } else if (validatePassword(value)) {
                callback(new Error("密码为6至20位数字+字母"));
            } else {
                callback();
            }
        };
        //验证重复密码
        var CheckrePassword = (rule, value, callback) => {
            this.ruleForm.rePassword = filterStr(value);
            value = this.ruleForm.rePassword;
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value != this.ruleForm.password) {
                callback(new Error("两次密码输入不一致"));
            } else {
                callback();
            }
        };
        //验证验证码
        var CheckCode = (rule, value, callback) => {
            if (value === "") {
                return callback(new Error("验证码不能为空"));
            } else if (validateCode(value)) {
                callback(new Error("验证码格式有误"));
            } else {
                callback();
            }
        };
        return {
            menuTab,
            model,
            toggleMenu,
            submitForm,
            ruleForm: {
                username: "", //用户名邮箱
                password: "", //用户密码
                rePassword: "", //重复密码
                code: "" //验证码
            },
            rules: {
                username: [{ validator: CheckUsername, trigger: "blur" }],
                password: [{ validator: CheckPassword, trigger: "blur" }],
                rePassword: [{ validator: CheckrePassword, trigger: "blur" }],
                code: [{ validator: CheckCode, trigger: "blur" }]
            }
        };
    },
    created() {},
    mounted() {},
    // 写函数的地方
    methods: {
       
    }
};
</script>

<style lang="scss" scoped>
//scoped：局部文件有效
#login {
    height: 100vh;
    background-color: #344a5f;
}
.login-warp {
    width: 300px;
    margin: auto;
}
.menu-tab {
    text-align: center;
    li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor: pointer; //鼠标样式变成手势
    }
    .current {
        background-color: rgb(0, 0, 0);
    }
}
.login-form {
    label {
        display: block;
        // margin: 3px;
        font-size: 14px;
        color: #fff;
    }
    .block {
        display: block;
        width: 100%;
    }
    .login-btn {
        margin-top: 8px;
    }
}
</style>>