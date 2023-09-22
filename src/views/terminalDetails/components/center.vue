<template>
  <div class="wrap-center">
    <div class="center-top">语音通讯终端</div>
    <div class="center-middle">
      <div class="center-show-img">
        <img
          :src="topImgSrc"
          alt="#"
          :class="`imgs ${changeShowImg ? 'item-img' : ''}`"
        />
      </div>
      <div class="middle-scroll">
        <div class="scroll-arrow-left" @click="handleShowPrev"></div>
        <div class="scroll-center">
          <!--  -->
          <el-carousel
            ref="caruselRef"
            type="card"
            :autoplay="false"
            arrow="nerver"
            @change="handleChange"
          >
            <el-carousel-item
              v-for="(item, i) in scrollShowImg"
              :key="i"
              :name="item.label"
            >
              <img :src="item.src" alt="" style="width: 75px; height: 55px" />
              <span style="margin-top: 5px">{{ item.label }}</span>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="scroll-arrow-right" @click="handleShowNext"></div>
      </div>
    </div>
    <div class="center-bottom-line"></div>
    <div class="center-bottom">
      <div class="scroll-herader">
        <span>号码</span><span>号码名称</span><span>注册IP</span
        ><span>类型名称</span>
      </div>
      <SeamlessScroll class="the-demo-list" :delay="1" :duration="1">
        <div class="the-demo-list__item" v-for="(item, index) in scrollList">
          <span
            style="
              display: inline-block;
              width: 5vw;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ item?.extensionNum }}</span
          ><span
            style="
              display: inline-block;
              width: 5vw;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ item?.extensionName }}</span
          ><span
            style="
              display: inline-block;
              width: 8vw;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ item?.ip }}</span
          ><span
            style="
              display: inline-block;
              width: 5vw;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ item?.typeName }}</span
          >
        </div>
      </SeamlessScroll>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SeamlessScroll from "@/components/autoScrollTable.vue";
import phoneIcon from "@/assets/teminal/phone.png";
import wireTelephone from "@/assets/teminal/wire-telephone.png";
import wireLessTelephone from "@/assets/teminal/wireless-telephone.png";
import phoneCenter from "@/assets/teminal/phone-center.png";
import RC from "@/assets/teminal/R-C.png";

import { ElCarousel, ElCarouselItem } from "element-plus";

import { getdsPhoneInfo } from "@/api/longrmap";
import { terminalList } from '@/mock'

const changeShowImg = ref(false);
const caruselRef = ref(null);
const topImgSrc = ref(wireTelephone);

const scrollShowImg = [
  {
    src: phoneIcon,
    label: "有线电话",
    imgSrc: wireTelephone,
    typeCode: [2, 1, 11],
  },
  {
    src: phoneIcon,
    label: "无线电话",
    imgSrc: wireLessTelephone,
    typeCode: [3],
  },
  {
    src: phoneIcon,
    label: "外线电话",
    imgSrc: phoneCenter,
    typeCode: [8],
  },
  {
    src: phoneIcon,
    label: "广播",
    imgSrc: RC,
    typeCode: [6, 7],
  },
];

const scrollList = ref([]);

const handleChange = async (i) => {
  topImgSrc.value = scrollShowImg[i].imgSrc;
  const res = await getdsPhoneInfo({
    typeCode: scrollShowImg[i].typeCode.join(","),
  });
  // mock数据
  // const res=terminalList.filter(item=>scrollShowImg[i].label===item.typeName)
  scrollList.value = res;
};

const initList= async ()=>{
  const res= await getdsPhoneInfo({
    typeCode: '2, 1, 11',
  })
  // mock数据
  console.log("===>",terminalList)
  // const res =terminalList.filter(item=>'有线电话'===item.typeName)
  scrollList.value = res;
}

const handleShowNext = () => {
  caruselRef.value.next();
};
const handleShowPrev = () => {
  caruselRef.value.prev();
};
initList()
</script>

