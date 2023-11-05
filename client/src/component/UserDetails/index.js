import React, { useContext, useEffect, useState } from "react";
import "./UserDetails.css";
import { Grid } from "@material-ui/core";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import handleLoading from "../HandleLoading";
import { getUserFeedback } from "../../api";
import vi from "../../component/languages/vi.json";
import en from "../../component/languages/en.json";
import { Store } from "../../Store";
export default function UserDetails({
  currentChatUser,
  contact,
  width = "80%",
}) {
  const { state } = useContext(Store);
  const [rating, setRating] = useState("");
  const language = state?.language || "en";
  useEffect(() => {
    const getUserFeedbacks = async () => {
      if (currentChatUser?.slug) {
        const result = await getUserFeedback(currentChatUser?.slug, "");
        setRating(result.data);
      }
    };
    getUserFeedbacks();
  }, [currentChatUser?.slug]);
  const navigate = useNavigate();
  return (
    <Grid
      container
      className="userDetailsContainer border"
      style={{ width: width, height: "170px", padding: 10 }}
    >
      <Grid item xs={6} sm={6} md={3}>
        <img
          className="cursorPointer"
          onClick={() => navigate(`/profile/${currentChatUser.slug}`)}
          src={currentChatUser?.avatar}
          alt={currentChatUser?.fullName}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={9}>
        <div className="text-start">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "10px",
              marginTop: "5px",
            }}
          >
            <p
              className="userName cursorPointer"
              onClick={() => navigate(`/profile/${currentChatUser.slug}`)}
            >
              {currentChatUser?.displayName || currentChatUser?.fullName}
            </p>
            {contact && (
              <Button
                className="defaultButton"
                onClick={() => navigate(`/chat/${currentChatUser?.slug}`)}
              >
                <i className="fas fa-comments" style={{ cursor: "pointer" }} />
                &nbsp;{" "}
                {language === "en"
                  ? en.user_details.contact
                  : vi.user_details.contact}
              </Button>
            )}
          </div>
          <p>
            &nbsp;{" "}
            {language === "en" ? en.user_details.since : vi.user_details.since}
            {moment(currentChatUser?.since).format("MMM YYYY")}
          </p>
          <p>
            &nbsp;{" "}
            {language === "en"
              ? en.user_details.seller_rating
              : vi.user_details.seller_rating}
            :{" "}
            {rating.length > 0
              ? `${rating.length} ${
                  language === "en"
                    ? en.user_details.ratings
                    : vi.user_details.ratings
                }`
              : language === "en"
              ? en.user_details.not_available
              : vi.user_details.not_available}
          </p>
          {currentChatUser?.profile?.communication &&
            currentChatUser?.profile?.communication.length > 0 && (
              <p>
                {language === "en"
                  ? en.user_details.languages
                  : vi.user_details.languages}
                :{" "}
                {currentChatUser?.profile?.communication?.map((item, index) => (
                  <React.Fragment key={item._id}>
                    {`${item.language} (${item?.proficiency})`}
                    {index !== currentChatUser.profile.communication.length - 1
                      ? ", "
                      : ""}
                  </React.Fragment>
                ))}
              </p>
            )}
        </div>
      </Grid>
    </Grid>
  );
}
