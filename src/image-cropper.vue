<template>
  <div class="img-cropper" :style="imgCropperStyle">
    <div
      class="fixed-frame"
      @click="imageSelect"
      @wheel="zoom"
      @drop="imageDragSelect"
      @dragover="dragOver"
      @mouseleave="mouseUp()"
      ref="fixedFrameRef"
    >
      <div v-show="!picked" style="user-select: none">
        <slot name="tip">
          <div class="picking-tip">拖拽或单击选择图片</div>
        </slot>
      </div>
      <div
        v-show="picked"
        ref="variableImgBoxRef"
        class="variable-image-box"
        :style="{
          width: `${variableImgBoxPos.width}px`,
          height: `${variableImgBoxPos.height}px`,
          left: `${variableImgBoxPos.left}px`,
          top: `${variableImgBoxPos.top}px`,
        }"
        @click="
          (e) => {
            e.stopPropagation();
          }
        "
        @mousedown="mouseDown"
      >
        <img ref="imageRef" class="selected-image" draggable="false" />
      </div>
      <div class="cut-border" v-show="picked" :style="cutBorderStyle"></div>
      <div
        class="fixed-frame-mask"
        v-show="picked"
        :style="fixedFrameMaskStyle"
      ></div>
    </div>
    <canvas
      ref="canvasRef"
      :width="2 * cutAreaRadius"
      :height="2 * cutAreaRadius"
      v-show="false"
    ></canvas>
    <input
      ref="imageInputRef"
      @change="getImage"
      v-show="false"
      type="file"
      accept="image/*"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 472,
  },
  height: {
    type: Number,
    default: 238,
  },
  cutAreaRadius: {
    type: Number,
    default: 75,
  },
});
const emits = defineEmits({});

const cutAreaRadius =
  props.cutAreaRadius < props.height / 2 &&
  props.cutAreaRadius < props.width / 2
    ? props.cutAreaRadius
    : Math.min(props.height / 2, props.width / 2) - 1;

const imgCropperStyle = reactive({
  width: `${props.width}px`,
  height: `${props.height}px`,
});

const cutBorderStyle = reactive({
  width: `${cutAreaRadius * 2}px`,
  height: `${cutAreaRadius * 2}px`,
});

const fixedFrameMaskStyle = reactive({
  width: `${props.width}px`,
  height: `${props.height}px`,
  clipPath: `path('M 0 0 L ${props.width},0 L ${props.width},${
    props.height / 2
  } L ${props.width / 2 + cutAreaRadius},${
    props.height / 2
  } A ${cutAreaRadius},${cutAreaRadius} 0,0,0 ${
    props.width / 2 - cutAreaRadius
  },${props.height / 2} L 0 ${props.height / 2} L 0,0 L 0,${props.height}  L ${
    props.width
  },${props.height} L ${props.width},${props.height / 2} ${
    props.width / 2 + cutAreaRadius
  },${props.height / 2} A ${cutAreaRadius},${cutAreaRadius} 0,0,1 ${
    props.width / 2 - cutAreaRadius
  },${props.height / 2} L 0 ${props.height / 2} z')`,
});

const picked = ref(false);
const imageSelect = () => {
  if (picked.value) {
    return;
  }
  imageInputRef.value.click();
};

const variableImgBoxRef = ref();
const canvasRef = ref();
const imageInputRef = ref();
const imageRef = ref();
const fixedFrameRef = ref();
const variableImgBoxPos = reactive({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
});
let ctx: CanvasRenderingContext2D;

watch(picked, (newX) => {
  if (newX === false) {
    variableImgBoxPos.top = 0;
    variableImgBoxPos.left = 0;
  } else {
    imageRef.value.onload = () => {
      setVariableImgBoxSize();
    };
  }
});

let maxMoveX: number;
let maxMoveY: number;
const setVariableImgBoxSize = () => {
  let widthRatio =
    fixedFrameRef.value.offsetWidth / imageRef.value.naturalWidth;
  let heightRatio =
    fixedFrameRef.value.offsetHeight / imageRef.value.naturalHeight;
  if (widthRatio >= heightRatio) {
    variableImgBoxPos.height = fixedFrameRef.value.offsetHeight;
    variableImgBoxPos.width = imageRef.value.naturalWidth * heightRatio;
  } else {
    variableImgBoxPos.width = fixedFrameRef.value.offsetWidth;
    variableImgBoxPos.height = imageRef.value.naturalHeight * widthRatio;
  }
  maxMoveX = variableImgBoxPos.width / 2 - cutAreaRadius;
  maxMoveY = variableImgBoxPos.height / 2 - cutAreaRadius;
};

const getImage = (e: Event) => {
  let files = (e.target as HTMLInputElement).files;
  if (files!.length > 0) {
    picked.value = true;
    imageRef.value.src = URL.createObjectURL(files![0]);
  }
};

