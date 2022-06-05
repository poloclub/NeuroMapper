import { observer } from "mobx-react";
import { useEffect } from "react";

import * as constant from "./constant.js";
import { ScatterGL } from "scatter-gl";
import { EpochControl } from "./EpochControl.js";
import { HyperparameterMenu } from "./HyperparameterMenu"
import { NeighborView } from "./NeighborView.js";

export const MapScatterGL = observer(({ store }) => {
  let numLayers = constant.layers.length;

  useEffect(() => {
    if (!store.loadingEmbDone) {
      return;
    }

    if (store.plots.length === 0) {
      for (let i = 0; i < numLayers; i++) {
        let layer = constant.layers[i];
        let points = store.embData[layer];
        let curr_selector = `#scatter-gl-container-layer${i}`;
        renderScatterGL(points, curr_selector);
      }
    }
    fixScatterGLLabel();
  }, [store.loadingEmbDone]);

  const fixScatterGLLabel = () => {
    let scatterGlCavasSelectors = [
      "#scatter-gl-container-layer0 > canvas:nth-child(3)",
      "#scatter-gl-container-layer1 > canvas:nth-child(3)",
      "#scatter-gl-container-layer2 > canvas:nth-child(3)",
      "#scatter-gl-container-layer3 > canvas:nth-child(3)",
    ];
    let referenceCanvas = [
      "#scatter-gl-container-layer0 > canvas:nth-child(2)",
      "#scatter-gl-container-layer1 > canvas:nth-child(2)",
      "#scatter-gl-container-layer2 > canvas:nth-child(2)",
      "#scatter-gl-container-layer3 > canvas:nth-child(2)",
    ];
    for (let i = 0; i < scatterGlCavasSelectors.length; i++) {
      let glCanvas = document.querySelector(scatterGlCavasSelectors[i]);
      let currReference = document.querySelector(referenceCanvas[i]);
      const rect = currReference.getBoundingClientRect();
      glCanvas.style.position = "absolute";
      glCanvas.style.left = "" + (rect.left + window.scrollX) + "px";
      glCanvas.style.top = "" + (rect.top + window.scrollY) + "px";
    }
  };

  let renderScatterGL = (points, selector) => {
    let epoch = store.epoch;
    const labels = points.map((point) => point["label"]);
    const datapoints = points.map((point) => point["emb"][epoch]);
    const metadata = [];
    labels.forEach((element) => {
      metadata.push({
        labelIndex: element,
        label: constant.cifar_10_classes[element],
      });
    });

    const dataset = new ScatterGL.Dataset(datapoints, metadata);

    dataset.setSpriteMetadata({
      spriteImage: "spritesheet.png",
      singleSpriteSize: [32, 32],
    });

    let containerElement = document.querySelector(selector);
    const scatterGL = new ScatterGL(containerElement, {
      camera: {
        //zoom: 2.125
      },
      orbitControls: {
        // zoomSpeed: 1.125
      },
      onHover: (point) => {
        store.setHoverImageIndex(point);
        for (let i = 0; i < store.plots.length; i++) {
          store.plots[i].setHoverPointIndex(point);
        }
      },
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

    if (store.renderMode === "point") {
      scatterGL.setPointRenderMode();
    } else if (store.renderMode === "sprite") {
      scatterGL.setSpriteRenderMode();
    } else if (store.renderMode === "text") {
      scatterGL.setTextRenderMode();
    }
    store.addPlot(scatterGL);
  };

  return (
    <div id="map-wrap">
      <div id="map-contents">
        {constant.layers.map((layer, i) => {
            let curr_id = `scatter-gl-wrapper-layer${i}`
            let curr_scattergl_id = `scatter-gl-container-layer${i}`
            return (
              <div id={curr_id} className="scatter-gl-wrapper-layer">
                <div className={`scatter-gl-layer-label`}> Layer {i + 1} </div>
                <div
                  id={curr_scattergl_id}
                  className={`scatter-gl-container-layer`}
                />
                <HyperparameterMenu store={store} index={i} />
                <NeighborView store={store} index={i} />
              </div>
            )
          })}
      </div>
        <EpochControl store={store}/>
    </div>
  );
});
