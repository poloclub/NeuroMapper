import { observer } from "mobx-react";
import * as constant from "./constant.js";
import { ScatterGL, RenderMode } from "scatter-gl";
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: '20%',
    },
  },
};

const useStyles = makeStyles(theme => ({
  quantityRoot: {
    color: "transparent",
    backgroundColor: "transparent",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "transparent",
      borderRadius: "0px",
    },
    "&:focus-within": {
      backgroundColor: "transparent",
      borderRadius: "0px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "0px solid #484850"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "0px solid #484850"
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "0px solid #484850",
      borderRadius: "0px 0px 0 0"
    },
    "& .Mui-disabled": {
      color: "transparent",
    },
    "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
      border: "0px solid #484850"
    }
  },
  selectRoot: {
    color: "transparent"
  },
  icon: {
    // color: "transparent"
  },
  selectPaper: {
    backgroundColor: "transparent",
    border: "0px solid #484850",
    borderRadius: "0px",
    color: "transparent",
    "& li:hover": {
      backgroundColor: "transparent"
    }
  }
}));

const color = "white";

function getStyles(isSelected, allSelected, theme) {
  return {
    fontWeight:
      isSelected.indexOf(allSelected) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const LabelMenu = observer(
    ({
      store
    }) => {
        let handleChange = (event) => {
          console.log(event.target.dataset.value)
          let clickedLabel = event.target.dataset.value 
          let currLabels = store.showLabels;
          if (currLabels.indexOf(clickedLabel) < 0) {
            currLabels.push(clickedLabel)
          } else {
            const index = currLabels.indexOf(clickedLabel);
            if (index > -1) {
              currLabels.splice(index, 1);
            }
          }
          store.setShowLabels(currLabels)

          for (let i = 0; i < constant.layers.length; i++) {
            store.updateCustomEmbData(i);
          }

        }
        const classes = useStyles();
        const theme = createTheme({
          palette: {
            primary: {
              main: purple[500],
            },
            secondary: {
              main: green[500],
            },
          },
        });

        return (
              <div>
                <FormControl variant="outlined"
                  // sx={{ width: '90%' }}
                  classes={{
                    root: classes.quantityRoot
                  }}>
                  <Select
                  classes={{
                    root: classes.selectRoot,
                    icon: classes.icon
                  }}
                    style={{width:'100%'}}
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={store.showLabels}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    input={<OutlinedInput id="np" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          var class_index = constant.cifar_10_classes.indexOf(value)
                          var class_color = constant.embColors[class_index]
                          return (
                          <Chip key={value} label={value} style={{backgroundColor:'#E0E0E0', border:`2px solid ${class_color}`}}/>
                          )
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    disableUnderline
                  >
                    {constant.cifar_10_classes.map((classLabel) => (
                      <MenuItem
                        key={classLabel}
                        value={classLabel}
                        style={getStyles(classLabel, store.showLabels, theme)}
                        onClick={handleChange}
                      >
                        {classLabel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

            
        )
    }
)