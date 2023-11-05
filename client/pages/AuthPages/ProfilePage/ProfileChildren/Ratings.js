import React, { useEffect, useState } from "react";
import { getUserFeedback } from "../../../../api";
import { Grid } from "@material-ui/core";
import good from "../../../../component/img/good.png";
import neutral from "../../../../component/img/neutral.png";
import bad from "../../../../component/img/bad.png";
import moment from "moment";
import { Select } from "antd";
import useLoading from "../../../../component/HandleLoading/useLoading";
const { Option } = Select;
export default function Ratings({
  slug,
  loading,
  setLoading,
  reload,
  setReload,
  handleLoading,
  Loading,
}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState("");

  useEffect(() => {
    const getFeedback = () => {
      handleLoading(
        async () => {
          const response = await getUserFeedback(slug, rating);
          setFeedbacks(response.data);
        },
        setLoading,
        setReload
      );
    };
    getFeedback();
  }, [handleLoading, slug, rating, setLoading, setReload]);

  return (
    <Grid container>
      {loading && <Loading />}
      <Grid container style={{ padding: 10 }}>
        <Select
          defaultValue="Rating"
          onChange={(e) => (e === "Any" ? setRating("") : setRating(e))}
          style={{ width: 100 }}
        >
          <Option value="Any" />
          <Option value="Good" />
          <Option value="Neutral" />
          <Option value="Bad" />
        </Select>
      </Grid>
      <Grid container>
        {feedbacks &&
          feedbacks?.map((fb) => (
            <Grid item xs={8} sm={8} md={8} className="text-start" key={fb._id}>
              <Grid container style={{ borderTop: "1px solid #777" }}>
                <Grid container className="mt-15">
                  <Grid item xs={2} sm={2} md={1}>
                    <img
                      style={{ width: 30, height: 30 }}
                      src={
                        fb.rating === "Good"
                          ? good
                          : fb.rating === "Neutral"
                          ? neutral
                          : fb.rating === "Bad" && bad
                      }
                      alt={fb.rating}
                    />
                  </Grid>
                  <Grid item xs={10} sm={10} md={11}>
                    <div>
                      <span>{fb.user.displayName || fb.user.fullName}</span>
                      <p style={{ fontSize: 12, color: "grey" }}>
                        {moment(fb.createdAt).fromNow()}
                      </p>
                      <p>{fb.comment}</p>

                      <p style={{ fontSize: 12, color: "grey" }}>
                        Bought {fb?.order?.product?.title} (
                        {fb?.order?.product?.category?.name})
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}
