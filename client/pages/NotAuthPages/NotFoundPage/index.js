import { Grid } from "@material-ui/core";
import React from "react";
import Search from "../../../component/Search";

export default function NotFoundPage() {
  return (
    <Grid container style={{ paddingBottom: "50vh" }}>
      <Grid container style={{ marginTop: 15 }}>
        <Grid item md={12} style={{ marginTop: 15 }}>
          <h2>Sorry this page is not available</h2>
          <h4>
            The page is not found or may have been removed. Try searching for
            something else
          </h4>
        </Grid>
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 15,
            padding: 10,
          }}
        >
          <div>
            <Search placeholder={"Search..."} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
