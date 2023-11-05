import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import "./productDetails.css";
import { Button, Divider, Input } from "antd";
import img from "../../../component/img/movie.jpg";
import UserDetails from "../../../component/UserDetails";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import {
  createComment,
  getProductComments,
  getProductDetails,
  serverURL,
} from "../../../api";
import moment from "moment";
import { Store } from "../../../Store";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading.js";
import Loading from "../../../component/Loading/index.js";
import { io } from "socket.io-client";
import soldBanner from "../../../component/img/sold.png";
import vi from "../../../component/languages/vi.json";
import en from "../../../component/languages/en.json";
import SpecificDetails from "../../../component/SpecificDetails";
export default function ProductDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const language = state?.language || "en";
  const { loading, setLoading, reload, setReload } = useLoading();
  const [product, setProduct] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const userID = state?.data?._id;
  const id = params?.productID;

  useEffect(() => {
    const getDetails = async () => {
      const result = await getProductDetails(id);
      setProduct(result.data);
    };
    const getComments = async () => {
      const result = await getProductComments(id);
      setComments(result.data);
    };
    getComments();
    getDetails();
  }, [id, reload]);
  const handleComment = async () => {
    if (userID && id && comment) {
      handleLoading(
        async () => {
          await createComment(userID, id, comment);
          const socket = io(serverURL);
          socket.emit("send-notify", {
            userID: product?.listingBy?._id,
            type: "Comment",
            url: `/item/${id}`,
          });
          setComment("");
        },
        setLoading,
        setReload,
        "Comment successfully"
      );
    }
  };
  const handleBuy = () => {
    navigate(`/checkout/${id}`);
  };
  return (
    <Grid container className="pb-50">
      <Helmet>
        <title>{product?.title}</title>
      </Helmet>
      {loading && <Loading />}
      <Grid container className="generalContainer">
        <Grid item sm={6} md={6}>
          <div className="general">
            <Grid container className="text-start ml-15">
              <Grid item sm={12} md={12}>
                <p>{product.title}</p>
              </Grid>
              <Grid item sm={12} md={12}>
                <p>
                  {product?.category?.name} / {product?.platform?.name}
                </p>
              </Grid>
              <Divider />
            </Grid>
            <Grid container>
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <img
                  style={{
                    marginTop: 15,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={product?.photos?.[0]}
                  alt=""
                />
                {!product?.isAvailable && (
                  <img
                    src={soldBanner}
                    style={{
                      width: 200,
                      height: 200,
                      position: "absolute",
                      top: 15,
                      left: 0,
                    }}
                    alt=""
                  />
                )}
              </div>
            </Grid>
          </div>
        </Grid>
        <Grid item sm={6} md={6}>
          <div className="specific">
            <Grid container className="priceItem">
              <span>
                <p>{product?.category?.name}</p>
                <p>{moment(product?.createdAt).fromNow()}</p>
              </span>
              <span>${product?.price} USD</span>
            </Grid>
            <Grid container className="buyBtn">
              {product?.listingBy?._id !== state?.data?._id ? (
                product.isAvailable ? (
                  <Button className="defaultButton" onClick={() => handleBuy()}>
                    Buy
                  </Button>
                ) : (
                  <Button disabled>Sold</Button>
                )
              ) : product.isAvailable ? (
                <Button
                  className="defaultButton"
                  onClick={() => navigate(`/edit/${product._id}`)}
                >
                  Edit
                </Button>
              ) : (
                <Button disabled>Sold</Button>
              )}
            </Grid>
            <Grid container>
              {Array.isArray(product?.description) ? (
                product?.description?.map((item, index) => (
                  <div key={index} className="itemDesc text-start">
                    {item.value.split("\n").map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))}
                  </div>
                ))
              ) : (
                <div className="itemDesc text-start">{product.description}</div>
              )}
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

            <Grid container style={{ display: "flex", justifyContent: "end" }}>
              <Button className="defaultButton reportBtn">
                <i className="fas fa-flag" />
                &nbsp; Report
              </Button>
            </Grid>
            <Grid container>
              <div className="commentContainer text-start">
                <Grid container>Comments</Grid>
                <Grid container>
                  Caution: Comments are written by the marketplace users.
                  GameBay will never write comments on listings.
                </Grid>

                <Grid container>
                  {comments?.map((comment) => (
                    <div key={comment._id} className="listComments border">
                      <Grid container>
                        <Grid item xs={6} sm={6} md={3}>
                          <div
                            className="imageComment"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/profile/${comment.commenter.slug}`)
                            }
                          >
                            <img src={comment.commenter.avatar} alt="" />
                          </div>
                        </Grid>
                        <Grid item xs={6} sm={6} md={9}>
                          <div className="text-start">
                            <p
                              style={{ cursor: "pointer", color: "orange" }}
                              onClick={() =>
                                navigate(`/profile/${comment.commenter.slug}`)
                              }
                            >
                              {comment.commenter?.displayName ||
                                comment.commenter?.fullName}
                            </p>
                            <p>{comment.comment}</p>
                            <p>{moment(comment.createdAt).fromNow()}</p>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                  <div className="comment border">
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment"
                    />
                    <Button onClick={() => handleComment()}>Send</Button>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
