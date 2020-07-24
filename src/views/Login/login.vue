<template>
    <div id="login">
        <div class="login-warp">
            <ul class="menu-tab">
                <li
                    v-for="item in menuTab"
                    :key="item.id"
                    :class="{'current':item.current}"
                    @click="toggleMenu(item)"
                >{{item.txt}}</li>
            </ul>
            <!-- 表单 start -->
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="formName"
                class="login-form"
                size="medium"
            >
                <el-form-item prop="username">
                    <label for="username">邮箱</label>
                    <el-input
                        id="username"
                        type="text"
                        v-model="ruleForm.username"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <label for="password">密码</label>
                    <el-input
                        id="password"
                        type="password"
                        v-model="ruleForm.password"
                        autocomplete="off"
                        maxlength="20"
                        minlength="6"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="rePassword" v-if=" model === 'register'">
                    <label for="rePassword">重复密码</label>
                    <el-input
                        id="rePassword"
                        type="password"
                        v-model="ruleForm.rePassword"
                        autocomplete="off"
                        maxlength="20"
                        minlength="6"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <label for="code">验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="14">
                            <el-input
                                id="code"
                                v-model.number="ruleForm.code"
                                maxlength="6"
                                minlength="6"
                            ></el-input>
                        </el-col>
                        <el-col :span="10">
                            <el-button type="success" class="block" @click="getSms()">获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="danger"
                        @click="submitForm('ruleForm')"
                        class="login-btn block"
                        :disabled="loginButtonStatus"
                    >{{ model === 'login'?'登录':'注册'}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
//引入相关组件
import { GetSms } from "@/api/login.js";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
    filterStr,
    validateEmall,
    validatePassword,
    validateCode
} from "@/utils/validate.js";
export default {
    name: "login",
    setup(props, { refs, root }) {
        //验证用户名
        let CheckUsername = (rule, value, callback) => {
            //过滤特殊字符
            ruleForm.username = filterStr(value);
            value = ruleForm.username;
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else if (validateEmall(value)) {
                callback(new Error("用户名格式有误"));
            } else {
                callback(); //true
            }
        };
        //验证密码
        let CheckPassword = (rule, value, callback) => {
            ruleForm.password = filterStr(value);
            value = ruleForm.password;
            if (value === "") {
                callback(new Error("请输入密码"));
            } else if (validatePassword(value)) {
                callback(new Error("密码为6至20位数字+字母"));
            } else {
                callback();
            }
        };
        // //验证重复密码
        let CheckrePassword = (rule, value, callback) => {
            //如果模块为login,直接通过
            if (model.value === "login") {
                callback();
            }
            ruleForm.rePassword = filterStr(value);
            value = ruleForm.rePassword;
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value != ruleForm.password) {
                callback(new Error("两次密码输入不一致"));
            } else {
                callback();
            }
        };
        // //验证验证码
        let CheckCode = (rule, value, callback) => {
            if (value === "") {
                return callback(new Error("验证码不能为空"));
            } else if (validateCode(value)) {
                callback(new Error("验证码格式有误"));
            } else {
                callback();
            }
        };
        /**
         * 声明数据
         */
        //这里面放置data数据，生命周期，自定义的函数
        const menuTab = reactive([
            { txt: "登录", current: true, type: "login" },
            { txt: "注册", current: false, type: "register" }
        ]);
        //模块值
        const model = ref("login");
        //登录按钮禁用状态
        const loginButtonStatus = ref(true);
        //表单绑定数据
        const ruleForm = reactive({
            username: "", //用户名邮箱
            password: "", //用户密码
            rePassword: "", //重复密码
            code: "" //验证码
        });
        //表单的验证
        const rules = reactive({
            username: [{ validator: CheckUsername, trigger: "blur" }],
            password: [{ validator: CheckPassword, trigger: "blur" }],
            rePassword: [{ validator: CheckrePassword, trigger: "blur" }],
            code: [{ validator: CheckCode, trigger: "blur" }]
        });
        /**
         * 声明函数
         */
        const toggleMenu = e => {
            //vue数据驱动视图渲染
            //初始化菜单数组
            menuTab.forEach(element => {
                element.current = false;
            });
            //将选中的值进行高光渲染
            e.current = true;
            //修改模块值
            model.value = e.type;
            //重置表单
            //2.0写法：this.$refs[formName].resetFields();
            refs.formName.resetFields();
        };
        /**
         * 获取验证码
         */
        const getSms = () => {
            //进行提示
            if (ruleForm.username == "") {
                root.$message.error("获取验证码时邮箱不能为空！");
                return false;
            }
            if (validateEmall(ruleForm.username)) {
                root.$message.error("邮箱格式有误，请重新输入！");
                return false;
            }
            //请求接口
            let requestData = {
                username: ruleForm.username,
                model: model.value
            };
            GetSms(requestData)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        };
        /**
         * 提交表单
         */
        const submitForm = formName => {
            refs[formName].validate(valid => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };
        /**
         * 生命周期
         */
        //挂载完成后
        onMounted(() => {
            // GetSms()
        });
        return {
            menuTab,
            model,
            ruleForm,
            rules,
            toggleMenu,
            submitForm,
            getSms,
            loginButtonStatus,
        };
    },
    created() {},
    mounted() {},
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