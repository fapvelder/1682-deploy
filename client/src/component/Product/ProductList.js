import { Grid } from "@material-ui/core";
import { Card, Divider, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import "./ProductList.css";
import soldBanner from "../img/sold.png";
const { Title } = Typography;
export default function ProductList({ img, title, price, sold }) {
  return (
    // <Grid container>
    //   <Grid item xs={6} md={2} lg={2}>
    <div className="productCard">
      <Card
        className="backgroundProduct text-start"
        cover={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              height: 250,
              width: 250,
            }}
          >
            <img
              style={{
                width: 200,
                height: 200,
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              alt={title}
              src={img}
            />
            {sold && (
              <img
                src={soldBanner}
                style={{
                  width: 100,
                  height: 100,
                  position: "absolute",
                  top: -1,
                  left: -1,
                }}
                alt=""
              />
            )}
          </div>
        }
      />
      <div className="text-start">
        <div className="title-container">
          <p>{title}</p>
        </div>
        <Divider style={{ margin: 0, backgroundColor: "#ddd" }} />
        <p>${price} USD</p>
      </div>
    </div>
    //   </Grid>
    // </Grid>
  );
}
