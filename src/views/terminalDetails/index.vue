<template>
  <div class="terminal-wrap">
    <ScreenHeader />
    <div class="wrap-content">
      <Left></Left>
      <Center></Center>
      <Right></Right>
    </div>
  </div>
</template>

<script setup>
import ScreenHeader from "@/layout/components/bigScreenHeader.vue";
import Center from "./components/center.vue";
import Left from "./components/left.vue";
import Right from "./components/right.vue";
</script>
<style lang="scss" scoped>
.terminal-wrap {
  width: vw(1920);
  height: vh(1080);
  background-image: url("@/assets/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .wrap-content {
    display: flex;
  }
}
</style>
