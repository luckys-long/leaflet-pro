<template>
  <MyCard title="终端状态">
    <template #content>
      <div class="status-list">
        <div class="list-item" v-for="item in statusList">
          <div class="item-text">
            <span style="display: inline-block; width: 5vw">{{
              item.typename
            }}</span>
            <span
              style="
                color: rgba(253, 244, 118, 1);
                display: inline-block;
                width: 5vw;
                justify-content: flex-start;
              "
              >在线{{ item.onsum }}台</span
            >
            <span>{{ item.sum }}台</span>
          </div>
          <ElProgress :percentage="~~item.precent" :color="color"></ElProgress>
        </div>
      </div>
    </template>
  </MyCard>
</template>

<script setup>
import MyCard from "@/components/myCard.vue";
import { ElProgress } from "element-plus";
import { getDeviceStatus } from "@/api";
import { ref } from "vue";

const color = "rgba(0, 240, 255, 0.8)";
const statusList = ref([]);
const dealData = (item) => {
  const _item = item;
  _item.precent = (item.onsum / item.sum) * 100;
};

const init = async () => {
  const list = await getDeviceStatus();
  // const list = [
  //   { typename: "有线电话", onsum: 12, sum: 12 },
  //   { typename: "无线电话", onsum: 2, sum: 5 },
  //   { typename: "广播", onsum: 4, sum: 8 },
  //   { typename: "外线线电话", onsum: 1, sum: 6 },
  // ];
  list.map((item) => {
    dealData(item);
    return item;
  });
  statusList.value = list;
};
init();
</script>

<style lang="scss" scoped>
:deep(.el-progress__text) {
  font-size: 12.3px !important;
  color: rgba(253, 244, 118, 1);
}
.status-list {
  box-sizing: border-box;
  height: vh(203);
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 1vw;
  padding-bottom: 1vw;
  padding-left: 2vw;
  .list-item {
    display: flex;
    flex-direction: column;
    .item-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding-right: vw(50);
    }
  }
}
</style>
