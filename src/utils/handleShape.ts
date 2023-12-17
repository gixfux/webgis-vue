import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import { geojsonToArcGIS } from "@terraformer/arcgis";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
export class HandleShape {
  blobs: Blob[] = []
  urls = []
  layers: GeoJSONLayer[] = []
  currentLayerNum = 0
  map: Map
  view: SceneView
  constructor(map: Map, view: SceneView) {
    this.map = map
    this.view = view
  }

  async loadShp(geojson: GeoJSON.GeoJSON[]) {
    // init
    this.map.remove(this.layers[this.currentLayerNum])
    this.currentLayerNum = 0
    this.layers = []
    // load geojson from worker
    const arcGIS: any = geojsonToArcGIS(geojson[0])
    const polygon = new Polygon({
      rings: arcGIS[0].geometry.rings,
    });
    let centerPoint = polygon.centroid
    // 场景转移到shp中心
    this.view.goTo({
      center: centerPoint,
      zoom: 5
    })
    if (geojson instanceof Array) {
      for (let i = 0; i < geojson.length; i++) {
        const blob = new Blob([JSON.stringify(geojson[i])], {
          type: "application/json"
        })
        // URL reference to the blob
        const url = URL.createObjectURL(blob)
        // create new geojson layer using the blob url
        this.layers.push(new GeoJSONLayer({
          url: url,
          popupTemplate: {
            // autocasts as new PopupTemplate()
            title: "{COUNTRY}",
            content: [
              {
                type: "fields",
                fieldInfos: [{
                  fieldName: "NL_NAME_1",
                  label: "省份"
                }, {
                  fieldName: "NL_NAME_2",
                  label: "市/区/自治州"
                }, {
                  fieldName: "NL_NAME_3",
                  label: "县/区"
                }]
              }
            ]
          },
        }))
      }
    } else {
      this.blobs.push(new Blob([JSON.stringify(geojson)], {
        type: "application/json"
      }))
    }
    this.map.add(this.layers[this.currentLayerNum])
  }

  toggleLayerByClick() {
    this.map.remove(this.layers[this.currentLayerNum])
    this.currentLayerNum = (this.currentLayerNum + 1) % this.layers.length;
    this.map.add(this.layers[this.currentLayerNum])
  }

  toogleLayerByNum(num: number) {
    if (num > this.layers.length) {
      alert('输入数字过大')
      return
    }
    this.map.remove(this.layers[this.currentLayerNum])
    this.map.add(this.layers[num])
    this.currentLayerNum = num
  }

  clearLayer() {
    this.map.remove(this.layers[this.currentLayerNum])
  }
}





