<template>
  <div>
    <iamge-cropper ref="imageCropperRef" :cut-area-radius="200">
      <template #tip>选择图片</template>
    </iamge-cropper>
    <button @click="imageCropperRef.reset">重置</button>
    <button @click="imageCropperRef.save">保存</button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import iamgeCropper from "./assets/image-cropper.vue";

const imageCropperRef = ref();
</script>
