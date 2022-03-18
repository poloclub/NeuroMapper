import { observable, makeObservable, action } from "mobx";
import * as constant from "./constant.js";

export class Store {
  /**
   * Training status
   */

  epoch = 0
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

  /**
   * Constructor of Store
   */

  constructor() {
    // Make data observable
    makeObservable(this, {
      epoch: observable,
      setEpoch: action,
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
    // let embData = {}
    for (let layer of constant.layers) {
      // Initialize embData
      this.embData[layer] = {}

      for (let epoch of constant.epochs) {
        // Initialize embData
        this.embData[layer][epoch] = {}

        // File paths
        let dirPath = [constant.embDir, layer].join('/')
        let embFileName = `${dirPath}/${epoch}_embedding.csv`
        let labelFileName = `${dirPath}/${epoch}_labels.csv`

        // Load embedding data
        fetch(embFileName)
        .then(res => res.text())
        .then(data => {
          data = data
            .split('\n')
            .map(coord => coord.split(',').map(v => parseFloat(v)))
            .slice(0, -1)
          this.embData[layer][epoch]['emb'] = data
        })

        // Load label data
        fetch(labelFileName)
        .then(res => res.text())
        .then(data => {
          data = data
            .split('\n')
            .map(label => parseFloat(label))
            .slice(0, -1)
          this.embData[layer][epoch]['label'] = data
        })
      }
    }
  }

}