import 'https://unpkg.com/shpjs@latest/dist/shp.js'
// self.importScripts('https://unpkg.com/shpjs@latest/dist/shp.js')
onmessage = function (e) {
  console.log('Worker: Message received from main script');
  const result = e.data;
  const reader = new FileReader()
  reader.readAsArrayBuffer(result)
  reader.onload = async event => {
    const buffer = event.target.result;
    const geojson = await shp(buffer);
    postMessage(geojson);
  }
  console.log('Worker: Posting message back to main script');
}