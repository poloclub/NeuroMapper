import { observer } from "mobx-react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import * as constant from "./constant.js";
import { ScatterGL, RenderMode } from "scatter-gl";


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
            <div className="label-menu">
                <FormGroup row>
                  {constant.cifar_10_classes.map(label => {
                    return(
                      <FormControlLabel
                        value={label}
                        control={
                          <Checkbox 
                            defaultChecked 
                            onChange={handleChange}
                          />
                        }
                        label={`${label} class:`}
                        labelPlacement='start'
                      />
                    )
                  })}
                </FormGroup>
            </div>
        )
    }
)