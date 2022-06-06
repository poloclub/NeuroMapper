import { observer } from "mobx-react";
import * as constant from "./constant.js";
import { OneNeighborView } from "./OneNeighborView.js";

export const NeighborView = observer(({ store, index }) => {

  const layerName = constant.layers[index]
  
  const getNeighborData = () => {
    return store.neighborData[layerName][store.epoch][store.clickedImageIndex]
  }

  return (
    <div className="neighbor-view">
      {(store.clickedImageIndex != null) &&
        getNeighborData()["neighbors"].map((nei, i) => {
          return (
            <OneNeighborView 
              label={store.embData[layerName][nei]["label"]}
              similarity={getNeighborData()["distances"][i]}
            />
          )
        })
      }
    </div>
  )
});