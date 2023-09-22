
const  monitorCenterRoutes = {
    path: '/monitor',
    // component: () => import('@/layout/index.vue'),
    redirect: '/monitor/index',
    meta: {
      title: '监控中心',
      name: 'monitorCenter',
      isHide:true,
      icon:'iconfont icon-jiankong',
      // permission: [permission]
    },
    children: [
        {
          path: 'index',
          name: 'monitorCenterIndex',
          component: () => import('@/views/home.vue'),
        }
    ]
};



export default {
    monitorCenterRoutes,
   
};
