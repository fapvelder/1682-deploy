import React, { useContext, useEffect } from "react";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import Balance from "./WalletChildren/Balance.js";
import AddFunds from "./WalletChildren/AddFunds.js";
import Withdraw from "./WalletChildren/Withdraw.js";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import en from "../../../component/languages/en.json";
import vi from "../../../component/languages/vi.json";
export default function Wallet() {
  const { state } = useContext(Store);
  const language = state?.language || "en";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("vnp_TransactionStatus");
    if (status === "00") {
      toast.success("Successfully", { toastId: "Successfully" });
    } else if (status === "01") {
      toast.warn("Processing", {
        toastId: "Processing",
      });
    } else if (status === "02") {
      toast.error("Failed", { toastId: "Failed" });
    }
  }, []);
  const items = [
    {
      key: "1",
      label:
        language === "en" ? en.wallet.balance.title : vi.wallet.balance.title,
      children: <Balance language={language} vi={vi} en={en} />,
    },
    {
      key: "2",
      label:
        language === "en"
          ? en.wallet.add_funds.title
          : vi.wallet.add_funds.title,
      children: <AddFunds language={language} vi={vi} en={en} />,
    },
    {
      key: "3",
      label:
        language === "en" ? en.wallet.withdraw.title : vi.wallet.withdraw.title,
      children: <Withdraw language={language} vi={vi} en={en} />,
    },
  ];
  return (
    <Grid container className="pb-50">
      <Helmet>
        <title>Wallet</title>
      </Helmet>
      <div className="mg-auto-80 custom-80 mt-15">
        <Tabs defaultActiveKey="1" items={items} className="tab" />
      </div>
    </Grid>
  );
}
