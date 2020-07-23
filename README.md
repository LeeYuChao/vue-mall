# vue-mall

### 图标样式等
图标库采用 Fontawesome 如果需要图表或字体样式，可进入官网 https://fontawesome.dashgame.com/ 学习使用

### 启动项目
1、下载安装node.js  
>http://nodejs.cn/download/  cmd 中输入命令  node -v 、npm -v  查看版本，如果看到版本就代表安装成功

2、在node.js的cmd组件（command prompt）中安装vue-cli
>npm install vue-cli -g  此为低版本非3.0
*卸载：如果已经全局安装过则需要先卸载： 
>npm uninstall vue-cli -g
*安装：
>npm install -g @vue/cli
*查看版本号： 
>vue -V  出现版本号即安装成功
*3.0对2.0版本的桥接：
>npm install -g@vue/cli-init
*安装淘宝镜像cnpm（非必装） 
>npm install -g cnpm --registry=https://registry.npm.taobao.org

3、配置 Vue路由 Element-UI组件库
*安装vue-router
>npm install vue-router --save-dev
*安装element-ui
>npm i element-ui -S
*安装 SASS 加载器
>npm install sass-loader node-sass --save-dev
*依赖 Compositoin API
>npm install @vue/composition-api --save
*安装 axios
>npm install  axios
*安装依赖
>npm install

4、启动命令：
>npm run serve