import * as d3 from "d3";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { Slider } from "@mui/material";
import * as constant from "./constant.js";

export const Map = observer(
  ({
    store
  }) => {

    let numLayers = constant.layers.length
    const svgRefs = [...Array(numLayers)].map(x => useRef(null))
    const gRefs = [...Array(numLayers)].map(x => useRef(null))

    useEffect(() => {

      if (!store.isEmbDataAvailable()) {
        return;
      }

      store.setXYScale()

      const svgs = svgRefs.map(svgRef => d3.select(svgRef.current))
      const gs = gRefs.map(gRef => d3.select(gRef.current))

      makeMapZoomable(svgs, gs)
      for (let i = 0; i < numLayers; i++) {
        let g = gs[i]
        let layer = constant.layers[i]
        let data = store.embData[layer]
        drawMap(g, layer, data)
      }
      
    }, [store.embData, store.loadingEmbDone])

    const makeMapZoomable = (svgs, gs) => {
      let numLayers = constant.layers.length
      for (let i = 0; i < numLayers; i++) {
        let zoom = d3
          .zoom()
          .scaleExtent([0.1, 3.5])
          .extent([
            [0, 0],
            [constant.mapWidth, constant.mapHeight],
          ])
          .on("zoom", (e) => {
            gs[i].attr("transform", e.transform);
          });
        svgs[i].call(zoom);
      }
    }

    const drawMap = (g, layer, data) => {
      g.selectAll("rect")
        .data(data)
        .join("rect")
          .attr("id", (d, i) => `emb-${layer}-${i}`)
          .attr("class", (d, i) => {
            let c1 = "emb"
            let c2 = `emb-${i}`
            let c3 = `emb-${layer}`
            let c4 = `emb-label-${d['label']}`
            return [c1, c2, c3, c4].join(' ')
          })
          .attr("x", (d) => store.xScale(d['emb'][store.epoch][0]))
          .attr("y", (d) => store.yScale(d['emb'][store.epoch][1]))
          .attr("width", constant.embSize)
          .attr("height", constant.embSize)
          .attr("fill", d => constant.embColors[d['label']])
    }

    const handleSliderChange = (e, val) => {
      let epoch = val
      store.setEpoch(epoch)

      for (let layer of constant.layers) {
        d3.select(`#map-g-${layer}`)
          .selectAll(`.emb-${layer}`)
          .transition()
            .attr("x", (d) => store.xScale(d['emb'][epoch][0]))
            .attr("y", (d) => store.yScale(d['emb'][epoch][1]))
      }

      document.getElementById("epoch-val").innerText = `epoch = ${epoch}`
    }

    return (
      <div id="map-wrap">
        <div id="epoch-val">
          epoch = {constant.epochs[0]}
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
              <div className="map-canvas">
                <svg 
                  ref={svgRefs[i]} 
                  id={`map-svg-${layer}`}
                  className="map-svg"
                  width={constant.mapWidth}
                  height={constant.mapHeight}
                >
                  <rect 
                    id={`map-bg-${layer}`} 
                    className="map-bg"
                    width={constant.mapWidth}
                    height={constant.mapHeight}
                    fill={constant.mapBgColor}
                  />
                  <g 
                    ref={gRefs[i]} 
                    id={`map-g-${layer}`} 
                    className="map-g"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    
  }
)