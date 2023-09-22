
import request from '@/service/request';


  
// 1.获取终端状态数据统计接口
  export async function getDeviceStatus() {
    return request(
      {
        url: '/sta/api/dsdevice',
        method: 'GET',
      }
    );
  }

  // 2.终端总数量统计

  export async function getDeviceInfo(data) {
    return request(
      {
        url: '/sta/api/devicesummary',
        method: 'GET',
        params: {
            ...data
          },
      }
    );
  }

  // 3.录音数量统计

  export async function getNumOfRecordings(data) {
    return request(
      {
        url: '/sts/fuse/sumdata',
        method: 'GET',
        params: {
            ...data
          },
      }
    );
  }
  // 4.录音系统参数

  export async function getSystemRunInfo(data) {
    return request(
      {
        url: '/sts/fuse/systemInfo',
        method: 'GET',
        params: {
            ...data
          },
      }
    );
  }
  

  export async function getMenuList() {
    return request({
      url: '/sts/systemList',
      method: 'GET'
    })
  }
  
  
  export async function getMinerList() {
    return request({
      url: '/sts/kmlist',
      method: 'GET'
    })
  }
  

  
export async function getVideoList(data) {
  return request(
    {
      url: '/api/video/videoList?pageNum=1&pageSize=10',
      method: 'GET',
      params: {
          ...data
        },
    }
  );
}


// export async function getVideoList() {
//   return request({
//     url: '/video/api/videoList',
//     method: 'GET'
//   })
// }

  
    export async function getPlanList(data) {
    return request(
      {
        url: '/api/plan/planList',
        method: 'GET',
        params: {
          ...data
        },
      }
    );
  }


  export async function startPlan(data) {
    return request(
      {
        url: `/api/plan/broadcastPlan`,
        method: 'POST',
        data
      }
    );
  }
  
  export async function ringUp(data) {
    return request(
      {
        url: `/call/freeSwitch/eslCall`,
        method: 'POST',
        params: {
          ...data
        },
      }
    );
  }

  export async function callVideo(data) {
    return request(
      {
        url: `/call/freeSwitch/eslVideo`,
        method: 'POST',
        params: {
          ...data
        },
      }
    );
  }
  
  // 基站状态的 饼图数据
  export async function getStationPercentage() {
    return request({
      url: '/api/station/getStationPercentage',
      method: 'GET'
    })
  }
  

  
  /*
  * 井下数据统计的相关接口 
  */

  // 获取人员总数
  export async function getTotalPerson() {
    return request({
      url: '/api/getRegisAndDownNum',
      method: 'GET'
    })
  }
  
  // 获取

  // 获取终端总数 基站总数

  export async function getNumOfDifferentTypes(data) {
    return request(
      {
        url: `/api/common/getNumOfDifferentTypes`,
        method: 'GET',
        params: {
          ...data
        },
      }
    );
  }

  
// 基站详情子页面,获取所有基站列表
export async function getApstateList(data) {
  return request(
    {
      url: '/api/station/stationList',
      method: 'GET' ,
      params: {
        ...data
      },
    }
  );
}



