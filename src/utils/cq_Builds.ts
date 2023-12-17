import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'
import SceneView from "@arcgis/core/views/SceneView.js";
import WebMap from "@arcgis/core/WebMap.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import Slider from "@arcgis/core/widgets/Slider.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import ElevationProfile from "@arcgis/core/widgets/ElevationProfile.js";
// import "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js";

function getSymbol(color: string) {
  return {
    type: "polygon-3d", 			// autocasts as new PolygonSymbol3D()
    symbolLayers: [{
      type: "extrude", 			// autocasts as new ExtrudeSymbol3DLayer()
      material: {
        color: color
      },
      edges: {
        type: "solid",
        color: "#999",
        size: 0.5
      }
    }]
  };
}

const uniqueValueRenderer = {
  type: "unique-value", 					// autocasts as new UniqueValueRenderer()
  defaultSymbol: getSymbol("#aa55ff"),
  defaultLabel: "其他用地建筑物",
  field: "type",
  uniqueValueInfos: [
    {
      value: "warehouse",
      symbol: getSymbol("#A7C636"),
      label: "仓库用地建筑物"
    },
    {
      value: "university",
      symbol: getSymbol("#FC921F"),
      label: "大学用地建筑物"
    },
    {
      value: "train_station",
      symbol: getSymbol("#ED5151"),
      label: "车站用地建筑物"
    },
    {
      value: "school",
      symbol: getSymbol("#149ECE"),
      label: "其他教育用地建筑物"
    },
    {
      value: "commercial",
      symbol: getSymbol("#689E1A"),
      label: "商业用地建筑物"
    },
    {
      value: "hospital",
      symbol: getSymbol("#26911A"),
      label: "医疗用地建筑物"
    },
    {
      value: "apartments",
      symbol: getSymbol("#269100"),
      label: "住宅用地建筑物"
    },
    {
      value: "roof",
      symbol: getSymbol("#B5261A"),
      label: "国家工程用地建筑物"
    },
    {
      value: "industrial",
      symbol: getSymbol("#7f8c8d"),
      label: "工业用地建筑物"
    },
  ],
  visualVariables: [{
    type: "size",
    field: "length",
    valueUnit: "meters" 				// Converts and extrudes all data values in meters
  }]
};

const uniqueValueRenderer1 = {
  type: "unique-value", 					// autocasts as new UniqueValueRenderer()
  defaultSymbol: {
    type: "simple-fill", // autocasts as new SimpleLineSymbol()
    color: "#aa55ff",
    style: "solid"
  },
  defaultLabel: "其他用地建筑物",
  field: "type",
  uniqueValueInfos: [{
    value: "warehouse",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#A7C636",
      style: "solid"
    },
    label: "仓库用地建筑物"
  }, {
    value: "university",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#FC921F",
      style: "solid"
    },
    label: "大学用地建筑物"
  }, {
    value: "train_station",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#ED5151",
      style: "solid"
    },
    label: "车站用地建筑物"
  }, {
    value: "school",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#149ECE",
      style: "solid"
    },
    label: "其他教育用地建筑物"
  }, {
    value: "commercial",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#689E1A",
      style: "solid"
    },
    label: "商业用地建筑物"
  }, {
    value: "hospital",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#26911A",
      style: "solid"
    },
    label: "医疗用地建筑物"
  }, {
    value: "apartments",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#269100",
      style: "solid"
    },
    label: "住宅用地建筑物"
  }, {
    value: "roof",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#B5261A",
      style: "solid"
    },
    label: "国家工程用地建筑物"
  }, {
    value: "industrial",
    symbol: {
      type: "simple-fill", // autocasts as new SimpleLineSymbol()
      color: "#7f8c8d",
      style: "solid"
    },
    label: "工业用地建筑物"
  }],
  visualVariables: [{
    type: "size",
    field: "length",
    valueUnit: "meters" 				// Converts and extrudes all data values in meters
  }]
};

const buildingsLayer = new GeoJSONLayer({
  url: "http://localhost:80/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Acq_builds&maxFeatures=50000&outputFormat=application%2Fjson",
  renderer: uniqueValueRenderer as __esri.RendererProperties,
  popupTemplate: {
    // autocasts as new PopupTemplate()
    title: "{name}",
    content: [
      {
        type: "fields",
        fieldInfos: [{
          fieldName: "objectid",
          label: "建筑物编号"
        }, {
          fieldName: "code",
          label: "建筑物编码"
        }, {
          fieldName: "name",
          label: "建筑物名称"
        }, {
          fieldName: "type",
          label: "建筑物类型"
        }, {
          fieldName: "length",
          label: "建筑物高度"
        }]
      }
    ]
  },
});

