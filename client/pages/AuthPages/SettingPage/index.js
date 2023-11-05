import { Grid } from "@material-ui/core";
import { Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import Account from "./SettingChildren/Account";
import Payment from "./SettingChildren/Payment";
import { Store } from "../../../Store";
import { Helmet } from "react-helmet-async";
import "./settings.css";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
export default function Setting() {
  const { state } = useContext(Store);
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.warn) {
      toast.warn(
        "You must sign in via Steam before selling or purchasing Steam Items",
        {
          toastId: location?.key,
        }
      );
    }
  }, [location?.state?.warn, location?.key]);
  const user = state?.data;
  const items = [
    {
      key: "1",
      label: `Account`,
      children: <Account user={user} />,
    },
    // {
    //   key: "2",
    //   label: `Payment`,
    //   children: <Payment />,
    // },
  ];
  return (
    <Grid container>
      <div
        // style={{
        //   width: "80%",
        //   marginTop: 150,
        //   margin: "auto",
        // }}
        className="mg-auto-80 pb-50 settings"
        // className="pb-50"
      >
        <Helmet>
          <title>Settings</title>
        </Helmet>
        {/* <div className="mg" /> */}
        <h2>Settings</h2>
        <Tabs defaultActiveKey="1" items={items} className="tab" />
      </div>
    </Grid>
  );
}
