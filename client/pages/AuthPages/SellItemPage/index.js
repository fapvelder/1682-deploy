import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./SellItem.css";
import { Button } from "antd";
import { fetchCategories } from "../../../api";
import { useNavigate } from "react-router-dom";
import { Store } from "../../../Store";
import vi from "../../../component/languages/vi.json";
import en from "../../../component/languages/en.json";
import {
  brandNames,
  categoryNames,
} from "../../../component/languages/categoryNames";
export default function SellItem() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const language = state?.language || "en";
  useEffect(() => {
    if (category && brand) {
      if (category === "Game Items") {
        navigate(`/sell-item/${category}/${subCategory}/${brand}`);
      } else {
        navigate("/listing", {
          state: {
            category: category,
            subCategory: subCategory,
          },
        });
      }
    }
  }, [brand, category, subCategory, navigate]);
  const [subCategories, setSubCategories] = useState("");
  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await fetchCategories();
      const allCategories = result?.data?.map((cate) => ({
        id: cate?._id,
        name: cate?.name,
        src: cate?.image,
        active: false,
        categoryDesc: cate?.categoryDesc,
        subCate: cate?.subCategory,
      }));
      setCategories(allCategories);
    };
    fetchAllCategories();
  }, []);
  const handleClickCategory = (id) => {
    setCategories((prevElements) =>
      prevElements.map((element) =>
        element.id === id
          ? { ...element, active: true }
          : { ...element, active: false }
      )
    );
    categories?.filter((cate) => cate.id === id && setCategory(cate.name));
    categories?.filter((cate) => {
      if (cate.id === id) {
        const brands = cate?.subCate?.map((subCate) => ({
          id: subCate?._id,
          title: subCate?.title,
          subCategory: subCate?.subCategoryName?.name,
          src: subCate?.image,
          active: false,
        }));
        setBrands(brands);
        setSubCategories(cate?.categoryDesc);
      }
    });
  };

  const handleClickBrand = (id) => {
    brands?.filter((brand) => {
      if (brand.id === id) {
        setBrand(brand.title);
        setSubCategory(brand.subCategory);
      }
    });
  };
  return (
    <Grid container className="selling-item pb-50">
      <Helmet>
        <title>
          {language === "en" ? en.start_selling.title : vi.start_selling.title}
        </title>
      </Helmet>
      <div className="mg-auto-80">
        <h3 className="mt-15">
          {language === "en" ? en.start_selling.title : vi.start_selling.title}
        </h3>
        <Grid container className="mg-auto-80 selectCategory">
          <Grid
            item
            sm={12}
            md={12}
            className="categorySection"
            style={{ marginTop: 50 }}
          >
            <h3>
              <span>
                {" "}
                {language === "en"
                  ? en.start_selling.select_category
                  : vi.start_selling.select_category}
              </span>
            </h3>
            <Grid container>
              {categories.map((element) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  key={element.id}
                  className={"select"}
                  onClick={() => handleClickCategory(element.id)}
                >
                  <img
                    className={element.active ? "mt-15 active" : "mt-15"}
                    src={element.src}
                    alt=""
                    style={{
                      width: 140,
                      height: 140,
                    }}
                  />
                  <h6>{categoryNames[element?.name][language]}</h6>
                </Grid>
              ))}
            </Grid>
          </Grid>
          {subCategories && (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className="brandSection"
              style={{
                display: subCategories ? "block" : "none",
                marginTop: 50,
              }}
            >
              <h3>
                <span>
                  {language === "en"
                    ? en.start_selling.select
                    : vi.start_selling.select +
                      " " +
                      brandNames[subCategories][language]}
                </span>
              </h3>
              <Grid container>
                {brands.map((element) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={2}
                    key={element.id}
                    className={"select"}
                    // onClick={() => console.log(`/${}`)}
                    onClick={() => handleClickBrand(element.id)}
                  >
                    <img
                      className={element.active ? "mt-15 active" : "mt-15"}
                      src={element.src}
                      alt=""
                      style={{
                        width: 140,
                        height: 140,
                      }}
                    />
                    <h6>{element.title}</h6>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
          <Grid item sm={12} md={12}>
            <p className="mt-15">
              {language === "en"
                ? en.start_selling.warn_1
                : vi.start_selling.warn_1}{" "}
            </p>
            <p>
              {language === "en"
                ? en.start_selling.warn_2
                : vi.start_selling.warn_2}{" "}
            </p>
            <Button disabled className="defaultButton text-white">
              {language === "en"
                ? en.start_selling.next
                : vi.start_selling.next}
            </Button>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
