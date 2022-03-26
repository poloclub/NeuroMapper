import * as d3 from "d3";
import { observable, makeObservable, action } from "mobx";
import * as constant from "./constant.js";


export class Store {
  /**
   * Training status
   */

  epoch = constant.epochs[0]
  setEpoch(epoch) {
  this.epoch = epoch
  }

  /**
   * embData
   */
  embData = {}
  setEmbData(embData) {
    this.embData = embData
  }

  loadingEmbDone = false
  setLoadingEmbDone(loadingEmbDone) {
    this.loadingEmbDone = loadingEmbDone
  }

  xScale = null
  setXScale(xScale) {
    this.xScale = xScale
  }

  yScale = null
  setYScale(yScale) {
    this.yScale = yScale
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
      xScale: observable,
      setXScale: action,
      yScale: observable,
      setYScale: action,
      embData: observable,
      setEmbData: action
    })

    // Load data
    this.loadAllData()
  }

  /**
   * Load data
   */

  loadAllData() {
    this.loadEmbData()
  }

  loadEmbData() {
    let embData = {}
    for (let layer of constant.layers) {
      // Initialize embData
      embData[layer] = {}

      for (let epoch of constant.epochs) {
        // Initialize embData
        embData[layer][epoch] = {}

        // File paths
        let dirPath = [constant.embDir, layer].join('/')
        let embFileName = `${dirPath}/${epoch}_embedding.csv`
        let labelFileName = `${dirPath}/${epoch}_labels.csv`

        // Load embedding and label data
        fetch(embFileName)
          .then(res => res.text())
          .then(data => {
            data = data
              .split('\n')
              .map(coord => coord.split(',').map(v => parseFloat(v)))
              .slice(0, -1)
            embData[layer][epoch]['emb'] = data

            // Load label data
            fetch(labelFileName)
              .then(res => res.text())
              .then(labelData => {
                labelData = labelData
                  .split('\n')
                  .map(label => parseFloat(label))
                  .slice(0, -1)
                embData[layer][epoch]['label'] = labelData

                if (this.isLast(layer, constant.layers) && this.isLast(epoch, constant.epochs)) {
                  this.parseEmbData(embData)
                  this.setLoadingEmbDone(true)
                }
              })
          })
      }
    }
  }

  getLast(arr) {
    return arr.slice(-1)[0]
  }

  isLast(e, arr) {
    return e === this.getLast(arr)
  }

  parseEmbData(embData) {
    let parsedEmbData = {}
    let [fstLayer, fstEpoch] = [constant.layers[0], constant.epochs[0]]
    let numEmbPoints = embData[fstLayer][fstEpoch]['label'].length
    for (let layer of constant.layers) {
      parsedEmbData[layer] = Array(numEmbPoints)
      for (let i = 0; i < numEmbPoints; i++) {
        parsedEmbData[layer][i] = {
          'emb': {}, 
          'label': embData[layer][fstEpoch]['label'][i]
        }
        for (let epoch of constant.epochs) {
          parsedEmbData[layer][i]['emb'][epoch] = embData[layer][epoch]['emb'][i]
        }
      }
    }
    this.setEmbData(parsedEmbData)
  }

  /**
   * Embedding xy scale
   */

  setXYScale = () => {
    let embRange = this.getMinMaxCoord()
    let [xScale, yScale] = this.getScale(embRange)
    this.setXScale(xScale)
    this.setYScale(yScale)
  }

  getMinMaxCoord = () => {
    let [minX, maxX, minY, maxY] = [0, 0, 0, 0]
    let fstLayer = constant.layers[0]
    let numEmbPoints = this.embData[fstLayer].length
    for (let layer of constant.layers) {
      for (let i = 0; i < numEmbPoints; i++) {
        for (let epoch of constant.epochs) {
          let emb = this.embData[layer][i]['emb'][epoch]
          let [x, y] = [emb[0], emb[1]]
          minX = this.getMin(x, minX)
          maxX = this.getMax(x, maxX)
          minY = this.getMin(y, minY)
          maxY = this.getMax(y, maxY)
        }
      }
    }
    let embRange = {
      'x': {'min': minX, 'max': maxX},
      'y': {'min': minY, 'max': maxY}
    }
    return embRange
  }

  getMin = (a, b) => {
    if (a < b) {
      return a
    } else {
      return b
    }
  }

  getMax = (a, b) => {
    if (a > b) {
      return a
    } else {
      return b
    }
  }

  getScale = (embRange) => {
    let xScale = d3.scaleLinear()
      .domain([embRange.x.min, embRange.x.max])
      .range([0, constant.mapWidth])

    let yScale = d3.scaleLinear()
      .domain([embRange.y.min, embRange.y.max])
      .range([0, constant.mapHeight])

    return [xScale, yScale]
  }

}