import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Store } from "../../../Store";
import { Button, Input } from "antd";
import {
  deleteNotification,
  getNotifications,
  sendNotification,
  serverURL,
} from "../../../api";
import { Grid } from "@material-ui/core";
import moment from "moment";
import chat from "../../../component/img/chat.png";
import deleteImg from "../../../component/img/delete.png";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading";
import Loading from "../../../component/Loading";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
export default function NotificationsPage() {
  const { loading, setLoading, reload, setReload } = useLoading();
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const userID = state?.data?._id;
  const language = state?.language || "en";
  useEffect(() => {
    const socket = io(serverURL);
    const getUserNotifications = async () => {
      const result = await getNotifications(userID);
      setNotifications(result.data);
      console.log(result.data);
    };
    getUserNotifications();

    return () => {
      socket.disconnect();
    };
  }, [userID, reload]);

  useEffect(() => {
    const socket = io(serverURL);
    socket.on("receive-notify", (newNotification) => {
      if (newNotification?.userID === userID) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
        console.log(newNotification);
      }
    });
  }, [userID]);
  const handleDelete = (id) => {
    handleLoading(
      async () => {
        await deleteNotification(id);
      },
      setLoading,
      setReload,
      "Delete notification successfully"
    );
  };
  return (
    <Grid
      container
      className="mg-auto-80 pb-50"
      style={{ paddingBottom: "50vh" }}
    >
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      {loading && <Loading />}
      <h2>Notifications</h2>

      <Grid container>
        {notifications
          ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((notification) => (
            <Grid
              container
              key={notification?._id}
              className="text-start border"
              style={{ padding: "20px 20px" }}
              onClick={() => navigate(notification?.url)}
            >
              <Grid item xs={2} sm={1} md={1}>
                <img
                  src={chat}
                  style={{ width: 25, height: 25 }}
                  alt="comment"
                />
              </Grid>
              <Grid item xs={9} sm={10} md={10}>
                {notification?.message[language]}
              </Grid>
              <Grid
                item
                xs={1}
                sm={1}
                md={1}
                onClick={() => handleDelete(notification?._id)}
              >
                <img
                  src={deleteImg}
                  style={{ width: 35, height: 25 }}
                  alt="comment"
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1} />
              <Grid item xs={11} sm={11} md={11}>
                {moment(notification?.createdAt).fromNow()}
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}
