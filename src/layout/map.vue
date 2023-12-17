<template>
  <div>
    <div id="viewDiv" class="h-screen"></div>
    <div id="viewDiv1" class="absolute top-0 right-[320px] z-[3] opacity-80 h-[180px] w-[220px] block"></div>
    <div id="queryDiv" class="esri-widget">
      <b>Query by geometry</b><br />
      <br />Draw a geometry to query by:
      <div class="geometry-options">
        <button class="esri-widget--button esri-icon-map-pin geometry-button" id="point-geometry-button" value="point" title="Query by point"></button>
        <button class="esri-widget--button esri-icon-polyline geometry-button" id="line-geometry-button" value="polyline" title="Query by line"></button>
        <button class="esri-widget--button esri-icon-polygon geometry-button" id="polygon-geometry-button" value="polygon" title="Query by polygon"></button>
      </div>
      <br />
      <div class="tooltip">
        <label for="bufferNum">Set a geometry buffer size:</label>
        <div id="bufferNum"></div>
      </div>
      <br />
      <button class="esri-button" id="clearGeometry" type="button">Clear</button>
    </div>

    <div id="resultDiv" class="esri-widget">
      <div class="count">
        Selected Buildings:
        <div class="count" id="count">0</div>
      </div>
      <div class="charts">
        <div>
          <canvas id="year-chart" height="250" width="260" />
        </div>
        <div>
          <canvas id="material-chart" width="250" height="300" />
        </div>
      </div>
    </div>
    <header-btns :cqBuilds="cqBuilds"></header-btns>
    <upload-shp></upload-shp>
  </div>
</template>

<script setup lang="ts">
import esriConfig from '@arcgis/core/config'
import Map from '@arcgis/core/Map'
import SceneView from '@arcgis/core/views/SceneView'
import { onMounted, provide } from 'vue'
import { HandleShape } from '../utils/index'
import UploadShp from './map/UploadShp.vue'
import HeaderBtns from './map/HeaderBtns.vue'
import { CqBuilds } from '../utils/cq_Builds'
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'

esriConfig.apiKey = 'AAPKcf646df129884e0e8018cc9cd3a262d5L3fAQmMNc1T5oyUbVFI_gmWDETg0SURj7_u1C5QdK_3bVeuzy3UYKwqNL8loREWO'

const map = new Map({
  basemap: 'satellite',
  ground: 'world-elevation'
})

const map2D = new WebMap({
  portalItem: {
    id: '56b5bd522c52409c90d902285732e9f1'
  }
})

const view = new SceneView({
  map,
  camera: {
    position: {
      longitude: 106.56734,
      latitude: 29.56074,
      z: 600,
      spatialReference: {
        wkid: 4326
      }
    },
    heading: 300,
    tilt: 55
  }
})

const view2 = new MapView({
  map: map2D,
  constraints: {
    // Disable zoom snapping to get the best synchronization
    snapToZoom: false
  }
})

const cqBuilds = new CqBuilds(map, view, map2D, view2)
const handleShape = new HandleShape(map, view)
provide('handleShape', handleShape)

onMounted(() => {
  view.container = document.querySelector('#viewDiv')!
  view2.container = document.querySelector('#viewDiv1')!
})
</script>

<style scoped>
.scale {
  position: absolute;
  bottom: 20px;
  left: 15px;
  width: 500px;
  height: 50px;
  background: wheat;
  z-index: 3;
  border-radius: 2px;
  padding: 3px;
}

#infoDiv {
  position: absolute;
  top: 15px;
  left: 60px;
}

#infoDiv input {
  border: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 2px;
}

.esri-ui-top-right {
  max-height: 100%;
}

#queryDiv,
#resultDiv {
  min-width: 250px;
  font-size: 14px;
  padding: 10px;
  display: none;
  overflow-y: auto;
  overflow-x: hidden;
}

#queryDiv {
  @apply fixed top-12;
}

.geometry-options {
  display: flex;
  flex-direction: row;
}

.geometry-button {
  flex: 1;
  border-style: solid;
  border-width: 1px;
  border-image: none;
}

.geometry-button-selected {
  background: #4c4c4c;
  color: #fff;
}

#bufferNum {
  width: 90%;
  margin: 2.5em auto 0;
}

.count {
  white-space: nowrap;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
}

.esri-button {
  background: #0079c1;
}
.esri-button:hover {
  background: #00598e;
}

.esri-legend__service {
  height: 100px;
}

.esri-ui-corner {
  max-height: 45%;
}

.esri-elevation-profile.esri-component.esri-widget--panel {
  width: 350px !important;
  height: 150px;
}
</style>