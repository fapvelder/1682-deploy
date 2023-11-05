import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelOrder,
  completeOrder,
  feedbackOrder,
  getOrderDetails,
  getOrderItem,
  serverURL,
  transferItem,
  withdrawItem,
} from "../../../api";
import { Button, Checkbox, Input, Modal, Radio } from "antd";
import moment from "moment";
import { Store } from "../../../Store";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading";
import { io } from "socket.io-client";
import TextArea from "antd/es/input/TextArea";
import good from "../../../component/img/good.png";
import neutral from "../../../component/img/neutral.png";
import bad from "../../../component/img/bad.png";
import check from "../../../component/img/check.png";
import pending from "../../../component/img/pending.png";
import cancelled from "../../../component/img/cancelled.png";
import { Helmet } from "react-helmet-async";
import { Statistic } from "antd";
import SpecificDetails from "../../../component/SpecificDetails";
import vi from "../../../component/languages/vi.json";
import en from "../../../component/languages/en.json";
const { Countdown } = Statistic;
export default function OrderDetailsPage() {
  const { id } = useParams();
  const { state } = useContext(Store);
  const language = state?.language || "en";
  const { loading, setLoading, reload, setReload } = useLoading();
  const navigate = useNavigate();
  const [order, setOrder] = useState("");
  const [feedback, setFeedback] = useState("");
  const [code, setCode] = useState("");
  const [tradeOffer, setTradeOffer] = useState("");
  const [rating, setRating] = useState("");
  const [ratingText, setRatingText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const presentTime = Date.now();
  const deliveryTime =
    new Date(order?.createdAt).getTime() +
    24 * 1000 * order?.product?.deliveryIn;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCode("");
  };
  const feedbackRating = [
    {
      rating: "Good",
      src: good,
      ratingText: "Thank you for your positive feedback!",
    },
    {
      rating: "Neutral",
      src: neutral,
      ratingText: "Thank you for your feedback.",
    },
    {
      rating: "Bad",
      src: bad,
      ratingText:
        "We apologize for any inconvenience. Please provide more details about your experience.",
    },
  ];
  useEffect(() => {
    const getOrder = async () => {
      const result = await getOrderDetails(id);
      setOrder(result.data);
    };
    getOrder();
  }, [id, reload]);

  useEffect(() => {
    const socket = io(serverURL);
    socket.on("tradeOfferURL", (data) => {
      console.log(data);
      if (data.tradeOfferURL) {
        window.open(data.tradeOfferURL);
      }
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure to cancel the order?")) {
      const orderID = order?._id;
      const userID = state?.data?._id;
      handleLoading(
        async () => {
          await cancelOrder(orderID, userID);
          const socket = io(serverURL);
          socket.emit("send-notify", {
            userID: order?.seller?._id,
            type: "Cancel",
            url: `/order-details/${orderID}`,
          });
        },
        setLoading,
        setReload,
        "Order is cancelled"
      );
    }
  };
  const handleCompleteOrder = async () => {
    const orderID = order?._id;
    const userID = state?.data?._id;
    if (window.confirm("Are you sure to complete the order?")) {
      handleLoading(
        async () => {
          await completeOrder(orderID, userID);
          const socket = io(serverURL);
          socket.emit("send-notify", {
            userID: order?.seller?._id,
            type: "Complete",
            url: `/order-details/${orderID}`,
          });
        },
        setLoading,
        setReload,
        "Order is completed"
      );
    }
  };
  const handleTrade = async () => {
    const orderID = order?._id;
    const userID = order?.seller?._id;
    const receiverID = order?.buyer?._id;
    const appID = order?.product?.item?.appid;
    const version = order?.product?.item?.contextid;
    const classID = order?.product?.item?.classID;
    handleLoading(
      async () => {
        await getOrderItem(
          orderID,
          userID,
          receiverID,
          appID,
          version,
          classID
        );
      },
      setLoading,
      setReload,
      "Trade offer has been accepted"
    );
  };
  const handleFeedback = () => {
    const orderID = order?._id;
    const userID = state?.data?._id;

    handleLoading(
      async () => {
        await feedbackOrder(orderID, feedback, rating);
        const socket = io(serverURL);
        socket.emit("send-notify", {
          userID: order?.seller?._id,
          type: "Feedback",
          url: `/order-details/${orderID}`,
        });
      },
      setLoading,
      setReload,
      "Your feedback has been sent"
    );
  };
  const handleSendItem = async () => {
    const orderID = order?._id;
    const userID = state?.data?._id;
    handleLoading(
      async () => {
        await transferItem(
          userID,
          orderID,
          order?.product?.category?.name !== "Game Items" ? code : ""
        );
      },
      setLoading,
      setReload,
      "You have sent item successfully"
    );
  };
  return (
    <Grid container className="pb-50" style={{ padding: 10 }}>
      <Helmet>
        <title>
          {language === "en" ? en.order_details.title : vi.order_details.title}
        </title>
      </Helmet>
      <Grid container>
        <Grid item xs={12} sm={6} md={6} style={{ paddingRight: 10 }}>
          <Grid container className="border" style={{ padding: 10 }}>
            <Grid item xs={6} sm={6} md={4}>
              <img
                style={{ width: 150, height: 150 }}
                src={order?.product?.photos?.[0]}
                alt=""
              />
            </Grid>
            <Grid item xs={6} sm={6} md={8} className="text-start">
              <p>{order?.product?.title}</p>
              <img
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/profile/${order?.seller?.slug}`)}
                src={order?.seller?.avatar}
                alt=""
              />
              <span style={{ margin: "0px 10px" }}>
                {language === "en"
                  ? en.order_details.sold
                  : vi.order_details.sold}
              </span>
              <span
                style={{
                  color: "blue",
                  cursor: "pointer",
                  margin: "0",
                }}
                onClick={() => navigate(`/profile/${order?.seller?.slug}`)}
              >
                {order?.seller?.displayName || order?.seller?.fullName}
              </span>
            </Grid>
          </Grid>
          <SpecificDetails product={order?.product} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          className="border "
          style={{ position: "relative" }}
        >
          <Grid container style={{ height: 150, padding: 20 }}>
            <Grid item xs={6} sm={6} md={4}>
              <img
                src={
                  order?.status === "Completed"
                    ? check
                    : order?.status === "Cancelled"
                    ? cancelled
                    : order?.status === "Pending" && pending
                }
                alt=""
                style={{ width: "150px", height: "150px" }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={8}
              className="text-start"
              style={{ fontSize: 22 }}
            >
              {language === "en"
                ? en.order_details.transaction
                : vi.order_details.transaction}{" "}
              {order?.status}
            </Grid>
          </Grid>
          {order?.product?.deliveryMethod === "Bot" ? (
            <Grid container style={{ padding: 20, marginTop: 15 }}>
              <Grid item xs={12} sm={12} md={12} className="text-start">
                <h3>
                  {language === "en"
                    ? en.order_details.start
                    : vi.order_details.start}
                </h3>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {!order?.isBotSent ? (
                  <Button
                    style={{ height: 50 }}
                    onClick={() => handleTrade()}
                    className="defaultButton"
                  >
                    {language === "en"
                      ? en.order_details.click
                      : vi.order_details.click}
                  </Button>
                ) : (
                  <div style={{ height: 50 }}>
                    {language === "en"
                      ? en.order_details.accepted
                      : vi.order_details.accepted}
                  </div>
                )}
              </Grid>
            </Grid>
          ) : order?.product?.deliveryMethod === "Auto" ? (
            <Grid container style={{ padding: 20, marginTop: 15 }}>
              <Grid item xs={12} sm={12} md={12} className="text-start">
                <h3>
                  {language === "en"
                    ? en.order_details.code
                    : vi.order_details.code}
                </h3>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                className="border"
                style={{ padding: 10 }}
              >
                {order?.product?.digitalCode}
              </Grid>
            </Grid>
          ) : (
            order?.product?.deliveryMethod === "Transfer" &&
            (!order.isTransfer ? (
              <Grid container style={{ padding: 20, marginTop: 15 }}>
                {order.product.category.name === "Game Items" &&
                  order?.buyer?.profile?.steam?.steamTradeURL && (
                    <Grid item xs={12} sm={12} md={12} className="text-start">
                      <h3>
                        {language === "en"
                          ? en.order_details.trade_offer
                          : vi.order_details.trade_offer}
                      </h3>

                      <Input value={order.buyer.profile.steam.steamTradeURL} />
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        <Button
                          className="defaultButton mt-15"
                          onClick={() =>
                            window.open(order.buyer.profile.steam.steamTradeURL)
                          }
                        >
                          {language === "en"
                            ? en.order_details.open
                            : vi.order_details.open}
                        </Button>
                      </div>
                    </Grid>
                  )}
                <Grid item xs={12} sm={12} md={12} className="text-start">
                  <h3>
                    {language === "en"
                      ? en.order_details.wait
                      : vi.order_details.wait}
                  </h3>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Countdown
                    title={
                      language === "en"
                        ? en.order_details.must
                        : vi.order_details.must
                    }
                    value={
                      new Date(order?.createdAt).getTime() +
                      24 * 60 * 60 * 1000 * order?.product?.deliveryIn
                    }
                  />

                  {order?.seller?._id === state?.data?._id &&
                  order?.product?.category.name === "Game Items" ? (
                    <Button
                      className="defaultButton"
                      onClick={() => handleSendItem()}
                    >
                      {language === "en"
                        ? en.order_details.have_sent
                        : vi.order_details.have_sent}{" "}
                    </Button>
                  ) : (
                    order?.seller?._id === state?.data?._id &&
                    order?.product?.category.name !== "Game Items" && (
                      <Button
                        className="defaultButton"
                        onClick={() => showModal()}
                        // onClick={() => handleSendItem()}
                      >
                        {language === "en"
                          ? en.order_details.send_code
                          : vi.order_details.send_code}
                      </Button>
                    )
                  )}
                </Grid>
              </Grid>
            ) : (
              <Grid container style={{ padding: 20, marginTop: 15 }}>
                <Grid item xs={12} sm={12} md={12} className="text-start">
                  <h3>
                    {language === "en"
                      ? en.order_details.seller_sent
                      : vi.order_details.seller_sent}
                  </h3>
                </Grid>
                {order?.product?.category?.name !== "Game Items" ? (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    className="border"
                    style={{ padding: 10 }}
                  >
                    {order?.product?.digitalCode}
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    className="border"
                    style={{ padding: 10 }}
                  >
                    {language === "en"
                      ? en.order_details.check
                      : vi.order_details.check}
                  </Grid>
                )}
              </Grid>
            ))
          )}
          <Grid container style={{ padding: 20 }}>
            <h3>
              {language === "en"
                ? en.order_details.title
                : vi.order_details.title}
            </h3>
          </Grid>
          <Grid container style={{ padding: 20 }}>
            <Grid item xs={12} sm={12} md={12} className="border text-start">
              <Grid
                container
                className="detailsRow"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>
                  {language === "en"
                    ? en.order_details.order
                    : vi.order_details.order}
                </div>
                <div>{order?._id}</div>
              </Grid>
              <Grid
                container
                className="detailsRow"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>Date</div>
                <div>{moment(order?.createdAt).fromNow()}</div>
              </Grid>
              <Grid
                container
                className="detailsRow"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>
                  {language === "en"
                    ? en.order_details.price
                    : vi.order_details.price}
                </div>
                <div>{order?.product?.price}</div>
              </Grid>
            </Grid>
          </Grid>
          {order?.status === "Completed" && !order.isFeedback && (
            <Grid container style={{ padding: 20 }}>
              <Grid
                container
                style={{ display: "flex", justifyContent: "center" }}
              >
                <p>
                  {language === "en"
                    ? en.order_details.rating
                    : vi.order_details.rating}
                </p>
              </Grid>
              <Grid
                container
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                {feedbackRating?.map((fb) => (
                  <div
                    onClick={() => {
                      setRatingText(fb.ratingText);
                      setRating(fb.rating);
                    }}
                  >
                    <img
                      style={{ width: 50, height: 50 }}
                      src={fb.src}
                      alt={fb.rating}
                    />
                  </div>
                ))}
                {ratingText && (
                  <Grid
                    container
                    className="mt-15"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <p>{ratingText}</p>
                  </Grid>
                )}
              </Grid>
              <Grid container className="mt-15">
                <p>
                  {language === "en"
                    ? en.order_details.feedback
                    : vi.order_details.feedback}
                </p>
              </Grid>
              <TextArea
                autoSize={{ minRows: 5, maxRows: 5 }}
                onChange={(e) => setFeedback(e.target.value)}
                value={feedback}
                placeholder={
                  language === "en"
                    ? en.order_details.optional
                    : vi.order_details.optional
                }
              />

              <Grid
                container
                style={{ display: "flex", justifyContent: "end" }}
              >
                <Button
                  disabled={rating === ""}
                  className="defaultButton mt-15"
                  onClick={() => handleFeedback()}
                >
                  {language === "en"
                    ? en.order_details.send_feedback
                    : vi.order_details.send_feedback}
                </Button>
              </Grid>
            </Grid>
          )}
          {order?.status !== "Completed" &&
            state?.data?._id === order?.buyer?._id &&
            (presentTime >= deliveryTime ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <Button
                  className="defaultButton"
                  onClick={() => handleCancelOrder()}
                >
                  {language === "en"
                    ? en.order_details.cancel
                    : vi.order_details.cancel}
                </Button>
                <Button
                  className="defaultButton"
                  onClick={() => handleCompleteOrder()}
                >
                  {language === "en"
                    ? en.order_details.complete
                    : vi.order_details.complete}
                </Button>
              </div>
            ) : (
              <div
                style={{ display: "flex", justifyContent: "end", padding: 20 }}
              >
                <Button
                  className="defaultButton"
                  onClick={() => handleCompleteOrder()}
                >
                  {language === "en"
                    ? en.order_details.complete
                    : vi.order_details.complete}
                </Button>
              </div>
            ))}
        </Grid>
      </Grid>
      <Modal
        title={
          language === "en"
            ? en.order_details.send_code
            : vi.order_details.send_code
        }
        open={isModalOpen}
        onOk={() => handleSendItem()}
        onCancel={handleCancel}
      >
        <Input value={code} onChange={(e) => setCode(e.target.value)} />
      </Modal>
    </Grid>
  );
}
