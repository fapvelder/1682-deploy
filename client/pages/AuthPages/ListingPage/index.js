import React, { useContext, useEffect, useState } from "react";
import { getMyProducts, getOrders } from "../../../api";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "./listingPage.css";
import completed from "../../../component/img/completed.png";
import soldBanner from "../../../component/img/sold.png";
import vi from "../../../component/languages/vi.json";
import en from "../../../component/languages/en.json";
import { Tabs } from "antd";

const { TabPane } = Tabs;

export default function ListingsPage() {
  const { state } = useContext(Store);
  const language = state?.language || "en";
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [products, setProducts] = useState([]);
  const allStatus = {
    All: { vi: "Tất cả", en: "All" },
    Completed: { vi: "Hoàn tất", en: "Completed" },
    Sold: { vi: "Đã bán", en: "Sold" },
    "On Sale": { vi: "Đang bán", en: "On Sale" },
  };
  const [selectedStatus, setSelectedStatus] = useState("All"); // Default selected status
  const statusOptions = ["All", "Completed", "Sold", "On Sale"];

  useEffect(() => {
    const getAllOrders = async () => {
      const result = await getOrders();
      setListings(
        result?.data?.filter(
          (listing) => listing?.seller._id === state?.data?._id
        )
      );
    };
    getAllOrders();
  }, [state?.data?._id]);

  useEffect(() => {
    const getAllProducts = async () => {
      const result = await getMyProducts(state?.data?._id);
      setProducts(result.data);
    };
    getAllProducts();
  }, [state?.data?._id]);

  const handleStatusChange = (key) => {
    setSelectedStatus(key);
  };

  const filteredProducts =
    selectedStatus === "All"
      ? products
      : products.filter((product) => product.status === selectedStatus);

  const colorStatus = {
    "On Sale": "orange",
    Sold: "blue",
    Completed: "green",
  };
  return (
    <Grid container className="mg-auto-80" style={{ paddingBottom: "50vh" }}>
      <Helmet>
        <title>
          {language === "en" ? en.listings.title : vi.listings.title}
        </title>
      </Helmet>
      <Grid container className="border mt-15" style={{ padding: 20 }}>
        <Tabs
          style={{ width: "100%" }}
          activeKey={selectedStatus}
          onChange={handleStatusChange}
        >
          {statusOptions.map((status, index) => (
            <TabPane
              tab={allStatus[status][language]}
              key={allStatus[status]["en"]}
            />
          ))}
        </Tabs>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const listing = listings.find(
              (listing) => listing.product._id === product._id
            );

            return (
              <Grid
                container
                className="border"
                style={{ padding: "10px 0 10px 50px" }}
                key={product._id}
              >
                <div
                  className="backgroundProduct-100"
                  style={{
                    marginRight: 10,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      listing?.status === "Completed" ||
                        listing?.status === "Pending"
                        ? `/order-details/${listing._id}`
                        : `/item/${product._id}`
                    )
                  }
                >
                  <img
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    src={product.photos[0]}
                    alt=""
                  />

                  {product.status === "Completed" && (
                    <img
                      src={completed}
                      style={{
                        width: 80,
                        height: 80,
                        position: "absolute",
                        top: -5,
                        left: -5,
                      }}
                      alt=""
                    />
                  )}
                  {product.status === "Sold" && (
                    <img
                      src={soldBanner}
                      style={{
                        width: 80,
                        height: 80,
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                      alt=""
                    />
                  )}
                </div>
                <div className="text-start" style={{ marginRight: 50 }}>
                  <div>
                    <div>{product.title}</div>
                    <div style={{ color: colorStatus[product.status] }}>
                      {allStatus[product.status][language]}
                    </div>
                    <div>${product.price} USD</div>
                    <div>
                      {language === "en"
                        ? en.listings.bought
                        : vi.listings.bought}{" "}
                      {moment(product.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
                {listing && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {language === "en"
                        ? en.listings.sold_by
                        : vi.listings.sold_by}
                      :
                    </span>
                    <p
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        margin: "0",
                      }}
                    >
                      {product.listingBy.displayName ||
                        product.listingBy.fullName}
                    </p>
                  </div>
                )}
              </Grid>
            );
          })
        ) : (
          <Grid container>
            {language === "en"
              ? en.listings.no_products
              : vi.listings.no_products}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
