import * as d3 from "d3";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { Slider } from "@mui/material";
import * as constant from "./constant.js";
import { toJS } from "mobx";
import Plot from "react-plotly.js"

export const MapPlotly = observer(
  ({
    store
  }) => {

    let numLayers = constant.layers.length
    const svgRefs = [...Array(numLayers)].map(x => useRef(null))
    const gRefs = [...Array(numLayers)].map(x => useRef(null))

    useEffect(() => {

      if (!store.loadingEmbDone) {
        return;
      }
      // console.log(store.loadingEmbDone)
      // store.setXYScale()

      // const svgs = svgRefs.map(svgRef => d3.select(svgRef.current))
      // const gs = gRefs.map(gRef => d3.select(gRef.current))

      // for (let i = 0; i < numLayers; i++) {
        
      //   let g = gs[i]
      //   let layer = constant.layers[i]
      //   // console.log(store.embData[layer][store.epoch]['color'])
        
      //   let data = store.embData[layer]
      //   drawMap(g, layer, data)
      // }
      
    }, [store.loadingEmbDone])


    // const drawMap = (g, layer, data) => {
      
    // }

    const handleSliderChange = (e, val) => {
      let epoch = val
      store.setEpoch(epoch)

      // for (let layer of constant.layers) {
      //   d3.select(`#map-g-${layer}`)
      //     .selectAll(`.emb-${layer}`)
      //     .transition()
      //       .attr("x", (d) => store.xScale(d['emb'][epoch][0]))
      //       .attr("y", (d) => store.yScale(d['emb'][epoch][1]))
      // }

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
                <div
                  id={`map-plotly-${layer}`}
                  ref={svgRefs[i]} 
                  width={constant.mapWidth}
                  height={constant.mapHeight}
                >
                  <Plot
                    data={[{
                      x: store.loadingEmbDone ? store.embData[layer][store.epoch]['x'] : [],
                      y: store.loadingEmbDone ? store.embData[layer][store.epoch]['y'] : [],
                      type: 'scattergl',
                      mode: 'markers',
                      marker: {color: store.loadingEmbDone ? store.embData[layer][store.epoch]['color'] : []}
                    }]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    
  }
)