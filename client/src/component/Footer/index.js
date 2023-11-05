import { Grid } from "@material-ui/core";
import { Divider } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  RedditOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import logoName from "../img/logoName.png";
import darkLogoName from "../img/darkLogoName.png";
import paypal from "../img/paypal.jpg";
import { Store } from "../../Store";
import { useLocation } from "react-router-dom";
import "./footer.css";
import vi from "../languages/vi.json";
import en from "../languages/en.json";
import fullPaypalTrans from "../img/fullPaypalTrans.png";
export default function Footer() {
  const { state } = useContext(Store);
  const language = state.language || "en";

  const theme = localStorage.getItem("theme");

  const withOutNavbarRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
  ];
  const { pathname } = useLocation();
  if (withOutNavbarRoutes.some((item) => pathname.includes(item))) return null;

  return (
    <Grid container className="footer">
      <Grid container className="mg-auto-80" style={{ marginTop: 50 }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          {language === "en"
            ? en.footer.join_our_community
            : vi.footer.join_our_community}

          <div>
            <FacebookOutlined className="icon" />
            <TwitterOutlined className="icon" />
            <InstagramOutlined className="icon" />
            <RedditOutlined className="icon" />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <span className="span">
            {language === "en" ? en.footer.sell.sell : vi.footer.sell.sell}
          </span>
          <ul>
            <li>
              {language === "en"
                ? en.footer.sell.selling_questions
                : vi.footer.sell.selling_questions}
            </li>
            <li>
              {language === "en"
                ? en.footer.sell.how_to_sell
                : vi.footer.sell.how_to_sell}
            </li>
            <li>
              {language === "en"
                ? en.footer.sell.sell_ingame_items
                : vi.footer.sell.sell_ingame_items}
            </li>
            <li>
              {language === "en"
                ? en.footer.sell.sell_video_games
                : vi.footer.sell.sell_video_games}
            </li>
            <li>
              {language === "en"
                ? en.footer.sell.sell_gift_cards
                : vi.footer.sell.sell_gift_cards}
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <span>
            {language === "en" ? en.footer.buy.buy : vi.footer.buy.buy}
          </span>
          <ul>
            <li>
              {language === "en"
                ? en.footer.buy.buying_questions
                : vi.footer.buy.buying_questions}
            </li>
            <li>
              {" "}
              {language === "en"
                ? en.footer.buy.how_to_buy
                : vi.footer.buy.how_to_buy}
            </li>
            <li>
              {" "}
              {language === "en"
                ? en.footer.buy.buy_ingame_items
                : vi.footer.buy.buy_ingame_items}
            </li>
            <li>
              {" "}
              {language === "en"
                ? en.footer.buy.buy_video_games
                : vi.footer.buy.buy_video_games}
            </li>
            <li>
              {" "}
              {language === "en"
                ? en.footer.buy.buy_gift_cards
                : vi.footer.buy.buy_gift_cards}
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <span>
            {" "}
            {language === "en" ? en.footer.faq.faq : vi.footer.faq.faq}
          </span>
          <ul>
            <li>
              {" "}
              {language === "en"
                ? en.footer.faq.how_does_gamebay_work
                : vi.footer.faq.how_does_gamebay_work}
            </li>
            <li>
              {" "}
              {language === "en"
                ? en.footer.faq.what_is_gamebay_guarantee
                : vi.footer.faq.what_is_gamebay_guarantee}
            </li>
            <li>
              {" "}
              {language === "en"
                ? en.footer.faq.how_does_gamebay_protect_sellers
                : vi.footer.faq.how_does_gamebay_protect_sellers}
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <span>
            {" "}
            {language === "en"
              ? en.footer.resources.resources
              : vi.footer.resources.resources}
          </span>
          <ul>
            <li>
              {language === "en"
                ? en.footer.resources.help_center
                : vi.footer.resources.help_center}
            </li>
            <li>
              {language === "en"
                ? en.footer.resources.return_policy
                : vi.footer.resources.return_policy}
            </li>
            <li>
              {language === "en"
                ? en.footer.resources.contact_us
                : vi.footer.resources.contact_us}
            </li>
          </ul>
        </Grid>
        <Grid container style={{ height: 70 }}>
          <img
            style={{ width: 120, height: 50, marginTop: 20, marginLeft: -5 }}
            src={theme === "dark" ? darkLogoName : logoName}
            alt="logo"
          />
        </Grid>
      </Grid>
      <Grid container>
        <Divider />
      </Grid>
      <Grid container className="copyright" style={{ padding: "20px" }}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          {language === "en" ? en.footer.about_us : vi.footer.about_us} |{" "}
          {language === "en" ? en.footer.term_of_use : vi.footer.term_of_use} |{" "}
          {language === "en"
            ? en.footer.privacy_policy
            : vi.footer.privacy_policy}
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <img
            className="logo"
            src={fullPaypalTrans}
            style={{
              width: 120,
              height: 50,
              marginLeft: -5,
            }}
            alt="logo"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginTop: 20 }}>
          {language === "en" ? en.footer.copyright : vi.footer.copyright}
        </Grid>
      </Grid>
    </Grid>
  );
}
