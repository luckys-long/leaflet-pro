# Vue 3 + Vite 脚手架

- vue3+vite 其中也装了tsx插件，可以用tsx开发 

# 启动步骤

- yarn
- yarn dev

# 部署

- yarn build
- yarn preview

# 目录结构

|-node_modules      -- 项目依赖包的目录
|-public            -- 项目公用文件
  |--favicon.ico    -- 网站地址栏前面的小图标
  |--hkws-vedio     -- 海康威视提供的视屏监控包
|-src               -- 应用程序源代码目录
  |-api             -- 存放后端接口目录
  |-assets          -- 静态文件目录，图片图标，比如网站logo
  |-components      -- Vue3.x的自定义公共组件目录
    |-canvas        -- leaflet，gis地图类分装
    |-Form          -- Form表单封装，支持JSon配置化
    |-Table         -- table表单,tsx封装,支持JSon配置化
    |-其他           -- ...其他自由式封装
  |--constants      -- 项目常量存放目录，如枚举类，eventbus类
  |--directive      -- 给Vue添加自定义指令如v-permission
  |--hooks          -- 常用的工具类自定义hooks
  |--layout         -- 项目基本骨架，如侧边栏布局，双飞翼布局等
  |--mock           -- mock模拟数据
  |--model          -- 接口返回值ts类型数据定义
  |--router         -- vue-router路由配置
  |--service        -- 封装axios，拦截器
  |--store          -- pinia状态管理
  |--utils          -- 公用工具类方法
  |--views          -- 开发界面的地方
  |--App.vue        -- 项目的根组件
  |--404.vue        -- 路由出错展示的页面
  |--auto-import.d  -- 自动导入vue3相关钩子
  |--main.js        -- 项目入口文件，SPA单页应用都需要入口文件
|--.gitignore       -- git的管理配置文件，设置那些目录或文件不管理
|-- index.html      -- 项目的默认首页，Vue的组件需要挂载到这个文件上
|-- package-lock.json --项目包的锁定文件，用于防止包版本不一样导致的错误
|-- package.json    -- 项目配置文件，包管理、项目名称、版本和命令
|-- vite.config     -- vite配置文件
