import { observer } from "mobx-react";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import * as constant from "./constant.js";


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

  const handleClassNameChange = () => {

  }

  return <div className="topnav">
    <div className="logo-text">
      <b>NeuroMapper</b>
    </div>
  </div>;
});
