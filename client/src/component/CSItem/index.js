import { Grid } from "@material-ui/core";
import { Button } from "antd";
import React, { useState } from "react";
import { BsFillCartPlusFill, BsFillCartXFill } from "react-icons/bs";

export default function CSItem({
  width = 30,
  item,
  image,
  exterior,
  float,
  price,
  st,
  onButtonClick,
  display = true,
  height = 150,
}) {
  const [add, setAdd] = useState(false);
  const handleButtonClick = () => {
    setAdd(!add);
    // Call the callback function and pass the id back to the parent component
    onButtonClick(item);
  };
  return (
    <Grid
      item
      className="background-cs-item"
      style={{
        padding: 5,
        width: `${width}%`,
        borderRadius: "5px",
        height: 220,
      }}
    >
      <img style={{ width: "95%", height: height }} src={image} alt="" />
      {/* <div>
        {st && `ST /`} {exterior} / {float}
      </div> */}
      <span className="text">{price}</span>
      {display && (
        <div>
          <Button
            onClick={() => handleButtonClick()}
            style={{
              backgroundColor: !add ? "#FFC107" : "#CD5C5C",
              width: "100%",
            }}
          >
            {!add ? <BsFillCartPlusFill /> : <BsFillCartXFill />}
          </Button>
        </div>
      )}
    </Grid>
  );
}
