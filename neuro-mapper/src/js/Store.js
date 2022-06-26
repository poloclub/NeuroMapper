import { observable, makeObservable, action } from "mobx";
import { ScatterGL, RenderMode } from "scatter-gl";
import * as constant from "./constant.js";
import { create, all } from "mathjs";

const math = create(all, {});

export class Store {
  /**
   * Training status
   */

  epoch = constant.epochs[0];
  setEpoch(epoch) {
    this.epoch = epoch;
  }

  /**
   * embData
   */

  loadingEmbDone = false;
  setLoadingEmbDone(loadingEmbDone) {
    this.loadingEmbDone = loadingEmbDone;
  }

  embData = {};
  setEmbData(embData) {
    this.embData = embData;
  }

  embRange = {};
  setEmbRange(embRange) {
    this.embRange = embRange;
  }

  xScale = null;
  setXScale(xScale) {
    this.xScale = xScale;
  }

  yScale = null;
  setYScale(yScale) {
    this.yScale = yScale;
  }

  /**
   * Selected layer
   */

  selectedLayerIdx = -1;
  setSelectedLayerIdx(selectedLayerIdx) {
    this.selectedLayerIdx = selectedLayerIdx;
  }

  /**
   * Selected data
   */

  hoverImageIndex = null;
  setHoverImageIndex(hoverImageIndex) {
    this.hoverImageIndex = hoverImageIndex;
  }

  /**
   * Rendering
   */

  plots = [];
  setPlots(plots) {
    this.plots = plots;
  }

  setPlotsIndex(index, plot) {
    this.plots[index] = plot;
  }

  addPlot(plot) {
    this.plots.push(plot);
  }

  renderMode = "point";
  setRenderMode(renderMode) {
    this.renderMode = renderMode;
  }

  /**
   * Animation status
   * Should be one among ["pause" "play"]
   */

  animationStatus = "pause";
  setAnimationStatus(animationStatus) {
    this.animationStatus = animationStatus;
  }

  nNeighbors = constant.defaultNNeighbors;
  setNNeighbors(index, value) {
    this.nNeighbors[index] = value;
  }

  minDists = constant.defaultMinDist;
  setMinDists(index, value) {
    this.minDists[index] = value;
  }

  sampleSize = constant.defaultSampleSize;
  setSampleSize(value) {
    this.sampleSize = value;
  }

  sampleIndices = constant.defaultSampleIndices;
  setSampleIndices(sampleIndices) {
    this.sampleIndices = sampleIndices;
  }

  showLabels = constant.cifar_10_classes;
  setShowLabels(value) {
    this.showLabels = value;
  }
  addShowLabels(value) {
    this.showLabels.push(value);
  }

  showLabels = constant.cifar_10_classes;
  setShowLabels(value) {
    this.showLabels = value;
  }
  /**
   * Constructor of Store
   */

  constructor() {
    // Make data observable
    makeObservable(this, {
      epoch: observable,
      setEpoch: action,
      loadingEmbDone: observable,
      setLoadingEmbDone: action,
      embData: observable,
      setEmbData: action,
      embRange: observable,
      setEmbRange: action,
      xScale: observable,
      setXScale: action,
      yScale: observable,
      setYScale: action,
      selectedLayerIdx: observable,
      setSelectedLayerIdx: action,
      hoverImageIndex: observable,
      setHoverImageIndex: action,
      plots: observable,
      setPlots: action,
      setPlotsIndex: action,
      addPlot: action,
      renderMode: observable,
      setRenderMode: action,
      animationStatus: observable,
      setAnimationStatus: action,
      nNeighbors: observable,
      setNNeighbors: action,
      minDists: observable,
      setMinDists: action,
      sampleSize: observable,
      setSampleSize: action,
      showLabels: observable,
      setShowLabels: action,
      addShowLabels: action,
      sampleIndices: observable,
      setSampleIndices: action,
    });

    // Load data
    this.loadAllData();
  }

  /**
   * Load data
   */

  loadAllData() {
    this.loadEmbData();
  }

  loadEmbData() {
    let embData = {};
    for (let i = 0; i < constant.layers.length; i++) {
      let layer = constant.layers[i];
      // Initialize embData
      embData[layer] = {};

      for (let epoch of constant.epochs) {
        // Initialize embData
        embData[layer][epoch] = {};

        // File paths
        let customFilePath = [
          layer,
          "_pre_embeded",
          `_(${constant.defaultNNeighbors[i]}, ${constant.defaultMinDist[i]})`,
        ].join("");
        let dirPath = [constant.embDir, customFilePath].join("/");
        let embFileName = `${dirPath}/${epoch}_embedding.csv`;
        let labelFileName = `${dirPath}/${epoch}_labels.csv`;

        // Load embedding and label data
        fetch(embFileName)
          .then((res) => res.text())
          .then((data) => {
            data = data
              .split("\n")
              .map((coord) => coord.split(",").map((v) => parseFloat(v)))
              .slice(0, -1);
            embData[layer][epoch]["emb"] = data;

            // Load label data
            fetch(labelFileName)
              .then((res) => res.text())
              .then((labelData) => {
                labelData = labelData
                  .split("\n")
                  .map((label) => parseFloat(label))
                  .slice(0, -1);
                embData[layer][epoch]["label"] = labelData;

                if (
                  this.isLast(layer, constant.layers) &&
                  this.isLast(epoch, constant.epochs)
                ) {
                  this.parseEmbData(embData);
                  this.setLoadingEmbDone(true);
                }
              });
          });
      }
    }
  }

  shuffle(array) {
    var tmp,
      current,
      top = array.length;
    if (top)
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    return array;
  }

