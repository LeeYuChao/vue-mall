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
                ref="loginForm"
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
                                v-model="ruleForm.code"
                                maxlength="6"
                                minlength="6"
                            ></el-input>
                        </el-col>
                        <el-col :span="10">
                            <el-button type="success" class="block" :disabled="codeButtonStatus.status" @click="getSms()">{{ codeButtonStatus.text }}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="danger"
                        @click="submitForm('loginForm')"
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
import sha1 from "js-sha1";
import { GetSms,Register,Login } from "@/api/login.js";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {filterStr,validateEmall,validatePassword,validateCode} from "@/utils/validate.js";
export default {
    name: "login",
    setup(props, { refs, root }) {
        //验证用户名
        let CheckUsername = (rule, value, callback) => {
            //过滤特殊字符
            // ruleForm.username = filterStr(value);
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
        //验证码按钮状态
        const codeButtonStatus = reactive({ 
            status: false, 
            text: '获取验证码'
        });
        //倒计时
        const timer = ref(null);
        //表单绑定数据
        const ruleForm = reactive({
            username: "123123@qq.com", //用户名邮箱
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
        //切换模块
        const toggleMenu = (e => {
            //vue数据驱动视图渲染
            //初始化菜单数组
            menuTab.forEach(element => {
                element.current = false;
            });
            //将选中的值进行高光渲染
            e.current = true;
            //修改模块值
            model.value = e.type;
            resetFromData()
            clearCountDown()
        });
        //清除表单数据
        const resetFromData = (() => {
            //重置表单resetFields
            //2.0写法：this.$refs[formName].resetFields();
            refs.loginForm.resetFields();
        });
        //更新按钮状态
        const updateButtonStatus = ((params) => {
            codeButtonStatus.status = params.status;
            codeButtonStatus.text = params.text;
        });
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
            updateButtonStatus({
                status:true,
                text:'发送中'
            });
            //请求延时2秒操作
            setTimeout(() => {
                GetSms(requestData).then(response => {
                    let data = response.data;
                    root.$message({
                        message:data.message,
                        type:'success'
                    })
                    //请求成功之后，注册按钮可以点击，且按钮进入倒计时
                    loginButtonStatus.value = false
                    countDown(6);
                }).catch(error => {
                    console.log(error);
                })
            }, 2000);
            loginButtonStatus.value = false
        };
        /**
         * 提交表单
         */
        const submitForm = (formName => {
             refs[formName].validate((valid) => {
                //表单验证通过
                if (valid) {
                    model.value === 'login' ? login() : register()
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        });
        /**
         * 登录
         */
        const login = (() => {
            let requestData = {
                username:ruleForm.username,
                password:sha1(ruleForm.password),
                code:ruleForm.code,
            }
            //页面跳转
            root.$router.push({
                name:'Console'
            })
            //发送登录请求
            Login(requestData).then(response => {
                console.log(requestData)
            }).catch(error => {
                console.log(error)
            })
        });
        /**
         * 注册
         */
        const register = (() => {
            let requestData = {
                username:ruleForm.username,
                password:sha1(ruleForm.password),
                code:ruleForm.code,
                module:'register',
            }
            //模拟注册成功
            toggleMenu(menuTab[0]);
            clearCountDown();
            //发送注册请求
            Register(requestData).then(response => {
                let data = response.data;
                root.$message({
                    message:data.message,
                    type:'success'
                })
            //模拟注册成功
            }).catch(error => {
                //失败时执行的代码
                console.log(error)
            })
        });
        /**
         * 倒计时
         */
        const countDown = ((number) => {
            //判断定时器是否存在，存在则清除
            if(timer.value){
                clearInterval(timer.value);
            }
            //setTimeout  只执行一次                           setTimeout.clearTimeout(变量)
            //setInterval 不断的执行，需要满足指定条件才会停止   setInterval.clearTimeout(变量)
            let time = number;
            timer.value = setInterval(() => {
                time--
                if(time === 0){
                    clearInterval(timer.value);
                    updateButtonStatus({
                        status:false,
                        text:'重新发送'
                    });
                }else{
                    codeButtonStatus.text = `倒计时${time}秒`;
                }
            },1000)
        });
        /**
         * 清除倒计时
         */
        const clearCountDown = (() => {
            //还原验证码按钮默认状态
            updateButtonStatus({
                status:false,
                text:'获取验证码'
            });
            //清除倒计时
            clearInterval(timer.value);
        });
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
            codeButtonStatus,
        };
    },
    created() {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
//scoped：局部文件有效
#login {
    // height: 100vh;
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

<!--

密码加密：
1、在前端预先加密一次
登录的密码：123123（普通字符串）
经过加密后：sha1(123123) == '0c75a603b6b71628c598b1ada10f30ceced89814' (加密后的字符串)

2、后台加密
接收到字符串：'0c75a603b6b71628c598b1ada10f30ceced89814'
后台再次加密：md5('0c75a603b6b71628c598b1ada10f30ceced89814') == '457c53b18caf685b5f8ec1c5ac80f9dc'
最终写入数据库：  '457c53b18caf685b5f8ec1c5ac80f9dc'

3、登录
用户名与加密后的密码进行匹配，成功则登录，失败则提示

-->