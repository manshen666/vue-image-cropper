<template>
  <div class="vue-img-cropper">
    <div class="img-cropper">
      <div
        class="fixed-frame"
        :style="{ backgroundImage: fixedFrameBgUrl }"
        @click="pickImg"
        @wheel="zoom"
        @drop="fileSelect"
        @dragover="dragOver"
        @mouseleave="mouseUp()"
        ref="fixedFrameRef"
      >
        <div v-show="!picked" class="picking-tip">拖拽或单击选择图片</div>
        <div
          v-show="picked"
          ref="variableImgBoxRef"
          class="variable-image-box"
          :style="{
            width: variableImgBoxPos.width + 'px',
            height: variableImgBoxPos.height + 'px',
            left: variableImgBoxPos.left + 'px',
            top: variableImgBoxPos.top + 'px',
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
        <div class="cut-border" v-show="picked"></div>
        <div class="fixed-frame-mask" v-show="picked"></div>
      </div>

      <div class="bottom-menu" v-show="picked">
        <div class="img-translate">
          <div class="larger" @click="larger">
            <svg
              width="16.000000"
              height="16.000000"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g clip-path="url(#clip8291_26228)">
                <path
                  id="path"
                  d="M15.2402 15.0042L12.7705 12.5347C14.041 11.2057 14.8271 9.41028 14.8271 7.43115C14.8271 3.35327 11.5088 0.0355225 7.43066 0.0355225C3.35352 0.0355225 0.0351562 3.35327 0.0351562 7.43115C0.0351562 11.5089 3.35352 14.8267 7.43066 14.8267C9.12012 14.8267 10.6748 14.251 11.9209 13.2941L14.4355 15.8086C14.7031 16.0782 14.9717 16.0782 15.2393 15.8086C15.5078 15.5406 15.5078 15.2725 15.2402 15.0042ZM1.17285 7.43115C1.17285 3.98083 3.98047 1.17334 7.43066 1.17334C10.8818 1.17334 13.6885 3.98083 13.6885 7.43115C13.6885 10.8815 10.8818 13.6888 7.43066 13.6888C3.98047 13.6888 1.17285 10.8815 1.17285 7.43115Z"
                  fill-rule="nonzero"
                  fill="#333303"
                />
                <path
                  id="path"
                  d="M9.7207 6.56006L7.69824 6.56006L7.69824 4.56885C7.69824 4.18958 7.50781 4 7.12891 4C6.75 4 6.55957 4.18958 6.55957 4.56885L6.55957 6.56006L4.56934 6.56006C4.18945 6.56006 4 6.74963 4 7.12891C4 7.50818 4.18945 7.69775 4.56934 7.69775L6.55957 7.69775L6.55957 9.68884C6.55957 10.0681 6.75 10.2578 7.12891 10.2578C7.50781 10.2578 7.69824 10.0681 7.69824 9.68884L7.69824 7.69775L9.7207 7.69775C10.0996 7.69775 10.29 7.50818 10.29 7.12891C10.29 6.74963 10.0996 6.56006 9.7207 6.56006Z"
                  fill-rule="nonzero"
                  fill="#333303"
                />
              </g>
              <defs>
                <clipPath id="clip8291_26228">
                  <rect
                    id="放大"
                    width="16.000000"
                    height="16.000000"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="separate">|</div>
          <div class="smaller" @click="smaller">
            <svg
              width="16.000000"
              height="16.000000"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g clip-path="url(#clip8291_26225)">
                <path
                  id="path"
                  d="M7.76074 15.4396C6.72461 15.4396 5.71875 15.2365 4.77148 14.8359C3.85742 14.4492 3.03613 13.8956 2.33105 13.1907C1.62598 12.4855 1.07227 11.6644 0.685547 10.75C0.285156 9.80298 0.0820312 8.79724 0.0820312 7.76099C0.0820312 6.72473 0.285156 5.71887 0.685547 4.77185C1.07227 3.85754 1.62598 3.03625 2.33105 2.3313C3.03613 1.62622 3.85742 1.07263 4.77148 0.685913C5.71875 0.285278 6.72461 0.0821533 7.76074 0.0821533C8.79688 0.0821533 9.80273 0.285278 10.75 0.685913C11.6641 1.07263 12.4854 1.62622 13.1904 2.3313C13.8955 3.03625 14.4492 3.8573 14.8359 4.77185C15.2363 5.71887 15.4395 6.72449 15.4395 7.76099C15.4395 8.79736 15.2363 9.80298 14.8359 10.75C14.4492 11.6644 13.8955 12.4856 13.1904 13.1907C12.4854 13.8956 11.6641 14.4492 10.75 14.8359C9.80273 15.2365 8.79688 15.4396 7.76074 15.4396ZM7.76074 1.26965C4.18164 1.26965 1.26953 4.18152 1.26953 7.76099C1.26953 11.3403 4.18164 14.2521 7.76074 14.2521C11.3398 14.2521 14.252 11.3402 14.252 7.76099C14.252 4.18176 11.3398 1.26965 7.76074 1.26965Z"
                  fill-rule="nonzero"
                  fill="#2A2A2A"
                />
                <path
                  id="path"
                  d="M15.6924 15.7506C15.541 15.7506 15.3887 15.6926 15.2734 15.5767L12.9531 13.2571C12.7217 13.0251 12.7217 12.6492 12.9531 12.4174C13.1855 12.1854 13.5615 12.1854 13.793 12.4174L16.1123 14.7371C16.3447 14.9689 16.3447 15.3448 16.1123 15.5767C15.9971 15.6926 15.8447 15.7506 15.6924 15.7506ZM11.665 8.1875L4.59375 8.1875C4.26562 8.1875 4 7.92175 4 7.59375C4 7.26575 4.26562 7 4.59375 7L11.665 7C11.9932 7 12.2588 7.26575 12.2588 7.59375C12.2588 7.92175 11.9932 8.1875 11.665 8.1875Z"
                  fill-rule="nonzero"
                  fill="#2A2A2A"
                />
              </g>
              <defs>
                <clipPath id="clip8291_26225">
                  <rect
                    id="缩小"
                    width="16.000000"
                    height="16.000000"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div class="picked-tip">拖拽图片剪切头像</div>
        <canvas
          ref="canvasRef"
          width="150"
          height="150"
          v-show="false"
        ></canvas>
        <div class="head-img-save" @click="saveHeadImg">保存</div>
      </div>

      <input
        ref="imgInputRef"
        @change="getImg"
        v-show="false"
        type="file"
        accept="image/*"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";
