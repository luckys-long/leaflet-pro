<template>
  <iframe
    ref="iframeDom"
    :src="src"
    frameborder="0"
    scrolling="no"
    style="width: 100%; height: calc(100% - 10px)"
  ></iframe>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { getVideoList } from "@/api";

const src = ref("");

const dealVideo = (data) => {
  let vedioListRes=[];
  data.map((item) => {
    vedioListRes.push({
      videoPosx: item.posx,
      videoPosy: item.posy,
      videoPosz: item.posz,
      videoIp: item.videoIp,
      videoName: item.videoUser,
      videoUser: item.videoName,
      videoPsd: item.videoPsd,
      videoType: item.videoType,
      videoWs: item.videoWs,
    });
  });
  return vedioListRes;
};

const initVideo = async () => {
  src.value = "/hkws-vedio/index.html";
  const res= await getVideoList();
const { list } = res;
 let listNew= dealVideo(list)
  if (listNew.length < 4) {
    for (let i = 0; i <= 5 - listNew.length; i += 1) {
      listNew.push(listNew[i]);
    }
  }
  localStorage.setItem("vedioList", JSON.stringify(listNew));
};

onMounted(() => {
  initVideo();
});
</script>

<style></style>