const getBlob = () => {
  if (!picked.value) {
    console.error("image is null");
    return;
  }
  let initScale = Math.max(
    imageRef.value.naturalWidth / variableImgBoxPos.width,
    imageRef.value.naturalHeight / variableImgBoxPos.height
  );

  ctx.drawImage(
    imageRef.value,
    imageRef.value.naturalWidth / 2 -
      cutAreaRadius * initScale -
      variableImgBoxPos.left * initScale,
    imageRef.value.naturalHeight / 2 -
      cutAreaRadius * initScale -
      variableImgBoxPos.top * initScale,
    cutAreaRadius * 2 * initScale,
    cutAreaRadius * 2 * initScale,
    0,
    0,
    2 * cutAreaRadius,
    2 * cutAreaRadius
  );

  return new Promise<Blob | undefined>((resolve, reject) => {
    canvasRef.value.toBlob(
      (blob: Blob | null) => {
        reset();
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("generate blob error."));
        }
      },
      "image/jpeg",
      1
    );
  });
};

const save = async () => {
  if (!picked.value) {
    return;
  }
  let a = document.createElement("a");
  a.download = `${new Date().getTime()}.png`;
  try {
    const blob = (await getBlob()) as Blob;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (err) {
    console.error("Failed to save:", err);
  }
};

const reset = () => {
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  imageInputRef.value.value = "";
  picked.value = false;
  URL.revokeObjectURL(imageRef.value.src);
};

const dragOver = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer!.dropEffect = "copy";
};

const imageDragSelect = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();

  let files = e.dataTransfer!.files;
  if (files.length > 0) {
    let fileName = files[0].name;
    let suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
    if (suffix == "jpg" || suffix == "png" || suffix == "jpeg") {
      picked.value = true;
      imageRef.value.src = URL.createObjectURL(files[0]);
    }
  }
};

const SCALE = 1.1;
const zoom = (e: WheelEvent) => {
  if (e.deltaY < 0) {
    larger();
  } else {
    smaller();
  }
};

const larger = () => {
  variableImgBoxPos.width *= SCALE;
  variableImgBoxPos.height *= SCALE;
  maxMoveX = variableImgBoxPos.width / 2 - cutAreaRadius;
  maxMoveY = variableImgBoxPos.height / 2 - cutAreaRadius;
};

const smaller = () => {
  if (
    variableImgBoxPos.left >
      variableImgBoxPos.width / SCALE / 2 - cutAreaRadius ||
    variableImgBoxPos.left <
      -(variableImgBoxPos.width / SCALE / 2 - cutAreaRadius) ||
    variableImgBoxPos.top >
      variableImgBoxPos.height / SCALE / 2 - cutAreaRadius ||
    variableImgBoxPos.top <
      -(variableImgBoxPos.height / SCALE / 2 - cutAreaRadius)
  ) {
    return;
  }
  variableImgBoxPos.width /= SCALE;
  variableImgBoxPos.height /= SCALE;
  maxMoveX = variableImgBoxPos.width / 2 - cutAreaRadius;
  maxMoveY = variableImgBoxPos.height / 2 - cutAreaRadius;
};

let mouseDownX: number;
let mouseDownY: number;
let currentTop: number = 0;
let currentLeft: number = 0;

const mouseDown = (e: MouseEvent) => {
  mouseDownX = e.clientX;
  mouseDownY = e.clientY;
  currentTop = variableImgBoxPos.top;
  currentLeft = variableImgBoxPos.left;
  variableImgBoxRef.value.style.cursor = "grabbing";
  fixedFrameRef.value.addEventListener("mousemove", mouseMove);
  fixedFrameRef.value.addEventListener("mouseup", mouseUp);
};

let transX = 0;
let transY = 0;
const mouseMove = (e: MouseEvent) => {
  transX = e.clientX - mouseDownX;
  transY = e.clientY - mouseDownY;
  variableImgBoxPos.top =
    Math.sign(transY + currentTop) *
    Math.min(Math.abs(transY + currentTop), maxMoveY);
  variableImgBoxPos.left =
    Math.sign(transX + currentLeft) *
    Math.min(Math.abs(transX + currentLeft), maxMoveX);
};

const mouseUp = () => {
  fixedFrameRef.value.removeEventListener("mousemove", mouseMove);
  fixedFrameRef.value.removeEventListener("mouseup", mouseUp);
  variableImgBoxRef.value.style.cursor = "grab";
};

defineExpose({
  save,
  reset,
  getBlob,
});

onMounted(() => {
  ctx = canvasRef.value.getContext("2d");
});
</script>

<style lang="scss" scoped>
.img-cropper {
  height: 238px;
  width: 472px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .fixed-frame {
    width: 100%;
    height: 100%;
    border: 1px dashed rgb(173, 163, 163);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .picking-tip {
      color: rgb(159, 159, 164);
    }
    .variable-image-box {
      position: relative;
      cursor: grab;
      width: 100%;
      height: 100%;
      background-color: black;
      .selected-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .cut-border {
      position: absolute;
      border-radius: 50%;
      border: solid 1px rgb(89, 100, 251);
      width: 150px;
      height: 150px;
      pointer-events: none;
    }
    &-mask {
      width: 472px;
      height: 238px;
      background-color: black;
      opacity: 0.4;
      position: fixed;
      pointer-events: none;
    }
  }
}
</style>
