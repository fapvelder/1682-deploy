import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { getProductDetails, placeOrder, serverURL } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import UserDetails from "../../../component/UserDetails";
import { Store } from "../../../Store";
import { Button } from "antd";
import "./checkout.css";
import useLoading from "../../../component/HandleLoading/useLoading";
import Loading from "../../../component/Loading";
import { toast } from "react-toastify";
import handleLoading from "../../../component/HandleLoading";
import io from "socket.io-client";
import vi from "../../../component/languages/vi.json";
import en from "../../../component/languages/en.json";
import SpecificDetails from "../../../component/SpecificDetails";
export default function CheckoutPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const language = state?.language || "en";
  const [product, setProduct] = useState("");
  const id = params?.id;
  const userID = state?.data?._id;
  const { loading, setLoading, reload, setReload } = useLoading();
  useEffect(() => {
    const getDetails = async () => {
      const result = await getProductDetails(id);
      setProduct(result.data);
    };
    getDetails();
  }, [id]);
  useEffect(() => {
    if (!state?.data?.profile?.steam?.steamTradeURL === "") {
      navigate("/settings", { state: { warn: "steam" } });
    }
  }, [state?.data?.profile?.steam?.steamTradeURL, navigate, product]);
  const placeOrderProduct = () => {
    if (userID !== product?.listingBy?._id) {
      if (window.confirm("Are you sure to place the order?")) {
        handleLoading(
          async () => {
            const socket = io(serverURL);
            const result = await placeOrder(userID, product?._id);
            navigate(`/order-details/${result.data._id}`);
            socket.emit("send-notify", {
              userID: product?.listingBy?._id,
              type: "Purchase",
              url: `/order-details/${result.data._id}`,
            });
          },
          setLoading,
          setReload,
          "Place order successfully"
        );
      }
    } else {
      toast.error("Cannot place order your own product");
    }
  };
  return (
    <Grid container style={{ padding: 10 }}>
      <Helmet>
        <title>
          {" "}
          {language === "en"
            ? en.checkout.title + product?.title
            : vi.checkout.title + product?.title}
        </title>
      </Helmet>
      {loading && <Loading />}

      <Grid item xs={12} sm={6} md={6}>
        <h3>{language === "en" ? en.checkout.title : vi.checkout.title}</h3>
        <Grid container className="border">
          <Grid
            item
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <div className="background-item">
              <img
                style={{ width: 170, height: 170 }}
                src={product?.photos?.[0]}
                alt=""
              />
            </div>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="text-start">
              <p>{product?.title}</p>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <UserDetails
            currentChatUser={product?.listingBy}
            contact={
              product?.listingBy?._id === state?.data?._id ? false : true
            }
            width={"100%"}
          />
        </Grid>
        <SpecificDetails product={product} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} style={{ paddingLeft: 10 }}>
        <h3>{language === "en" ? en.checkout.order : vi.checkout.order}</h3>
        <Grid container className="border" style={{ padding: 10 }}>
          <h6>{language === "en" ? en.checkout.wallet : vi.checkout.wallet}</h6>
          <Grid
            container
            className="border"
            style={{
              padding: 10,
            }}
          >
            <Grid item md={2}>
              {language === "en"
                ? en.checkout.cash_balance
                : vi.checkout.cash_balance}
            </Grid>
            <Grid
              item
              md={10}
              style={{ display: "flex", justifyContent: "end" }}
            >
              {state?.data?.wallet.toFixed(2)}
            </Grid>
          </Grid>
          <h6 className="mt-15">
            {language === "en" ? en.checkout.order : vi.checkout.order}
          </h6>
          <Grid container className="border text-start">
            <Grid
              container
              className="detailsRow"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Grid item md={11}>
                {language === "en" ? en.checkout.price : vi.checkout.price}
              </Grid>
              <Grid item md={1}>
                {product?.price}
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Grid item md={10}>
                {language === "en"
                  ? en.checkout.after_purchasing
                  : vi.checkout.after_purchasing}
              </Grid>
              <Grid item md={1}>
                {state?.data?.wallet.toFixed(2) - product?.price}
              </Grid>
            </Grid>
          </Grid>
          <Grid container className="mt-15">
            <div className="placeOrderBtn ">
              <Button
                className="defaultButton"
                onClick={() => placeOrderProduct()}
              >
                {language === "en"
                  ? en.checkout.place_order
                  : vi.checkout.place_order}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