const picked = ref(false);
const pickImg = () => {
  if (picked.value) {
    return;
  }
  imgInputRef.value.click();
};

const variableImgBoxRef = ref();
const fixedFrameBgUrl = ref();
const canvasRef = ref();
const imgInputRef = ref();
const imageRef = ref();
const fixedFrameRef = ref();
const variableImgBoxPos = reactive({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
});
let ctx: CanvasRenderingContext2D;
const headPicRadius = 75;

watch(picked, (newX) => {
  if (newX === false) {
    variableImgBoxPos.top = 0;
    variableImgBoxPos.left = 0;
    fixedFrameBgUrl.value = "";
  } else {
    setTimeout(() => {
      setVariableImgBoxSize();
      fixedFrameBgUrl.value = `url(${
        new URL("/src/assets/frame_bg.jpg", import.meta.url).href
      })`;
    }, 10);
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
  maxMoveX = variableImgBoxPos.width / 2 - headPicRadius;
  maxMoveY = variableImgBoxPos.height / 2 - headPicRadius;
};

const getImg = (e: Event) => {
  let files = (e.target as HTMLInputElement).files;
  if (files!.length > 0) {
    picked.value = true;
    imageRef.value.src = URL.createObjectURL(files![0]);
  }
};

const saveHeadImg = () => {
  let initScale = Math.max(
    imageRef.value.naturalWidth / variableImgBoxPos.width,
    imageRef.value.naturalHeight / variableImgBoxPos.height
  );

  ctx.drawImage(
    imageRef.value,
    imageRef.value.naturalWidth / 2 -
      headPicRadius * initScale -
      variableImgBoxPos.left * initScale,
    imageRef.value.naturalHeight / 2 -
      headPicRadius * initScale -
      variableImgBoxPos.top * initScale,
    headPicRadius * 2 * initScale,
    headPicRadius * 2 * initScale,
    0,
    0,
    150,
    150
  );

  canvasRef.value.toBlob(
    (blob: Blob) => {
      let a = document.createElement("a");
      a.download = `${new Date().getTime()}.png`;
      a.href = URL.createObjectURL(blob);
      a.click();

      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      imgInputRef.value.value = "";
      picked.value = false;
      URL.revokeObjectURL(imageRef.value.src);
    },
    "image/jpeg",
    1
  );
};

const dragOver = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer!.dropEffect = "copy";
};

const fileSelect = (e: DragEvent) => {
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
  maxMoveX = variableImgBoxPos.width / 2 - headPicRadius;
  maxMoveY = variableImgBoxPos.height / 2 - headPicRadius;
};

const smaller = () => {
  if (
    variableImgBoxPos.left >
      variableImgBoxPos.width / SCALE / 2 - headPicRadius ||
    variableImgBoxPos.left <
      -(variableImgBoxPos.width / SCALE / 2 - headPicRadius) ||
    variableImgBoxPos.top >
      variableImgBoxPos.height / SCALE / 2 - headPicRadius ||
    variableImgBoxPos.top <
      -(variableImgBoxPos.height / SCALE / 2 - headPicRadius)
  ) {
    return;
  }
  variableImgBoxPos.width /= SCALE;
  variableImgBoxPos.height /= SCALE;
  maxMoveX = variableImgBoxPos.width / 2 - headPicRadius;
  maxMoveY = variableImgBoxPos.height / 2 - headPicRadius;
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

onMounted(() => {
  ctx = canvasRef.value.getContext("2d");
});
</script>

<style lang="scss" scoped>
.vue-img-cropper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .img-cropper {
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .fixed-frame {
      width: 472px;
      height: 238px;
      border: 1px dashed rgb(173, 163, 163);
      border-radius: 10px;
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
        clip-path: path(
          "M10 0L462 0C467.522 0 472 4.47705 472 10L472 228C472 233.523 467.522 238 462 238L10 238C4.47705 238 0 233.523 0 228L0 10C0 4.47705 4.47705 0 10 0ZM236 44C194.579 44 161 77.5786 161 119C161 160.421 194.579 194 236 194C277.421 194 311 160.421 311 119C311 77.5786 277.421 44 236 44Z"
        );
      }
    }

    .bottom-menu {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .img-translate {
        display: flex;
        justify-content: center;
        border: solid 1px rgb(220, 220, 220);
        border-radius: 20px;

        .larger {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 34px;
          width: 60px;
        }
        .separate {
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgb(220, 220, 220);
        }
        .smaller {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 34px;
          width: 60px;
        }
      }
      .picked-tip {
        margin-top: 12px;
        display: flex;
        justify-content: center;
        font-size: 14px;
        color: rgb(94, 94, 94);
        user-select: none;
      }
      .head-img-save {
        cursor: pointer;
        margin-left: 32px;
        margin-top: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 32px;
        background-color: rgb(89, 100, 251);
        color: rgb(255, 255, 255);
        border-radius: 4px;
      }
    }
  }
}
</style>
