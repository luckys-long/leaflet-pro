<template>
  <div class="item-title">
    <div class="item-title-line-1"></div>
    <div class="item-title-line-2"></div>
    <span>{{ title }}</span>
    <div class="item-title-line-2"></div>
    <div class="item-title-line-1"></div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title: string;
};
withDefaults(defineProps<Props>(), {
    title: '',
});

</script>

<style lang="scss">

.item-title {
    color: #6eeffe;
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      font-size: 16px;
    }
    .item-title-line-1 {
      width: vw(87);
      height: 1px;
      background: #004f84;
    }
    .item-title-line-2 {
      width: vw(3);
      height: vh(14);
      background: #01f3ff;
    }
  }
</style>
