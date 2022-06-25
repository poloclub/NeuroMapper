import { observer } from "mobx-react";
import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as constant from "./constant.js";

export const SampleControl = observer(({ store }) => {

  let handleSampleSizeChange = (event) => {
    store.setSampleSize(event.target.value)
    store.regenerateSample(event.target.value)
    constant.layers.map((layer, i) => { 
      console.log(store.nNeighbors[i])
      console.log(store.minDists[i])
      console.log(event.target.value)
      store.loadCustomEmbData(i, store.nNeighbors[i], store.minDists[i], store.sampleSize);
    });
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Sample Size</InputLabel>
        <Select
          value={store.sampleSize}
          onChange={handleSampleSizeChange}
          label="Sample Size"
        >
          <MenuItem value={500}>500</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>
          <MenuItem value={2000}>2000</MenuItem>
          <MenuItem value={4000}>4000</MenuItem>
          <MenuItem value={6000}>6000</MenuItem>
          <MenuItem value={8000}>8000</MenuItem>
          <MenuItem value={10000}>10000</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
});
