import React from "react";
import ReactDOM from "react-dom";
import "./index.less";

class Page extends React.Component {
  render() {
    const a: any = undefined ?? {};
    const c = a?.name?.abc ?? "";
    console.log(a, c);
    return <div className={"test"}>12312312</div>;
  }
}

ReactDOM.render(<Page />, document.getElementById("root"));