const buildingsLayer1 = new GeoJSONLayer({
  url: "http://localhost:80/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Acq_builds&maxFeatures=50000&outputFormat=application%2Fjson",
  renderer: uniqueValueRenderer1 as __esri.RendererProperties,
  popupTemplate: {
    title: "{name}",
    content: [{
      type: "fields",
      fieldInfos: [{
        fieldName: "objectid",
        label: "建筑物编号"
      }, {
        fieldName: "code",
        label: "建筑物编码"
      }, {
        fieldName: "name",
        label: "建筑物名称"
      }, {
        fieldName: "type",
        label: "建筑物类型"
      }, {
        fieldName: "length",
        label: "建筑物高度"
      }]
    }]
  }
});

export class CqBuilds {
  map: Map
  map2D: WebMap
  view: SceneView
  view2: MapView
  legendPlugin: Legend
  constructor(map: Map, view: SceneView, map2D: WebMap, view2: MapView) {
    this.map = map;
    this.view = view;

    this.map2D = map2D;
    this.map2D.layers.add(buildingsLayer1);
    this.view2 = view2;

    this.legendPlugin = new Legend({
      view: this.view,
    });
    this.legendPlugin.style = {
      type: "classic",
      layout: "stack"
    };
    this.generateLinkWithLittleView()
    // map.layers.add(buildingsLayer)
    // this.toggleLegendPlugin()
  }

  toggleCqBuilds() {
    if (this.map.findLayerById(buildingsLayer.id)) {
      this.map.layers.remove(buildingsLayer);
    } else {
      this.map.layers.add(buildingsLayer);
      this.view.goTo({
        center: [106.56734, 29.56074],
        zoom: 16
      })
    }
  }

  toggleLegendPlugin() {
    if (this.view.ui.find(this.legendPlugin.id)) {
      this.view.ui.remove(this.legendPlugin);
    } else {
      this.view.ui.add(this.legendPlugin, "bottom-right");
    }
  }

  generateLinkWithLittleView() {
    const views = [this.view, this.view2];
    let active: SceneView | MapView;

    const sync = (source: MapView | SceneView) => {
      if (!active || !active.viewpoint || active !== source) {
        return;
      }

      for (const view of views) {
        if (view !== active) {
          view.viewpoint = active.viewpoint;
        }
      }
    };

    for (const view of views) {
      view.watch(["interacting", "animation"], () => {
        active = view;
        sync(active);
      });

      view.watch("viewpoint", () => sync(view));
    }
  }

  toggleLittleView() {
    const dom = this.view2.container;
    dom.style.display = dom.style.display === 'none' ? 'flex' : 'none';
  }

