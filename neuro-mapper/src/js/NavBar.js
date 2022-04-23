import { observer } from "mobx-react";

export const NavBar = observer(({ store }) => {
  return <div className="topnav">
    <div className="logo-text">
      <b>NeuroMapper</b>
    </div>
  </div>;
});
