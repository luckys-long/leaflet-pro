<template>
  <div class="card-wrap">
    <div class="card-title">{{ title }} <img :src="arrow" alt="箭头" @click="$emit('jump')"/></div>
    <div class="card-conter">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import arrow from "@/assets/icon_map/arrow.png";

type Props = {
  title: string;
};
const props = withDefaults(defineProps<Props>(), {
  title: "",
});




</script>

<style lang="scss">
.card-wrap {
  box-sizing: border-box;
  background: linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
  box-shadow: 0px 2px 5px 0px #000000;

  .card-title {
    @include flexBetween;
    height: vh(50);
    width: vw(325);
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 400;
    padding-left: vw(25);
    border-bottom: 2px solid #335e97;
    img {
      width: vw(18);
      height: vh(18);
      cursor: pointer;
    }
  }
}
</style>
