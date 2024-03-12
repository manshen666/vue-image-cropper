import { App } from 'vue'
import ImageCropper from './ImageCropper.vue'

ImageCropper.install = function (vue: App) {
  vue.component(ImageCropper.name, ImageCropper)
}

export default ImageCropper
