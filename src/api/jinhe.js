

import request from '@/service/request';


export async function getDeviceLocation(data) {
    return request(
      {
        url: '/jinhe/positionCollect/getDeviceLocation',
        method: 'GET',
        params: {
            ...data
          },
      }
    );
  }
