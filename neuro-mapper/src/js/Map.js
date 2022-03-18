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
      const svgs = svgRefs.map(svgRef => d3.select(svgRef.current))
      const gs = gRefs.map(gRef => d3.select(gRef.current))

      makeMapZoomable(svgs, gs)
      // drawMap(g)
      // console.log(store.embData)
    }, [store.embData])

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