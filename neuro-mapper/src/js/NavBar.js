import { observer } from "mobx-react";
import { LabelMenu } from "./LabelMenu";
import { SampleControl } from "./SampleControl";
import * as constant from "./constant.js";
import { Slider } from "@mui/material";
import { EpochControlBottons } from "./EpochControlButtons.js";

export const NavBar = observer(({ store }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleSliderChange = (e, val) => {
    let epoch = val;
    store.setEpoch(epoch);

    for (let i = 0; i < constant.layers.length; i++) {
      store.updateCustomEmbData(i);
    }
  };

  return (
    <div className="topnav">
      <div className="logo-text">
        <b>NeuroMapper</b>
      </div>
      <EpochControlBottons store={store} />
      <div className="epoch">
        <div id="epoch-label">Epoch</div>
        <div id="epoch-val">{store.epoch}</div>
      </div>
      <div className="epoch-slider">
        <Slider
            value={store.epoch}
            valueLabelDisplay="auto"
            step={5}
            min={constant.epochs[0]}
            max={constant.epochs.slice(-1)[0]}
            color="secondary"
            onChange={handleSliderChange}
          />
      </div>
      <SampleControl store={store} />
      <div className="class-menu">
        <LabelMenu store={store} />
      </div>
    </div>
  );
});
