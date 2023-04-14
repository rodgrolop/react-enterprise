import React from "react";
import ReactDOM from "react-dom/client";

import { Text, Margin, Select } from "@ds.e/react";

import "@ds.e/scss/lib/Utilities.css";
import "@ds.e/scss/lib/Text.css";
import "@ds.e/scss/lib/Margin.css";
import "@ds.e/scss/lib/Select.css";
import "@ds.e/scss/lib/global.css";

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
