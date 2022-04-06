import * as d3 from "d3";
import { observer } from "mobx-react";
import { Slider } from "@mui/material";
import { useEffect, useRef } from "react";
import * as constant from "./constant.js";

export const MapCanvas = observer(
  ({
    store
  }) => {

    // Global varaibles
    let numLayers = constant.layers.length
    let colorToData = {};

    // Canvas layout
    let mapSize = parseInt(window.innerWidth * constant.mapSizePercent / 100)
    let selectedMapSize = parseInt(window.innerWidth * constant.selectedMapSizePercent / 100)

    // Component references
    const canvasRefs = [...Array(numLayers)].map(x => useRef(null))
    const hiddenCanvasRefs = [...Array(numLayers)].map(x => useRef(null))
    const customs = [...Array(numLayers)].map(x => d3.select(document.createElement("custom")))
    const canvases = canvasRefs.map(canvasRef => d3.select(canvasRef.current))
    const hiddenCanvases = hiddenCanvasRefs.map(hiddenCanvasRef => d3.select(hiddenCanvasRef.current))

    // Rendering
    useEffect(() => {
      if (!store.loadingEmbDone) {
        return;
      }
      setXYScale()
      for (let i = 0; i < numLayers; i++) {
        drawLayerCanvas(i, 1)
      }
    }, [store.loadingEmbDone])


    /*
     * Draw maps
     */

    const setXYScale = () => {
      let xScale = d3.scaleLinear()
        .domain([store.embRange.x.min, store.embRange.x.max])
        .range([0, mapSize])
  
      let yScale = d3.scaleLinear()
        .domain([store.embRange.y.min, store.embRange.y.max])
        .range([0, mapSize])

      store.setXScale(xScale)
      store.setYScale(yScale)
    }

    const drawMap = (canvas, custom, layer, data, hidden) => {

      let ratio = (store.selectedLayerIdx != -1) ? selectedMapSize / mapSize : 1
      let context = canvas.getContext("2d")

      context.clearRect(0, 0, canvas.width, canvas.height)
      
      custom.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("id", (d, i) => `emb-${layer}-${i}`)
        .attr("class", (d, i) => {
          let c1 = "emb"
          let c2 = `emb-${i}`
          let c3 = `emb-${layer}`
          let c4 = `emb-label-${d['label']}`
          return [c1, c2, c3, c4].join(' ')
        })
        .attr("width", constant.embSize)
        .attr("height", constant.embSize)
        .attr("x", (d) => store.xScale(d["emb"][store.epoch][0]) * ratio)
        .attr("y", (d) => store.yScale(d["emb"][store.epoch][1]) * ratio)
        .attr("fill", (d) => constant.embColors[d['label']])
        
      custom.selectAll("rect")
        .each(function(d, i) {
          let sel = d3.select(this)
          context.beginPath()
          if (hidden) {
            let color = getColor(i)
            colorToData[color] = {"i": i, "d": d}
            context.fillStyle = color
          } else {
            context.fillStyle = sel.attr("fill")  
          }
          context.fillRect(
            sel.attr("x"), sel.attr("y"), constant.embSize, constant.embSize
          )
        })

    }

    const drawLayerCanvas = (i) => {
      let canvas = canvases[i].node()
      let hiddenCanvas = hiddenCanvases[i].node()
      let custom = customs[i]
      let layer = constant.layers[i]
      let data = store.embData[layer]
      drawMap(canvas, custom, layer, data, false)
      genMouseOver(hiddenCanvas, custom, data, layer)
    }
    
    /*
     * Hovering a point
     */

    const getColor = (i) => {
      let r = Math.floor(i / 256 / 256) % 256
      let g = Math.floor(i / 256) % 256
      let b = i % 256
      return d3.rgb(r, g, b).toString();
    }

    const genMouseOver = (hiddenCanvas, custom, data, layer) => {
      d3.select(`#map-canvas-${layer}`)
        .on("mousemove", (e) => {
          drawMap(hiddenCanvas, custom, layer, data, true)
          let hiddenContext = hiddenCanvas.getContext("2d")
          let [x, y] = [e.offsetX, e.offsetY]
          let imageData = hiddenContext.getImageData(x, y, 1, 1).data
          let color = d3.rgb.apply(null, imageData).toString()
          let possibleDatum = colorToData[color]
          if (possibleDatum) {
            console.log(possibleDatum)
          }
        })
    }

    /*
     * Slider for selecting an epoch
     */

    const handleSliderChange = (e, val) => {
      let epoch = val
      store.setEpoch(epoch)
      for (let i = 0; i < numLayers; i++) {
        drawLayerCanvas(i)
      }
    }

    /*
     * Select a layer
     */
    const clickMapDiv = (e) => {

      if (store.selectedLayerIdx != -1) {
        return
      }

      let i = parseInt(e.target.id.split('layer').slice(-1)[0]) - 1
      store.setSelectedLayerIdx(i)
      
      let canvas = canvases[i].node()
      let hiddenCanvas = hiddenCanvases[i].node()
      canvas.width = selectedMapSize
      canvas.height = selectedMapSize
      hiddenCanvas.width = selectedMapSize
      hiddenCanvas.height = selectedMapSize

      drawLayerCanvas(i)
    }

    return (
      <div id="map-wrap">
        <div id="epoch-val">
          epoch = {store.epoch}
        </div>
        <Slider
          defaultValue={constant.epochs[0]}
          valueLabelDisplay="auto"
          step={10}
          min={constant.epochs[0]}
          max={constant.epochs.slice(-1)[0]}
          color="secondary"
          onChange={handleSliderChange}
        />
        <div id="map-contents">
          {constant.layers.map((layer, i) => (
            <div 
              id={`map-${layer}`} 
              className="map" key={layer}
              style={{
                display:
                  store.selectedLayerIdx == -1 || store.selectedLayerIdx == i
                    ? "block"
                    : "none",
              }}
              onClick={clickMapDiv}
            >
              <div className="map-title">{layer}</div>
              <div className="map-map">
                <canvas 
                  ref={canvasRefs[i]} 
                  id={`map-canvas-${layer}`} 
                  className="map-canvas"
                  width={mapSize}
                  height={mapSize}
                />
                <canvas
                  ref={hiddenCanvasRefs[i]}
                  id={`map-hidden-canvas-${layer}`}
                  className="map-hidden-canvas"
                  width={mapSize}
                  height={mapSize}
                  // style={{display: "none"}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    
  }
)