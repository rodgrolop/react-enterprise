import React from "react";
import ReactDOM from "react-dom/client";

import { Text, Margin, Select } from "@rgl-test/react";

import "@rgl-test/scss/lib/Utilities.css";
import "@rgl-test/scss/lib/Text.css";
import "@rgl-test/scss/lib/Margin.css";
import "@rgl-test/scss/lib/Select.css";
import "@rgl-test/scss/lib/global.css";

const options = [
  { label: "test1", value: "test1" },
  { label: "test2", value: "test2" },
  { label: "test3", value: "test3" },
];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <div style={{ padding: "40px" }}>
    <Margin>
      <Select options={options} />
    </Margin>
  </div>
);