<style lang="scss" scoped>
.wrap-center {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐 */
  flex: 1;
  height: 96vh;
  .center-top {
    @include flexCenter;
    @include setBgByUrl("@/assets/teminal/title-bar.png");
    margin-top: 2.2vh;
    width: 35vw;
    height: 6vh;
    color: #01abd8;
    font-weight: bold;
  }
  .center-middle {
    @include flexCenter;
    flex-direction: column;
    .center-show-img {
      @include setBgByUrl("@/assets/teminal/circle-btm.png");
      @include flexCenter;
      width: 18vw;
      height: 30vh;
      .imgs {
        width: 8vw;
        height: 15vh;
        margin-top: -6vw;
        transition: all 0.8s;
      }
      .item-img {
        cursor: pointer;
        animation: hiddenTransition 900ms ease-in-out;
        animation-fill-mode: forwards;
        will-change: opacity, transform, display;
      }
      @keyframes hiddenTransition {
        0% {
          opacity: 1;
          transform: none;
        }
        50% {
          opacity: 0;
          transform: translateX(40%);
        }
        70% {
          opacity: 0;
          transform: translateX(-40%);
        }
        100% {
          opacity: 1;
          transform: none;
        }
      }
    }
    .middle-scroll {
      display: flex;
      align-items: center;
      width: 43vw;
      height: 12vh;
      margin-top: 3vh;
      .scroll-arrow-left {
        @include setBgByUrl("@/assets/teminal/left-arrow.png");
        width: 2vw;
        height: 6vh;
        margin-right: 2vw;
        cursor: pointer;
      }

      .scroll-center {
        flex: 1;
        color: #fff;
        :deep(.el-carousel__container) {
          height: 13vh;
          @include flexCenter;
        }
        :deep(.el-carousel__item--card) {
          @include flexCenter;
          flex-direction: column;
        }
        :deep(.el-carousel__mask) {
        }
        :deep(.el-carousel__arrow) {
          display: none !important;
        }

        .el-carousel__item:nth-child(2n) {
          @include setBgByUrl("@/assets/teminal/roll.png");
        }

        .el-carousel__item:nth-child(2n + 1) {
          @include setBgByUrl("@/assets/teminal/roll.png");
        }
      }
      .scroll-arrow-right {
        width: 2vw;
        height: 6vh;
        margin-left: 2vw;
        @include setBgByUrl("@/assets/teminal/right-arrow.png");
        cursor: pointer;
      }
    }
  }
  .center-bottom-line {
    width: 44vw;
    height: 8vh;
    margin-left: 0.5vw;
    margin-bottom: 0.5vw;
    @include setBgByUrl("@/assets/teminal/light.png");
  }
  .center-bottom {
    width: 30vw;
    height: 23vh;
    padding: 22px;
    background: rgba(19, 64, 119, 0.1);
    @include setBgByUrl("@/assets/teminal/btm-center.png");
  }
  .scroll-herader {
    display: flex;
    color: #01abd8;
    font-weight: bold;
    margin-top: 20px;
    justify-content: space-around;
    height: 36px;
    line-height: 36px;
  }
  .the-demo-list {
    margin-top: 1vh;
    color: #fff;
    height: 16.7vh;
    &__item {
      height: 34px;
      font-size: 14px;
      line-height: 34px;
      display: flex;
      justify-content: space-around;
      :first-child {
        width: 50px;
        @include flexCenter;
      }
    }

    :deep(
        .seamless-scroll__box--odd
          .seamless-scroll__box-top
          > *:nth-child(2n + 1)
      ) {
      background-color: rgba(20, 68, 122, 0.6);
    }

    :deep(
        .seamless-scroll__box--odd
          .seamless-scroll__box-bottom
          > *:nth-child(2n)
      ) {
      background-color: rgba(20, 68, 122, 0.6);
    }
    :deep(
        .seamless-scroll__box--even
          .seamless-scroll__box-top
          > *:nth-child(2n + 1)
      ) {
      background-color: rgba(20, 68, 122, 0.6);
    }

    :deep(
        .seamless-scroll__box--even
          .seamless-scroll__box-bottom
          > *:nth-child(2n + 1)
      ) {
      background-color: rgba(20, 68, 122, 0.6);
    }
  }
}
</style>
