import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import vi from "../languages/vi.json";
import en from "../languages/en.json";
import { Store } from "../../Store";
export default function SpecificDetails({ product }) {
  const { state } = useContext(Store);
  const language = state?.language || "en";
  return (
    <Grid container>
      <div className="specificDetails text-start border">
        <Grid container className=" detailsRow">
          <Grid item xs={6} sm={6} md={4}>
            {language === "en" ? en.specific.category : vi.specific.category}
          </Grid>
          <Grid item xs={6} sm={6} md={8}>
            {product?.category?.name}
          </Grid>
        </Grid>
        <Grid container className="detailsRow">
          <Grid item xs={6} sm={6} md={4}>
            {language === "en"
              ? en.specific.sub_category
              : vi.specific.sub_category}
          </Grid>
          <Grid item xs={6} sm={6} md={8}>
            {product?.gameTitle}
          </Grid>
        </Grid>

        <Grid container className="detailsRow">
          <Grid item xs={6} sm={6} md={4}>
            {language === "en"
              ? en.specific.delivery_method
              : vi.specific.delivery_method}
          </Grid>
          <Grid item xs={6} sm={6} md={8}>
            {product?.deliveryIn}{" "}
            {language === "en" ? en.specific.day : vi.specific.day}
          </Grid>
        </Grid>
        <Grid container className="detailsRow">
          <Grid item xs={6} sm={6} md={4}>
            {language === "en" ? en.specific.region : vi.specific.region}
          </Grid>
          <Grid item xs={6} sm={6} md={8}>
            Global
          </Grid>
        </Grid>
        <Grid container className="detailsRow">
          <Grid item xs={6} sm={6} md={4}>
            {language === "en" ? en.specific.returns : vi.specific.returns}
          </Grid>
          <Grid item xs={6} sm={6} md={8}>
            {language === "en" ? en.specific.no_return : vi.specific.no_return}
          </Grid>
        </Grid>
        <Grid container className="detailsRow">
          <Grid item xs={6} sm={6} md={4}>
            {language === "en" ? en.specific.accept : vi.specific.accept}
          </Grid>
          <Grid item xs={6} sm={6} md={8}>
            USD
          </Grid>
        </Grid>
        <Grid container className="detailsRow">
          <Grid item xs={6} sm={6} md={4}>
            {language === "en"
              ? en.specific.protection
              : vi.specific.protection}
          </Grid>
          <Grid item xs={6} sm={6} md={8}>
            {language === "en" ? en.specific.desc : vi.specific.desc}
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
