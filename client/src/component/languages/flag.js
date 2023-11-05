import React from "react";
import vietnamFlag from "./vietnam.png";
import usFlag from "./us.png";
export default function flag({ flagName }) {
  const src =
    flagName === "Vietnam" ? vietnamFlag : flagName === "US" && usFlag;
  return <img src={src} alt={flagName} style={{ width: 40, height: 40 }} />;
}