  regenerateSample(sampleSize) {
    let newSampleIndices = this.shuffle(
      Array.from(Array(constant.defaultSampleSize).keys())
    )
      .slice(0, sampleSize)
      .sort((a, b) => a - b);
    this.setSampleIndices(newSampleIndices);
  }

  loadCustomEmbData(index, nNeighbors, minDists) {
    let tempData = {};

    let promises = [];
    let layer = constant.layers[index];

    for (let epoch of constant.epochs) {
      // Initialize embData
      tempData[epoch] = {};

      let customFilePath = [
        layer,
        "_pre_embeded",
        `_(${nNeighbors}, ${minDists})`,
      ].join("");
      // File paths
      let dirPath = [constant.embDir, customFilePath].join("/");
      let embFileName = `${dirPath}/${epoch}_embedding.csv`;
      let labelFileName = `${dirPath}/${epoch}_labels.csv`;

      // Load embedding and label data
      promises.push(
        fetch(embFileName)
          .then((res) => res.text())
          .then((data) => {
            data = data
              .split("\n")
              .map((coord) => coord.split(",").map((v) => parseFloat(v)))
              .slice(0, -1);
            tempData[epoch]["emb"] = data;

            // Load label data
            fetch(labelFileName)
              .then((res) => res.text())
              .then((labelData) => {
                labelData = labelData
                  .split("\n")
                  .map((label) => parseFloat(label))
                  .slice(0, -1);
                tempData[epoch]["label"] = labelData;

                if (this.isLast(epoch, constant.epochs)) {
                  let fstEpoch = constant.epochs[0];
                  let numEmbPoints = tempData[fstEpoch]["emb"].length;
                  let parsedEmbData = Array(numEmbPoints);
                  for (let i = 0; i < numEmbPoints; i++) {
                    parsedEmbData[i] = {
                      emb: {},
                      label: tempData[fstEpoch]["label"][i],
                    };
                    for (let epoch of constant.epochs) {
                      parsedEmbData[i]["emb"][epoch] =
                        tempData[epoch]["emb"][i];
                    }
                  }

                  this.embData[layer] = parsedEmbData;
                  this.setLoadingEmbDone(true);
                  this.updateCustomEmbData(index);
                }
              });
          })
      );
    }
  }

  updateCustomEmbData(index) {
    let layer = constant.layers[index];
    let points = this.embData[layer];
    let epoch = this.epoch;

    const labels = [];
    const datapoints = [];
    let sampleIndicesPtr = 0;
    for (let i = 0; i < points.length; i++) {
      let hasShownLabel = this.showLabels.includes(
        constant.cifar_10_classes[points[i]["label"]]
      );
      if (
        hasShownLabel &&
        sampleIndicesPtr < this.sampleIndices.length &&
        this.sampleIndices[sampleIndicesPtr] == i
      ) {
        labels.push(points[i]["label"]);
        let point = points[i]["emb"][epoch];
        point = math.rotate(
          point,
          (math.pi / 6) * constant.rotationAmount[index]
        );
        point[0] = point[0] * constant.flipAmount[index];
        datapoints.push(point);
        sampleIndicesPtr += 1;
      } else if (
        !hasShownLabel &&
        sampleIndicesPtr < this.sampleIndices.length &&
        this.sampleIndices[sampleIndicesPtr] == i
      ) {
        sampleIndicesPtr += 1;
      }
    }

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
    this.plots[index].updateDataset(dataset);
    this.plots[index].setPointColorer((i, selectedIndices, hoverIndex) => {
      const isSelected = selectedIndices.has(i);
      if (hoverIndex === i) {
        return "red";
      }
      return isSelected
        ? constant.opaqueColorsByLabel[labels[i]]
        : constant.heavyTransparentColorsByLabel[labels[i]];
    });
  }

  getLast(arr) {
    return arr.slice(-1)[0];
  }

  isLast(e, arr) {
    return e === this.getLast(arr);
  }

  parseEmbData(embData) {
    let parsedEmbData = {};
    let [fstLayer, fstEpoch] = [constant.layers[0], constant.epochs[0]];
    let numEmbPoints = embData[fstLayer][fstEpoch]["label"].length;
    for (let layer of constant.layers) {
      parsedEmbData[layer] = Array(numEmbPoints);
      for (let i = 0; i < numEmbPoints; i++) {
        parsedEmbData[layer][i] = {
          emb: {},
          label: embData[layer][fstEpoch]["label"][i],
        };
        for (let epoch of constant.epochs) {
          parsedEmbData[layer][i]["emb"][epoch] =
            embData[layer][epoch]["emb"][i];
        }
      }
    }
    this.setEmbData(parsedEmbData);
    this.setEmbRange(this.getMinMaxCoord());
  }

  /**
   * Embedding xy scale
   */

  getMinMaxCoord = () => {
    let [minX, maxX, minY, maxY] = [0, 0, 0, 0];
    let fstLayer = constant.layers[0];
    let numEmbPoints = this.embData[fstLayer].length;
    for (let layer of constant.layers) {
      for (let i = 0; i < numEmbPoints; i++) {
        for (let epoch of constant.epochs) {
          let emb = this.embData[layer][i]["emb"][epoch];
          let [x, y] = [emb[0], emb[1]];
          minX = this.getMin(x, minX);
          maxX = this.getMax(x, maxX);
          minY = this.getMin(y, minY);
          maxY = this.getMax(y, maxY);
        }
      }
    }
    let embRange = {
      x: { min: minX, max: maxX },
      y: { min: minY, max: maxY },
    };
    return embRange;
  };

  getMin = (a, b) => {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  };

  getMax = (a, b) => {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };
}
