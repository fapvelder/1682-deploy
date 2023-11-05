import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import "./balance.css";
import { Store } from "../../../../Store";

export default function Balance({ language, vi, en }) {
  const { state } = useContext(Store);
  const balance = state?.data?.wallet.toFixed(2);
  return (
    <Grid container className="pb-50">
      <Grid container>
        <div className="customContainer">
          <div>
            {language === "en"
              ? en.wallet.balance.your_balance
              : vi.wallet.balance.your_balance}
          </div>
          <div className="balanceContainer">
            <Grid container className="bd-bt">
              <Grid item xs={6} sm={6} md={6}>
                {language === "en"
                  ? en.wallet.balance.available
                  : vi.wallet.balance.available}
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                ${balance} USD
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6}>
                {language === "en"
                  ? en.wallet.balance.pending
                  : vi.wallet.balance.pending}
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                $0.00 USD
              </Grid>
            </Grid>
          </div>
        </div>
        {/* <div className="customContainer" style={{ marginTop: 20 }}>
          <div>Cash from completed sales</div>
          <div className="balanceContainer">
            <Grid container className="bd-bt">
              <Grid item xs={6} sm={6} md={6}>
                Available
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                ${balance} USD
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6}>
                Pending
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                $0.00 USD
              </Grid>
            </Grid>
          </div>
        </div> */}
      </Grid>
    </Grid>
  );
}
