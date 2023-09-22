import { defineStore } from "pinia";

export const useWebSocketStore = defineStore({
  id: 'webSocketStore',
  state: () => ({
    wsData: {},
    selectedShapList:[]
  }),
  getters: {

  },
  actions: {
    changeWSData(obj: any) {
      this.wsData=obj;
    },
    changSelectedShapList(list: any) {
      this.selectedShapList=list;
    },
  }
});