import React from "react";
import Color from "./Color";
import { text, select } from "@storybook/addon-knobs";

import { Spacing } from "@rgl-test/foundation";

// css
import "@rgl-test/scss/lib/Utilities.css";

export default {
  title: "Atoms|Color",
};

export const Common = () => <Color hexCode={text("HexCode", "pink")} />;

export const CustomDimensions = () => (
  <Color
    hexCode={text("HexCode", "pink")}
    width={
      select("Width", Object.values(Spacing), "xxl") as keyof typeof Spacing
    }
    height={
      select("Height", Object.values(Spacing), "xxl") as keyof typeof Spacing
    }
  />
);
