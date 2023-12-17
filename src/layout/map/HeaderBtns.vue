<template>
  <div class="fixed top-0 left-16" style="width: calc(100% - 64px);">
    <ul class="flex text-white bg-purple-600 justify-between h-9">
      <li v-for="option of options" class="h-full flex justify-center items-center hover:bg-purple-400 grow">
        <button v-if="option.type === 'button'" class="w-full" @click="option.action()">{{ option.content }}</button>
        <div v-else class="sections relative flex justify-center items-center w-full h-full">
          {{ option.content }}
          <ul class="absolute top-full bg-purple-600 w-fit rounded-md hidden">
            <li v-for="item of option.selections" class="block w-full p-2 rounded-md hover:bg-purple-400">
              <button class="w-full" @click="item.action">{{ item.content }}</button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { CqBuilds } from '../../utils/cq_Builds'

const props = defineProps({
  cqBuilds: CqBuilds
  // foo: String,
  // bar: {
  //   type: Number,
  //   required: true
  // }
})

// 最多支持二级下拉框
const options: any = {
  cqzci: {
    type: 'selections',
    content: '重庆市',
    selections: {
      cq_builds: {
        type: 'button',
        content: '加载/去除重庆市建筑物',
        action: () => {
          props.cqBuilds?.toggleCqBuilds()
        }
      },
      cq123: {
        type: 'button',
        content: '加载/去除图例',
        action: () => {
          props.cqBuilds?.toggleLegendPlugin()
        }
      }
    }
  },
  cq_builds: {
    type: 'button',
    content: '加载/去除小地图',
    action: () => {
      props.cqBuilds?.toggleLittleView()
    }
  },
  cqs: {
    type: 'button',
    content: '加载/去除query',
    action: () => {
      props.cqBuilds?.addQueryPlugin()
    }
  },
  cq123: {
    type: 'button',
    content: '加载重庆市建筑物',
    action: () => {}
  },
  cq23: {
    type: 'button',
    content: '加载重庆市建筑物',
    action: () => {}
  }
}

// let
</script>

<style lang="scss" scoped>
.sections:hover > ul {
  display: block;
}
</style>