import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Button } from "antd";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading";
import Loading from "../../../component/Loading";
import { getUserByID, serverURL, withdrawItem } from "../../../api";
import { toast } from "react-toastify";
import { getError } from "../../../utils";
import { io } from "socket.io-client";
import { Helmet } from "react-helmet-async";

export default function InventoryPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [tradeOffer, setTradeOffer] = useState("");
  const { loading, setLoading, reload, setReload } = useLoading();
  useEffect(() => {
    const socket = io(serverURL);
    // Listen for the 'tradeOfferStatus' event
    socket.on("tradeOfferStatus", (data) => {
      if (data.messageSuccess) {
        toast.success(data.messageSuccess);
        setTradeOffer("");
      } else if (data.messageFailure) {
        toast.error(data.messageFailure);
        setTradeOffer("");
      }
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    const socket = io(serverURL);
    // Listen for the 'tradeOfferStatus' event
    socket.on("tradeOfferURL", (data) => {
      if (data.tradeOfferURL) {
        setTradeOffer(data.tradeOfferURL);
      }
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleWithdraw = async (item) => {
    const userID = state?.data?._id;
    handleLoading(
      async () => {
        await withdrawItem(
          userID,
          item.appid,
          item.contextid,
          item.classid,
          userID
        );
      },
      setLoading,
      setReload,
      "Trade offer has been sent"
    );
  };
  return (
    <Grid container className="mg-auto-80 pb-50 ">
      {loading && <Loading />}
      <Helmet>
        <title>Steam Inventory</title>
      </Helmet>
      <Grid container style={{ gridGap: 30 }} className="mt-15">
        {state?.data?.itemHeld?.map((item) => (
          <Grid item md={2} key={item.assetid}>
            <img
              src={`https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}`}
              alt={item.name}
            />
            <Button onClick={() => handleWithdraw(item)}>Withdraw</Button>
          </Grid>
        ))}
        {tradeOffer && (
          <Button onClick={() => window.open(tradeOffer)}>
            Open trade offer
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
