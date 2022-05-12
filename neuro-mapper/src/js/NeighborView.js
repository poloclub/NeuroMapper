import { observer } from "mobx-react";

export const NeighborView = observer(({ store, index }) => {
  return (
    <div className="neighbor-view">
      Neighbors
    </div>
  )
});
