<template>
  <div class="station-container">
    <ScreenHeader />
    <div class="station-main">
      <div class="s-left">
        <div class="left-show">
          <span>{{ showInfo.name }}</span>
          <img class="show-img" :src="showInfo.bigImg" alt="#" />
        </div>
        <img class="left-img" :src="leftCenter" alt=" 背景" />
        <div class="img-wrap">
          <div
            class="img-item"
            v-for="item in typeList"
            :style="item?.styles"
            @click="handleActive(item)"
          >
            <img :src="item.smallImg" alt="#" />
            <span class="item-text">{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="s-right">
        <MyTable
          class="tabel-data"
          :column="column"
          :data="tableDataList"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <template #nodeStatus="{ row }">
            <div
              :style="`color:${row?.nodeStatus === 1 ? '#11c15a' : '#df3124'}`"
            >
              {{ row?.nodeStatus === 1 ? "在线" : "离线" }}
            </div>
          </template>
        </MyTable>
        <el-button type="primary" class="repair" @click="handleRepair"
          >报修</el-button
        >
        <Pagination
          :total="totalPage"
          :current-page="currentPage"
          @page-change="pageChange"
          @size-change="sizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ScreenHeader from "@/layout/components/bigScreenHeader.vue";
import fourG from "@/assets/station/4G.png";
import fourGB from "@/assets/station/4G-b.png";
import fiveG from "@/assets/station/5G.png";
import fiveGB from "@/assets/station/5G-b.png";
import all from "@/assets/station/all.png";
import allB from "@/assets/station/all-b.png";
import pos from "@/assets/station/pos.png";
import posB from "@/assets/station/pos-b.png";
import wifi6 from "@/assets/station/WiFi6.png";
import wifi6B from "@/assets/station/WiFi6-b.png";
import leftCenter from "@/assets/station/circle.png";

import MyTable from "@/components/Table";
import Pagination from "@/components/pagination.vue";
import useStationList from "./useList";
import { ElButton, ElMessage } from "element-plus";
import { ringUp } from "@/api"; //报修
import { useGlobalStore } from "@/store/global";

const { getList, tableDataList, totalPage, pageSize, currentPage } =
  useStationList();

const globalStore = useGlobalStore();
const showInfo = ref({
  name: "5G基站",
  smallImg: fiveG,
  bigImg: fiveGB,
  styles: {
    position: "absolute",
    left: "20.9vw",
    top: "52vh",
  },
});

// 初始化默认显示列表数据
getList(1, 12);

const getActiveTypeList = (type) => {
  getList(1, 12, type);
};


const handleActive = (item) => {
  showInfo.value = item;
  getActiveTypeList(item.name);
};

const typeList = ref([
  {
    name: "4G基站",
    smallImg: fourG,
    bigImg: fourGB,
    styles: {
      position: "absolute",
      top: "28vh",
      left: "4.5vw",
    },
  },
  {
    name: "融合基站",
    smallImg: all,
    bigImg: allB,
    styles: {
      position: "absolute",
      left: "8.9vw",
      top: "47vh",
    },
  },
  {
    name: "5G基站",
    smallImg: fiveG,
    bigImg: fiveGB,
    styles: {
      position: "absolute",
      left: "20.9vw",
      top: "52vh",
    },
  },
  {
    name: "WIFI6基站",
    smallImg: wifi6,
    bigImg: wifi6B,
    styles: {
      position: "absolute",
      left: "31.5vw",
      top: "47vh",
    },
  },
  {
    name: "定位基站",
    smallImg: pos,
    bigImg: posB,
    styles: {
      position: "absolute",
      top: "28vh",
      left: "37.5vw",
    },
  },
]);

const pageChange = (i) => {
  currentPage.value = i;
  getList(i,pageSize.value,showInfo.value.name);
};

const sizeChange = (size) => {
  pageSize.value = size;
  getList(currentPage.value, size,showInfo.value.name);
};

// 表格
const column = [
  {
    type: "index",
    label: "序号",
    width:80,
  },
  {
    prop: "nodeName",
    label: "基站名称",
  },
  {
    prop: "nodeModel",
    label: "基站型号",
  },
  {
    prop: "nodeIp",
    label: "IP地址",
  },

  {
    prop: "nodeStatus",
    label: "基站状态",
    slotName: "nodeStatus",
  },
];

const handleRepair = async () => {
  try {
    await ringUp({
      calledNumber: globalStore.sysInfo.maintenanceNumber,
      callerNumber: "8001",
    });
    ElMessage({
      message: `呼叫维修人员${globalStore.sysInfo.maintenanceName}-${globalStore.sysInfo.maintenanceNumber}成功`,
      type: "success",
    });
  } catch {
    ElMessage({
      message: "呼叫失败",
      type: "error",
    });
  }
};
</script>

<style lang="scss" scoped>
.station-container {
  width: vw(1920);
  height: vh(1080);
  @include setBgByUrl("@/assets/icon_map/home-bg.png");
  .station-main {
    display: flex;
    width: 97.6vw;
    height: calc(100vh - 60px);
    margin-left: 1.3vw;
    @include setBgByUrl("@/assets/station/station-b.png");

    .s-left {
      flex: 1;
      position: relative;
      .left-img {
        position: absolute;
        left: 2vw;
        top: 5vh;
        width: 42.09375vw;
        height: 84.62963vh;
      }
      .left-show {
        @include flexCenter;
        flex-direction: column;
        color: #fff;
        position: absolute;
        left: 19.5vw;
        top: 15vh;
        z-index: 999;
        .show-img {
          margin-top: 10px;
          width: vw(145);
          height: vh(211)
        }
      }

      .img-item {
        @include flexCenter;
        flex-direction: column;
        cursor: pointer;
        img:hover,
        img:focus,
        img:active {
          -webkit-transform: scale(1.1);
          transform: scale(1.1);
          animation: fadenum 1s;
        }
        @keyframes fadenum {
          100% {
            transform: rotate(360deg);
          }
        }
        .item-text {
          color: #01d6df;
        }
      }
    }
    .s-right {
      position: relative;
      flex: 1;
      width: 50%;
      padding-left: 4vw;
      padding-right: 4vw;
      padding-top: 10vh;

      .tabel-data {
      }
      .repair {
        width: vw(200);
        height: vh(40);
        color: #e3e5e8;
        margin-left: 30vw;
        margin-top: 4vh;
        background: #0b2852;
        letter-spacing: 3px;
      }
      .pagination-wrap {
        width: vw(800);
        margin-top: 20px;

        .el-pagination {
          :deep(.el-pagination__total) {
            color: #008cff !important;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
:deep(.el-table),
:deep(.el-table tr) {
  background: transparent;
  /* color:#e3e5e8; */
}

:deep(.el-table tbody tr) {
  color: #e3e5e8;
  text-align: center;
}

:deep(.pagination-wrap),
:deep(.el-pagination) {
  background: transparent;
  color: #008cff;
}

:deep(.el-table td),
:deep(.el-table th.is-leaf) {
  border: none;
}

:deep(.el-table thead) {
  color: #44c2f7 !important;
  background: #11316e;
}

.el-table__empty-text {
  color: #008cff !important;
}


:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: #122b5d;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #182f54 ;
}

:deep(.el-table th.el-table__cell > .cell) {
  font-size: 0.55rem !important;
}

:deep(.el-table th),
:deep(.el-table tr) {
  background: transparent !important;
  line-height: 20px !important;
  height: 20px !important;
}

:deep(.el-table__empty-text) {
  color: #e3e5e8;
  font-size: 0.55rem !important;
}

:deep(.el-table--border::after),
:deep(.el-table--border::before),
:deep(.el-table--border .el-table__inner-wrapper::after),
:deep(.el-table__inner-wrapper::before) {
  background-color: transparent !important;
}

:deep(.el-table td.el-table__cell div) {
  font-size: 0.55rem;
  text-align: center;
}

/* 分页 */
:deep(.el-pagination span:not([class*="suffix"])),
:deep(.el-pagination button) {
  color: #008cff !important;
}

:deep(.el-input) {
  --el-text-color-placeholder: #008cff;
  --el-input-text-color: #008cff;
  --el-input-bg-color: #0b2852;
}

:deep(.el-input .el-input__inner) {
  box-shadow: none;
  border: 1px solid #008cff;
}
:deep(.el-table__border-left-patch) {
  display: none;
}
:deep(.el-table--border .el-table__inner-wrapper tr:first-child td:first-child) {
  border-left: none !important;
}
:deep(.el-table--border .el-table__inner-wrapper tr:first-child th:first-child) {
  border-left: none !important;
}

:deep(.el-pagination span:not([class*="suffix"])),
:deep(.el-pagination button) {
  background: #0b2852 !important;
}

:deep(.el-pager li) {
  background: #0b2852 !important;
}

:deep(.el-select-dropdown__list) {
  background: #0b2852 !important;
}

:deep(.el-select-dropdown__item) {
  color: #e3e5e8 !important;
}
:deep(.el-select .el-input .el-select__caret.el-icon){
  color:  #008cff;
}

:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background: #0b2852 !important;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: #008cff;
}

:deep(.el-select__popper) {
  background: #0b2852;
}

:deep(.el-table__body-wrapper) {
  display: block;
  height: 480px;
  max-height: 580px;
  overflow-x: hidden;
  overflow-y: scroll;
  // width: 100%;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  display: none;
  width: 2px;
  background-color: #061736;
}


/*定义滚动条轨道 内阴影+圆角*/
:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}

/*定义滑块 内阴影+圆角*/
:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  border-radius: 1px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #0792d7;
}
</style>
