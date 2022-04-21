import { observer } from "mobx-react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import * as constant from "./constant.js";

export const LabelMenu = observer(
    ({
      store
    }) => {
        let handleChange = (event) => {
          console.log(event.target.value)
          console.log(event.target.checked)
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