import { getSysInfo } from '@/api/longrmap';
import { defineStore } from 'pinia'
import {sysInfo} from '@/mock'

export const useGlobalStore = defineStore({
  id: 'global',
  state: () => ({
    collapse: false,
    sysInfo: sysInfo
  }),
  getters: {},
  actions: {
    changeCollapse(collapse) {
      this.collapse = collapse;
    },
    async getSysInfos() {
      const res = await getSysInfo()
      this.sysInfo = res
    }
  },
});

