import * as constant from "./constant.js";
import { observer } from "mobx-react";
import { Slider } from "@mui/material";
import { ScatterGL, RenderMode } from "scatter-gl";
import { EpochControlBottons } from "./EpochControlButtons.js";

export const EpochControl = observer(({ store }) => {
  const handleSliderChange = (e, val) => {
    let epoch = val;
    store.setEpoch(epoch);

    for (let i = 0; i < constant.layers.length; i++) {
      store.updateCustomEmbData(i);
    }
  };

  return (
    <div id="epoch-control">
      <Slider
        value={store.epoch}
        valueLabelDisplay="auto"
        step={5}
        min={constant.epochs[0]}
        max={constant.epochs.slice(-1)[0]}
        color="secondary"
        onChange={handleSliderChange}
      />
      <div id="epoch-val">epoch = {store.epoch}</div>
      <EpochControlBottons store={store} />
    </div>
  );
});
