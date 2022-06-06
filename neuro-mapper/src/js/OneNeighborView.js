import { observer } from "mobx-react";
import * as constant from "./constant.js";

export const OneNeighborView = observer(({ label, similarity }) => {
  return (
    <div className="one-neigbor">
      <div className="nei-label">
        {constant.cifar_10_classes[label]}
      </div>
      <div className="nei-sim">
        {similarity}
      </div>
    </div>
  )
})