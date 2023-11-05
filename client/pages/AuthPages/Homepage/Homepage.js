import { Carousel } from "antd";
import { Helmet } from "react-helmet-async";
import "./homepage.css";
import banner2 from "../../../component/img/banner.png";
import banner1 from "../../../component/img/banner2.jpg";
import movie from "../../../component/img/movie.jpg";
import giftcards from "../../../component/img/giftcards.png";
import ingame from "../../../component/img/ingame.png";
import games from "../../../component/img/games.png";
import ProductList from "../../../component/Product/ProductList";
import CardContainer from "../../../component/CardContainer";
import { Grid } from "@material-ui/core";
import en from "../../../component/languages/en.json";
import vi from "../../../component/languages/vi.json";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../../Store";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../../api";
export default function Homepage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const banners = [banner1, banner2];
  const language = state.language || "en";
  const captions = [
    language === "en" ? en.caption1 : vi.caption1,
    language === "en" ? en.caption2 : vi.caption2,
  ];

  const [categories, setCategories] = useState([]);
  let src = [ingame, giftcards, games, movie];
  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await fetchCategories();
      setCategories(result.data);
    };
    fetchAllCategories();
  }, []);
  const handleSearch = (categoryID, subCategory) => {
    navigate("/search/product");

    ctxDispatch({ type: "SET_CATEGORY", payload: categoryID });
    ctxDispatch({ type: "SET_SUBCATEGORY", payload: "" });
    if (subCategory) {
      ctxDispatch({ type: "SET_SUBCATEGORY", payload: subCategory });
    }
  };
  const categoryNames = {
    "Game Items": {
      en: "Game Items",
      vi: "Vật phẩm ảo",
    },
    "Gift Cards": {
      en: "Gift Cards",
      vi: "Thẻ quà tặng",
    },
    Games: {
      en: "Games",
      vi: "Trò chơi",
    },
    Movies: {
      en: "Movies",
      vi: "Phim",
    },
  };

  return (
    <Grid container className="pb-50">
      <Helmet>
        <title>{language === "en" ? en.title : vi.title}</title>
      </Helmet>
      <div style={{ width: "100vw", height: "100%" }}>
        <Carousel autoplay>
          {banners.map((banner, index) => (
            <div className="carousel" key={index}>
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="carousel-image"
              />
              <div className="carousel-caption">
                <h3>{captions[index]}</h3>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <h2 className="content">
        {language === "en" ? en.popular_categories : vi.popular_categories}
      </h2>
      <Grid container className="mg-auto-80">
        {categories.map((category, index) => (
          <CardContainer
            key={index}
            title={categoryNames[category.name][language]}
            img={src[index]}
            handleSearch={handleSearch}
            category={category._id}
          />
        ))}
      </Grid>
      {categories.map((category, index) => (
        <Grid container key={category._id}>
          <h2 className="content">{categoryNames[category.name][language]}</h2>
          <Grid container className="mg-auto-80">
            {category.subCategory.map((subCategory) => (
              <CardContainer
                key={subCategory._id}
                title={subCategory.title}
                width="200px"
                height="200px"
                img={subCategory.image}
                handleSearch={handleSearch}
                category={category._id}
                subCategory={subCategory.title}
              />
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
