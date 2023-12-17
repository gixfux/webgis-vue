<template>
  <div class="main fixed left-0 top-52 w-fit py-[5px] px-[10px] bg-slate-500 bg-opacity-60 rounded-md" :class="{mainout: !componentActive,mainin: componentActive}">
    <div class="mainAfter" :class="{mainAfterIn: componentActive, mainAfterOut: !componentActive}" @click="componentActive = !componentActive">></div>
    <form class="shp ">
    <label for="shpFileInput" id="shp_upload">Choose shp file</label>
    <input type="file" id="shpFileInput" name="shp_uploads" @change="chooseShp($event)"
      style="position: absolute; left: 0; top: 0; z-index: -999; opacity: 0; width: 10px;">
    <div class="preview">
      <p>{{shpFile ? shpFile.name : 'No files uploaded'}}</p>
    </div>
    <button :class="{upload: shpFile}" :disabled="shpFile === undefined"  @click.prevent="uploadShp">上传shp</button>
    <button :class="{toggle: shpFile}" :disabled="shpFile === undefined" @click.prevent="handleShape.toggleLayerByClick()">切换</button>
    <button :class="{clear: shpFile}" :disabled="shpFile === undefined" @click.prevent="handleShape.clearLayer()">清除</button>
  </form>
  </div>
</template>

<script setup lang="ts">
import { Ref, inject, ref } from "vue";
import { HandleShape } from "../../utils/handleShape";
import MyWorker from "../../utils/worker.js?worker"

const handleShape = inject<HandleShape>('handleShape')!
let shpFile: Ref<File | undefined> = ref()
  let componentActive: Ref<boolean> = ref(true)
const myWorker = new MyWorker();

function chooseShp(event: Event) {
  shpFile.value = (event.target as HTMLInputElement).files![0];
}

function uploadShp() {
  myWorker.postMessage(shpFile.value)
}

// 处理myWorker返回的数据
myWorker.onmessage = function (e) {
  const geojson = e.data;
  handleShape.loadShp(geojson);
  console.log('Message received from worker');
}
</script>

<style lang="scss" scoped>
.main {
  @apply duration-300;
  .mainAfter {
    @apply absolute -right-[26px] top-0 p-2 bg-slate-100 rounded-md hover:bg-slate-700 hover:text-white duration-300;
  }
  .mainAfterIn {
    transform: rotateY(180deg);
  }

}
.mainin {
  @apply animate-[slideIn_1s_ease-in-out_forwards];
}
.mainout {
  @apply animate-[slideOut_1s_ease-in-out_forwards];
}

#shp_upload, .preview{
  @apply block text-black rounded-md p-[5px] w-[95%] overflow-hidden bg-blue-300 my-1 hover:text-white hover:bg-blue-700 duration-300;
}

.upload, .toggle, .clear {
  @apply p-[5px] h-fit rounded-md outline-none mr-1 text-white bg-purple-700 hover:bg-purple-500 duration-300;
}

button:disabled {
  @apply bg-gray-500 text-yellow-50 p-[5px] h-fit rounded-md outline-none mr-1;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX();
  }

  to {
    transform: translateX(-100%);
  }
}
</style>