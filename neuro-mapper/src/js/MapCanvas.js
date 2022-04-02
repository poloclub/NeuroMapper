import * as d3 from "d3";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { DialogContentText, Slider } from "@mui/material";
import * as constant from "./constant.js";

export const MapCanvas = observer(
  ({
    store
  }) => {

    let numLayers = constant.layers.length
    const canvasRefs = [...Array(numLayers)].map(x => useRef(null))
    const customs = [...Array(numLayers)].map(
      x => d3.select(document.createElement("custom"))
    )
    const canvases = canvasRefs.map(canvasRef => d3.select(canvasRef.current))

    useEffect(() => {

      if (!store.loadingEmbDone) {
        return;
      }

      store.setXYScale()

      for (let i = 0; i < numLayers; i++) {
        let canvas = canvases[i].node()
        let custom = customs[i]
        let layer = constant.layers[i]
        let data = store.embData[layer]
        drawMap(canvas, custom, layer, data)
      }
      
    }, [store.loadingEmbDone])

    const drawMap = (canvas, custom, layer, data) => {
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
        .attr("x", (d) => store.xScale(d["emb"][store.epoch][0]))
        .attr("y", (d) => store.yScale(d["emb"][store.epoch][1]))
        .attr("fill", d => constant.embColors[d['label']])
        
      custom.selectAll("rect").each(function() {
        let sel = d3.select(this)
        context.beginPath()
        context.fillStyle = sel.attr("fill")
        context.fillRect(sel.attr("x"), sel.attr("y"), 4, 4)
      })
    }

    const handleSliderChange = (e, val) => {
      let epoch = val
      store.setEpoch(epoch)

      for (let i = 0; i < numLayers; i++) {
        let canvas = canvases[i].node()
        let custom = customs[i]
        let layer = constant.layers[i]
        let data = store.embData[layer]
        drawMap(canvas, custom, layer, data)
      }

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
            <div id={`map-${layer}`} className="map" key={layer}>
              <div className="map-title">{layer}</div>
              <div className="map-map">
                <canvas 
                  ref={canvasRefs[i]} 
                  id={`map-canvas-${layer}`} 
                  className="map-canvas"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    
  }
)