import { observer } from "mobx-react";
import { LabelMenu } from "./LabelMenu";

export const NavBar = observer(({ store }) => {
  return <div className="topnav">
    <div className="logo-text">
      <b>NeuroMapper</b>
    </div>
    <div className="class-menu">
      <LabelMenu store={store} />
    </div>
  </div>;
});
