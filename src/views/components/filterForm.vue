<template>
  <div class="search-card">
    <el-checkbox-group v-model="checkedList" @change="handleCheck">
      <el-checkbox
        v-for="item in deviceList"
        :key="item.value"
        :label="item.value"
        ><img :src="MAP_USED_IMG[item.value]" alt="#" class="img_icon"/>{{ item.label }}</el-checkbox
      >
    </el-checkbox-group>
    <!-- <div class="search-btn" @click="handleSearch">查询</div> -->
  </div>
</template>

<script setup>
import { ref,onUnmounted } from "vue";
import { ElCheckboxGroup, ElCheckbox } from "element-plus";
import { getAlldsInfo } from '@/api/longrmap'
import { HANDLE_CLICK_SEARCH } from "@/constants/eventbus";
import { MAP_USED_IMG } from '@/constants/category'
import { useMitt } from "@/hooks/utils";
import { dsInfo  } from '@/mock'

const checkedList = ref([0,1,2,3,6,8]);
const emitter = useMitt();

const deviceList = [
  { label: "基站", value: 0 },
  { label: "广播", value: 6 },
  { label: "摄像头", value: 1 },
  { label: "有线电话", value: 2 },
  { label: "外线电话", value: 8 },
  { label: "ups电源", value: 3 },
];
const handleCheck = async() => {
 const res= await getAlldsInfo({deviceTypeList:[...checkedList.value]})
  // const res =dsInfo.filter(item=>checkedList.value.includes(item.deviceType))
emitter.emit(HANDLE_CLICK_SEARCH, res);

};

onUnmounted(() => {
  emitter.off(HANDLE_CLICK_SEARCH);
});

</script>

<style lang="scss" scoped>
.search-card {
  position: absolute;
  right:0vw;
  top: 7vh;
  z-index: 9999;
  padding: 1vw;
  width: 18vw;
  min-width: 328px;
  height: 10vh;
  line-height: 10vh;
  background: rgba(9, 46, 85, 0.5);
  border: 1px solid #3289ab;
  :deep(.el-checkbox-group) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
  :deep(.el-checkbox__label){
    @include flexCenter;
  }
  .img_icon{
    width: 1.2vw;
    height: 1.2vw
  }
}
.search-btn {
  @include flexCenter;
  position: absolute;
  top: 17vh;
  left: 7.8vw;
  font-size: 14px;
  z-index: 9999;
  color: #00fee7;
  cursor: pointer;
  width: 92px;
  height: 37px;
  background-image: url("@/assets/posIcon/homequery.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
