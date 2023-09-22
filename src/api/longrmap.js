
   
import request from '@/service/request';
import QS from 'qs'

   // 3. 获取电话信息 typeCode
  export async function getdsPhoneInfo(data) {
    return request(
      {
        url: `/sta/api/dsPhone?typeCode=${data.typeCode}`,
        method: 'GET',
      }
    );
  }

    // 通过IP获取基站详情
    export async function getStationByIp(data) {
      return request({
        url: '/api/station/getStationByIp',
        method: 'GET',
        params: {
          ...data
        },
      })
    }

    // 通过ip获取ups电源详情
    export async function getUpsByIp(data) {
      return request({
        url: '/api/ups/getUpsByIp',
        method: 'GET',
        params: {
          ...data
        },
      })
    }
   // 通过ip获取摄像头
   export async function getVideoByIp(data) {
    return request({
      url: '/api/video/getVideoByIp',
      method: 'GET',
      params: {
        ...data
      },
    })
  }

  export async function getAlldsInfo(data) {
    return request(
      {
        url: `/api/common/getAllDevicePositions`,
        method: 'GET',
        params: {
          ...data
        },
        paramsSerializer(params) {
          return QS.stringify(params, { arrayFormat: 'repeat' });
        }
      }
    );
  }

  export async function getUserList() {
    return request(
      {
        url: `/loc/nointercept/dataFor3D/getUserList`,
        method: 'GET',
      }
    );
  }


  export async function getUserDetail(data) {
    return request(
      {
        url: `/loc/nointercept/dataFor3D/getUserDetail`,
        method: 'GET',
        params: {
          ...data
        },
      }
    );
  }

  // 通过名称查找井下人员

  export async function findduser(data) {
    return request(
      {
        url: `/loc/interfaces/personcontroller/findduser`,
        method: 'GET',
        params: {
          ...data,
        },
      }
    );
  }

  export async function getSysInfo() {
    return request(
      {
        url: `/api/sysInfo/getSysInfo`,
        method: 'GET',
      }
    );
  }

  export async function getNumOf5GDevice() {
    return request(
      {
        url: `/api/common/getNumOf5GDevice`,
        method: 'GET',
      }
    );
  }
  
  

  // http://192.168.0.205:8080/nointercept/dataFor3D/getUserList