  addQueryPlugin() {
    // add a GraphicsLayer for the sketches and the buffer
    const queryDiv = document.querySelector('#queryDiv')! as HTMLDivElement
    const resultDiv = document.querySelector('#resultDiv')! as HTMLDivElement
    console.dir(queryDiv);


    const sketchLayer = new GraphicsLayer();
    const bufferLayer = new GraphicsLayer();
    this.view.map.addMany([bufferLayer, sketchLayer]);

    let sceneLayer = buildingsLayer;
    sceneLayer.outFields = ["catagory", "yearcomple"];
    let sceneLayerView: __esri.GeoJSONLayerView | null = null;
    let bufferSize = 0;

    this.view.whenLayerView(sceneLayer).then((layerView) => {
      console.log(layerView);

      sceneLayerView = layerView;
      queryDiv.style.display = "block";
    });
    this.view.ui.add([queryDiv], "top-right");
    this.view.ui.add([resultDiv], "bottom-left");

    // use SketchViewModel to draw polygons that are used as a query
    let sketchGeometry: __esri.Geometry | __esri.Geometry[] | null = null;
    const sketchViewModel = new SketchViewModel({
      layer: sketchLayer,
      defaultUpdateOptions: {
        tool: "reshape",
        toggleToolOnClick: false
      },
      view: this.view,
      defaultCreateOptions: { hasZ: false }
    });

    sketchViewModel.on("create", (event) => {
      if (event.state === "complete") {
        sketchGeometry = event.graphic.geometry;
        runQuery();
      }
    });

    sketchViewModel.on("update", (event) => {
      if (event.state === "complete") {
        sketchGeometry = event.graphics[0].geometry;
        runQuery();
      }
    });

    // draw geometry buttons - use the selected geometry to sktech
    const pointBtn = document.getElementById("point-geometry-button")!;
    const lineBtn = document.getElementById("line-geometry-button")!;
    const polygonBtn = document.getElementById("polygon-geometry-button")!;

    pointBtn.addEventListener("click", geometryButtonsClickHandler);
    lineBtn.addEventListener("click", geometryButtonsClickHandler);
    polygonBtn.addEventListener("click", geometryButtonsClickHandler);

    function geometryButtonsClickHandler(event: any) {
      const geometryType = event.target.value;
      clearGeometry();
      sketchViewModel.create(geometryType);
    }

    const bufferNumSlider = new Slider({
      container: "bufferNum",
      min: 0,
      max: 500,
      steps: 1,
      visibleElements: {
        labels: true
      },
      precision: 0,
      labelFormatFunction: (value, type) => {
        return `${value.toString()}m`;
      },
      values: [0]
    });
    // get user entered values for buffer
    bufferNumSlider.on(["thumb-change", "thumb-drag"], bufferVariablesChanged);
    function bufferVariablesChanged(event: { value: number; }) {
      bufferSize = event.value;
      runQuery();
    }

    // Clear the geometry and set the default renderer
    const clearGeometryBtn = document.getElementById("clearGeometry")!;
    clearGeometryBtn.addEventListener("click", clearGeometry);

    // Clear the geometry and set the default renderer
    function clearGeometry() {
      sketchGeometry = null;
      sketchViewModel.cancel();
      sketchLayer.removeAll();
      bufferLayer.removeAll();
      clearHighlighting();
      clearCharts();
      resultDiv.style.display = "none";
    }

    // set the geometry query on the visible SceneLayerView
    const debouncedRunQuery = promiseUtils.debounce(() => {
      if (!sketchGeometry) {
        return;
      }

      resultDiv.style.display = "block";
      updateBufferGraphic(bufferSize);
      return promiseUtils.eachAlways([queryStatistics(), updateSceneLayer()]);
    });

    function runQuery() {
      debouncedRunQuery().catch((error: { name: string; }) => {
        if (error.name === "AbortError") {
          return;
        }

        console.error(error);
      });
    }

    // Set the renderer with objectIds
    let highlightHandle: __esri.Handle | null = null;
    function clearHighlighting() {
      if (highlightHandle) {
        highlightHandle.remove();
        highlightHandle = null;
      }
    }

    function highlightBuildings(objectIds: any) {
      // Remove any previous highlighting
      clearHighlighting();
      const objectIdField = sceneLayer.objectIdField;
      document.getElementById("count")!.innerHTML = objectIds.length;

      highlightHandle = sceneLayerView.highlight(objectIds);
    }

    // update the graphic with buffer
    function updateBufferGraphic(buffer) {
      // add a polygon graphic for the buffer
      if (buffer > 0) {
        const bufferGeometry = geometryEngine.geodesicBuffer(sketchGeometry, buffer, "meters");
        if (bufferLayer.graphics.length === 0) {
          bufferLayer.add(
            new Graphic({
              geometry: bufferGeometry,
              symbol: sketchViewModel.polygonSymbol
            })
          );
        } else {
          bufferLayer.graphics.getItemAt(0).geometry = bufferGeometry;
        }
      } else {
        bufferLayer.removeAll();
      }
    }

    function updateSceneLayer() {
      const query = sceneLayerView.createQuery();
      query.geometry = sketchGeometry;
      query.distance = bufferSize;
      return sceneLayerView.queryObjectIds(query).then(highlightBuildings);
    }

    let yearChart = null;
    let materialChart = null;

    function queryStatistics() {
      const statDefinitions = [
        {
          onStatisticField: "CASE WHEN catagory = 'warehouse' THEN 1 ELSE 0 END",
          outStatisticFieldName: "warehouse",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'university' THEN 1 ELSE 0 END",
          outStatisticFieldName: "university",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'train_station' THEN 1 ELSE 0 END",
          outStatisticFieldName: "train_station",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'school' THEN 1 ELSE 0 END",
          outStatisticFieldName: "school",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'commercial' THEN 1 ELSE 0 END",
          outStatisticFieldName: "commercial",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'hospital' THEN 1 ELSE 0 END",
          outStatisticFieldName: "hospital",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'apartments' THEN 1 ELSE 0 END",
          outStatisticFieldName: "apartments",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'roof' THEN 1 ELSE 0 END",
          outStatisticFieldName: "roof",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN catagory = 'industrial' THEN 1 ELSE 0 END",
          outStatisticFieldName: "industrial",
          statisticType: "sum"
        },
        {
          onStatisticField:
            "CASE WHEN catagory IN ('warehouse', 'university', 'train_station', 'school','commercial','hospital','apartments','roof','industrial') THEN 0 ELSE 1 END",
          outStatisticFieldName: "other",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN (yearcomple >= '1980' AND yearcomple <= '1994') THEN 1 ELSE 0 END",
          outStatisticFieldName: "year_1980",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN (yearcomple >= '1995' AND yearcomple <= '2009') THEN 1 ELSE 0 END",
          outStatisticFieldName: "year_1995",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN (yearcomple >= '2010' AND yearcomple <= '2014') THEN 1 ELSE 0 END",
          outStatisticFieldName: "year_2010",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN (yearcomple >= '2015' AND yearcomple <= '2019') THEN 1 ELSE 0 END",
          outStatisticFieldName: "year_2015",
          statisticType: "sum"
        },
        {
          onStatisticField: "CASE WHEN (yearcomple >= '2020' AND yearcomple <= '2023') THEN 1 ELSE 0 END",
          outStatisticFieldName: "year_2020",
          statisticType: "sum"
        }
      ];
      const query = sceneLayerView.createQuery();
      query.geometry = sketchGeometry;
      query.distance = bufferSize;
      query.outStatistics = statDefinitions;

      return sceneLayerView.queryFeatures(query).then((result) => {
        const allStats = result.features[0].attributes;
        updateChart(materialChart, [
          allStats.warehouse,
          allStats.university,
          allStats.train_station,
          allStats.school,
          allStats.commercial,
          allStats.hospital,
          allStats.apartments,
          allStats.roof,
          allStats.industrial,
          allStats.other
        ]);
        updateChart(yearChart, [
          allStats.year_1980,
          allStats.year_1995,
          allStats.year_2010,
          allStats.year_2015,
          allStats.year_2020
        ]);
      }, console.error);
    }

    // Updates the given chart with new data
    function updateChart(chart, dataValues) {
      chart.data.datasets[0].data = dataValues;
      console.log('chart');

      chart.update();
    }

    function createYearChart() {
      const yearCanvas = document.getElementById("year-chart");
      yearChart = new Chart(yearCanvas.getContext("2d"), {
        type: "horizontalBar",
        data: {
          labels: ["1980-1994", "1995-2009", "2010-2014", "2015-2019", "2020-2023"],
          datasets: [
            {
              label: "Build year",
              backgroundColor: "#149dcf",
              stack: "Stack 0",
              data: [0, 0, 0, 0, 0, 0]
            }
          ]
        },
        options: {
          responsive: false,
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Build year"
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                  precision: 0
                }
              }
            ],
            yAxes: [
              {
                stacked: true
              }
            ]
          }
        }
      });
    }

    function createMaterialChart() {
      const materialCanvas = document.getElementById("material-chart");
      materialChart = new Chart(materialCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ["仓库", "大学", "车站", "其他教育", "商业", "医疗", "住所", "政府", "工业", "其他"],
          datasets: [
            {
              backgroundColor: ["#A7C636", "#FC921F", "#ED5151", "#149ECE", "#689E1A", "#26911A", "#269100", "#B5261A", "7f8c8d", "#aa55ff"],
              borderWidth: 0,
              data: [0, 0, 0, 0, 0]
            }
          ]
        },
        options: {
          responsive: false,
          cutoutPercentage: 35,
          legend: {
            position: "bottom"
          },
          title: {
            display: true,
            text: "建筑类型"
          }
        }
      });
    }

    function clearCharts() {
      updateChart(materialChart, [0, 0, 0, 0, 0]);
      updateChart(yearChart, [0, 0, 0, 0, 0, 0]);
      document.getElementById("count").innerHTML = 0;
    }

    createYearChart();
    createMaterialChart();
  }
}