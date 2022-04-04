import * as d3 from "d3";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { Slider } from "@mui/material";
import * as constant from "./constant.js";
import { ScatterGL } from "scatter-gl";

export const MapSVG = observer(
  ({
    store
  }) => {

    let numLayers = constant.layers.length
    const svgRefs = [...Array(numLayers)].map(x => useRef(null))
    const gRefs = [...Array(numLayers)].map(x => useRef(null))
    let gls = []

    useEffect(() => {

      if (!store.loadingEmbDone) {
        return;
      }

      if (gls.length == 0) {
      for (let i = 0; i < numLayers; i++) {
        let layer = constant.layers[i]
        let points = store.embData[layer]
        let curr_selector = `#scatter-gl-container-layer${i}`
        renderScatterGL(points, curr_selector)
      }
    }
      
    }, [store.loadingEmbDone])

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

      for (let i = 0; i < numLayers; i++) {
        let layer = constant.layers[i]
        let points = store.embData[layer]
        let epoch = store.epoch
        const dataset = new ScatterGL.Dataset(points.map((point => point['emb'][epoch])));
        gls[i].updateDataset(dataset)
      }

      document.getElementById("epoch-val").innerText = `epoch = ${epoch}`
    }

    let renderScatterGL = (points, selector) => {
      let epoch = store.epoch
      const dataset = new ScatterGL.Dataset(points.map((point => point['emb'][epoch])));
      
      const labels = points.map(point => point['label']);
      let containerElement = document.querySelector(selector);
      const scatterGL = new ScatterGL(containerElement, {
        camera: {
          //zoom: 2.125
        },
        orbitControls: {
          // zoomSpeed: 1.125
        }
      });
      
      scatterGL.render(dataset);

      scatterGL.setPointColorer((i, selectedIndices, hoverIndex) => {
        const isSelected = selectedIndices.has(i);
        if (hoverIndex === i) {
          return "red";
        }
        return isSelected
          ? constant.opaqueColorsByLabel[labels[i]]
          : constant.heavyTransparentColorsByLabel[labels[i]];
      });

      gls.push(scatterGL)

    }

    return (
      <div id="map-wrap">
        
        <div id="map-contents">
        {constant.layers.map((layer, i) => {
            let curr_id = `scatter-gl-container-layer${i}`
            return (
              <div id={curr_id} class={`scatter-gl-container-layer`}>
              </div>
            )
          })}
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
        <div id="epoch-val">
          epoch = {constant.epochs[0]}
        </div>
      </div>
    )
    
  }
)