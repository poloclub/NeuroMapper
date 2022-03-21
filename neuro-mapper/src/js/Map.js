import * as d3 from "d3";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
// import { Slider } from "@mui/material";
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

      console.log(store.embData)

      let embRange = getMinMaxCoord()
      let [xScale, yScale] = getScale(embRange)

      const svgs = svgRefs.map(svgRef => d3.select(svgRef.current))
      const gs = gRefs.map(gRef => d3.select(gRef.current))

      makeMapZoomable(svgs, gs)
      for (let i = 0; i < numLayers; i++) {
        let g = gs[i]
        let data = store.embData[constant.layers[i]]
        drawMap(g, data, xScale, yScale)
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

    const getMinMaxCoord = () => {
      let [minX, maxX, minY, maxY] = [0, 0, 0, 0]
      for (let layer of constant.layers) {
        for (let epoch of constant.epochs) {
          let embs = store.embData[layer][epoch]['emb']
          for (let emb of embs) {
            let [x, y] = [emb[0], emb[1]]
            minX = getMin(x, minX)
            maxX = getMax(x, maxX)
            minY = getMin(y, minY)
            maxY = getMax(y, maxY)
          }
        }
      }
      let embRange = {
        'x': {'min': minX, 'max': maxX},
        'y': {'min': minY, 'max': maxY}
      }
      return embRange
    }

    const getMin = (a, b) => {
      if (a < b) {
        return a
      } else {
        return b
      }
    }

    const getMax = (a, b) => {
      if (a > b) {
        return a
      } else {
        return b
      }
    }

    const getScale = (embRange) => {
      let xScale = d3.scaleLinear()
        .domain([embRange.x.min, embRange.x.max])
        .range([0, constant.mapWidth])

      let yScale = d3.scaleLinear()
        .domain([embRange.y.min, embRange.y.max])
        .range([0, constant.mapHeight])

      return [xScale, yScale]
    }

    const drawMap = (g, data, xScale, yScale) => {
      g.selectAll("rect")
        .data(data[store.epoch]['emb'])
        .join("rect")
          .attr("id", (d, i) => `emb-${i}`)
          .attr("class", "emb")
          .attr("x", (d) => xScale(d[0]))
          .attr("y", (d) => yScale(d[1]))
          .attr("width", constant.embSize)
          .attr("height", constant.embSize)
          .attr("fill", constant.embColor)
    }

    return (
      <div id="map-wrap">
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
    )
    
  }
)