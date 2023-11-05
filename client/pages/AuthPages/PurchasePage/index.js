import React, { useContext, useEffect, useState } from "react";
import { getOrders } from "../../../api";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import completed from "../../../component/img/completed.png";
import { Tabs } from "antd";
import vi from "../../../component/languages/vi.json";
import en from "../../../component/languages/en.json";
const { TabPane } = Tabs;

export default function PurchasePage() {
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const language = state?.language || "en";
  const [purchases, setPurchases] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const allStatus = {
    All: { vi: "Tất cả", en: "All" },
    Completed: { vi: "Hoàn tất", en: "Completed" },
    Pending: { vi: "Đang chờ", en: "Pending" },
    Cancelled: { vi: "Đã hủy", en: "Cancelled" },
  };
  const statusOptions = ["All", "Completed", "Pending", "Cancelled"];

  useEffect(() => {
    const getAllOrders = async () => {
      const result = await getOrders();
      setPurchases(
        result?.data?.filter(
          (purchase) => purchase?.buyer._id === state?.data?._id
        )
      );
    };
    getAllOrders();
  }, [state?.data?._id]);

  const handleTabChange = (key) => {
    setSelectedStatus(key);
  };

  const filteredPurchases =
    selectedStatus === "All"
      ? purchases
      : purchases.filter((purchase) => purchase.status === selectedStatus);

  const colorStatus = {
    Pending: "orange",
    Cancelled: "black",
    Completed: "green",
  };
  return (
    <Grid container className="mg-auto-80" style={{ paddingBottom: "50vh" }}>
      <Helmet>
        <title>
          {language === "en" ? en.purchases.title : vi.purchases.title}
        </title>
      </Helmet>
      <Grid container className="border mt-15" style={{ padding: 20 }}>
        <Tabs
          style={{ width: "100%" }}
          activeKey={selectedStatus}
          onChange={handleTabChange}
        >
          {statusOptions.map((status, index) => (
            <TabPane
              tab={allStatus[status][language]}
              key={allStatus[status]["en"]}
            />
          ))}
        </Tabs>
        {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <Grid
              container
              className="border"
              style={{ padding: "10px 0 10px 50px" }}
              key={purchase._id}
            >
              <div
                className="backgroundProduct-100"
                style={{
                  marginRight: 10,
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => navigate(`/order-details/${purchase._id}`)}
              >
                <img
                  style={{ width: 100, height: 100 }}
                  src={purchase.product.photos[0]}
                  alt=""
                />
                {purchase.status === "Completed" && (
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
              </div>
              <div className="text-start" style={{ marginRight: 50 }}>
                <div>
                  <div>{purchase?.product?.title}</div>
                  <div style={{ color: colorStatus[purchase?.status] }}>
                    {allStatus[purchase?.status][language]}
                  </div>
                  <div>${purchase?.product?.price} USD</div>
                  <div>
                    {language === "en"
                      ? en.purchases.bought
                      : vi.purchases.bought}{" "}
                    {moment(purchase?.createdAt).fromNow()}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => navigate(`/profile/${purchase.seller.slug}`)}
              >
                <span style={{ marginRight: "5px" }}>
                  {language === "en"
                    ? en.purchases.sold_by
                    : vi.purchases.sold_by}
                  :
                </span>
                <p
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    margin: "0",
                  }}
                >
                  {purchase.seller.displayName || purchase.seller.fullName}
                </p>
              </div>
            </Grid>
          ))
        ) : (
          <div>
            {language === "en"
              ? en.purchases.no_purchases
              : vi.purchases.no_purchases}
          </div>
        )}
      </Grid>
    </Grid>
  );
}
