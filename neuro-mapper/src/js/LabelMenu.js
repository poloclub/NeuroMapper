import { observer } from "mobx-react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import * as constant from "./constant.js";
import { ScatterGL, RenderMode } from "scatter-gl";
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

export const LabelMenu = observer(
    ({
      store
    }) => {
        let handleChange = (event) => {

          let currLabels = store.showLabels;
          if (event.target.checked) {
            currLabels.push(event.target.value)
          } else {
            const index = currLabels.indexOf(event.target.value);
            if (index > -1) {
              currLabels.splice(index, 1);
            }
          }
          store.setShowLabels(currLabels)

          for (let i = 0; i < constant.layers.length; i++) {
            let layer = constant.layers[i]
            let points = store.embData[layer]
            let epoch = store.epoch
            
            const labels = []
            const datapoints = []
            for (let i = 0; i < points.length; i++) {
              if (store.showLabels.includes(constant.cifar_10_classes[points[i]["label"]])) {
                labels.push(points[i]["label"])
                datapoints.push(points[i]["emb"][epoch])
              }
            }

            const metadata = [];
            labels.forEach(element => {
              metadata.push({
                labelIndex: element,
                label: constant.cifar_10_classes[element]
              })
            });

            const dataset = new ScatterGL.Dataset(datapoints, metadata);
            dataset.setSpriteMetadata({
              spriteImage: 'spritesheet.png',
              singleSpriteSize: [32, 32],
            });
            store.plots[i].updateDataset(dataset)
            store.plots[i].setPointColorer((i, selectedIndices, hoverIndex) => {
              const isSelected = selectedIndices.has(i);
              if (hoverIndex === i) {
                return "red";
              }
              return isSelected
                ? constant.opaqueColorsByLabel[labels[i]]
                : constant.heavyTransparentColorsByLabel[labels[i]];
            });
          }

        }

        return (
            // <div className="label-menu">
            //     <FormGroup row>
            //       {constant.cifar_10_classes.map(label => {
            //         return(
            //           <FormControlLabel
            //             value={label}
            //             control={
            //               <Checkbox 
            //                 defaultChecked 
            //                 onChange={handleChange}
            //               />
            //             }
            //             label={`${label} class:`}
            //             labelPlacement='start'
            //           />
            //         )
            //       })}
            //     </FormGroup>
            // </div>

            <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Class Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          value={constant.cifar_10_classes}
          MenuProps={MenuProps}
        >
          {constant.cifar_10_classes.map((label) => (
            <MenuItem
              key={label}
              value={label}
            >
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>


            
        )
    }
)