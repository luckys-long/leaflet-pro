import { ref, type Ref } from 'vue';
import { getApstateList } from '@/api'
import type { logManageListType } from '@/model/log';
import { stationList } from '@/mock'

interface Result {
  tableDataList: Ref<Array<logManageListType>>;
  getList: (pageNum: number,  size?: number,nodeType?:string) => void;
  totalPage: Ref<number>;
  pageSize: Ref<number>;
  currentPage: Ref<number>;
  loading: Ref<boolean>;
}

const tableDataList: Ref<Array<any>> = ref([]);
const totalPage: Ref<number> = ref(0);
const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(12);

const loading: Ref<boolean> = ref(false);

const dealData = (item: any): void => {
   // const _item = item;
};


const getList = async (pageNum: number,  size = 12,nodeType='5G基站') => {
  try {
    loading.value=true
    const res: any = await getApstateList({
      pageNum:pageNum,
      pageSize: size,
      nodeType:nodeType
    });
    const { list, total } = res;
    list.map((item: any) => {
      dealData(item);
      return item;
    });
    tableDataList.value = list.filter(item=>item.nodeType===nodeType);
    totalPage.value = ~~total;
    currentPage.value = pageNum;
    loading.value = false;
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

const useStationList = (): Result => ({
  getList,
  pageSize,
  tableDataList,
  totalPage,
  currentPage,
  loading,
});

export default useStationList;
