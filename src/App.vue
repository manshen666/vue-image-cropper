<template>
  <div>
    <iamge-cropper
      ref="imageCropperRef"
      :width="600"
      :height="300"
      :cut-area-radius="80"
    >
      <template #tip>选择图片</template>
    </iamge-cropper>
    <button @click="imageCropperRef.reset">重置</button>
    <button @click="imageCropperRef.save">保存</button>
    <button @click="getBlob">getBlob</button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import iamgeCropper from "./image-cropper.vue";

const imageCropperRef = ref();
const getBlob = async () => {
  let blob = await imageCropperRef.value.getBlob();
  console.log(blob);
};
</script>
