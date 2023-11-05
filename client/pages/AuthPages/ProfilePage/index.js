import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserBySlug, getUserFeedback } from "../../../api";
import { Grid } from "@material-ui/core";
import banner from "../../../component/img/banner.png";
import "./profile.css";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import Listings from "./ProfileChildren/Listings";
import Ratings from "./ProfileChildren/Ratings";
import moment from "moment";
import { Store } from "../../../Store";
import useLoading from "../../../component/HandleLoading/useLoading";
import handleLoading from "../../../component/HandleLoading";
import Loading from "../../../component/Loading";
import Responsive from "../../../component/ResponsiveCode/Responsive";

export default function Profile() {
  const { loading, setLoading, reload, setReload } = useLoading();
  const { state } = useContext(Store);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      const result = await getUserBySlug(slug);
      setUser(result.data);
    };
    getUser();
  }, [slug]);

  const items = [
    {
      key: 1,
      label: `Listings`,
      children: (
        <Listings
          slug={slug}
          loading={loading}
          setLoading={setLoading}
          reload={reload}
          setReload={setReload}
          handleLoading={handleLoading}
          Loading={Loading}
        />
      ),
    },
    {
      key: 2,
      label: `Ratings`,
      children: (
        <Ratings
          slug={slug}
          loading={loading}
          setLoading={setLoading}
          reload={reload}
          setReload={setReload}
          handleLoading={handleLoading}
          Loading={Loading}
        />
      ),
    },
  ];
  const { mobile } = Responsive();

  return (
    <Grid container className="pb-50">
      <Helmet>
        <title>{user?.displayName || user?.fullName}</title>
      </Helmet>
      <Grid container>
        <div className="coverPhoto">
          <img src={banner} style={{ width: "100vw" }} alt="" />
        </div>
      </Grid>
      <Grid container>
        <Grid item xs={6} sm={6} md={4}>
          <div className="avatar">
            <img
              style={{ width: mobile ? 100 : 250, height: mobile ? 100 : 250 }}
              src={user?.avatar}
              alt={user?.fullName}
            />
          </div>
        </Grid>
        <Grid item xs={6} sm={6} md={8}>
          <div className="details">
            <div className="profileDetails">
              {user?.displayName || user?.fullName}
            </div>
            <p>
              Member since {moment(user?.since).format("MMM YYYY")}
              {"    "}
              {user?._id === state?.data?._id ? (
                <i
                  className="fas fa-pen"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/settings`)}
                />
              ) : (
                <i
                  className="fas fa-comments"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/chat/${user?.slug}`)}
                />
              )}
            </p>
            <p>About</p>
            <p>{user?.profile?.bio}</p>
            <p>Languages</p>
            {user?.profile?.communication.map((item) => (
              <p key={item._id}>{`${item?.language} (${item?.proficiency})`}</p>
            ))}
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <div className="tabs">
          <Tabs defaultActiveKey="1" items={items} className="tab" />
        </div>
      </Grid>
    </Grid>
  );
}
