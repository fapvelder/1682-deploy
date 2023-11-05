import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchCategories, fetchPlatforms, searchProduct } from "../../../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import ProductList from "../../../component/Product/ProductList";
import { InputNumber, Pagination, Select } from "antd";
import Loading from "../../../component/Loading";
import useLoading from "../../../component/HandleLoading/useLoading";
import handleLoading from "../../../component/HandleLoading";
import { Store } from "../../../Store";
import "./searchPage.css";
import { Helmet } from "react-helmet-async";
import Search from "../../../component/Search";
import Responsive from "../../../component/ResponsiveCode/Responsive";
import en from "../../../component/languages/en.json";
import vi from "../../../component/languages/vi.json";
const { Option } = Select;

export default function SearchPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const stateSearch = useLocation();
  const scrollRef = useRef();

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [available, setAvailable] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, setLoading, reload, setReload } = useLoading();
  const language = state.language || "en";
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);
  useEffect(() => {
    const fetchSearchProducts = async () => {
      handleLoading(
        async () => {
          const result = await searchProduct(
            state?.search,
            state?.category,
            state?.subCategory,
            platform,
            available,
            min,
            max,
            page,
            pageSize
          );
          setProducts(result.data.products);
          setTotalPages(result.data.totalPages);
        },
        setLoading,
        setReload
      );
    };

    fetchSearchProducts();
  }, [
    state?.search,
    category,
    subCategory,
    state?.subCategory,
    platform,
    available,
    min,
    max,
    setLoading,
    setReload,
    ctxDispatch,
    state?.category,
    page,
    pageSize,
  ]);
  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await fetchCategories();
      setCategories(result.data);
    };
    fetchAllCategories();
  }, []);
  useEffect(() => {
    const fetchAllPlatforms = async () => {
      const result = await fetchPlatforms();
      setPlatforms(result.data);
    };
    fetchAllPlatforms();
  }, []);
  const handleClearAll = () => {
    ctxDispatch({ type: "SET_CATEGORY", payload: "" });
    ctxDispatch({ type: "SET_SUBCATEGORY", payload: "" });
    setPlatform("");
    setAvailable("");
    setMin("");
    setMax("");
    setPage(1);
  };
  const handleChangeCategory = (category) => {
    ctxDispatch({ type: "SET_CATEGORY", payload: category });
  };
  const handleChangeSubCategory = (subCategory) => {
    ctxDispatch({ type: "SET_SUBCATEGORY", payload: subCategory });
  };
  const calculateDefaultCategory = () => {
    return state?.category ? state?.category : "";
  };
  const calculateDefaultSubCategory = () => {
    return state?.subCategory ? state?.subCategory : "";
  };
  const { tablet, mobile, minipad } = Responsive();
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
    <Grid container style={{ padding: 20, paddingBottom: "15vh" }}>
      {loading && <Loading />}
      <Helmet>
        <title>
          {language === "en" ? en.search_product : vi.search_product}
        </title>
      </Helmet>
      <Grid container ref={scrollRef}>
        <Grid item sm={12} md={3}>
          <Grid
            container
            className="border"
            style={{ width: "90%", marginBottom: 15 }}
          >
            <Grid
              item
              sm={10}
              md={8}
              className="text-start"
              style={{ padding: 10 }}
            >
              {language === "en" ? en.filter_by : vi.filter_by}
            </Grid>
            <Grid
              item
              sm={2}
              md={4}
              style={{ padding: 10, color: "grey", cursor: "pointer" }}
              onClick={() => handleClearAll()}
            >
              {language === "en" ? en.clear_all : vi.clear_all}
            </Grid>
            <Grid
              item
              sm={12}
              md={12}
              className="border text-start"
              style={{ padding: 10 }}
            >
              <Grid container style={{ width: "100%" }}>
                <div> {language === "en" ? en.category : vi.category}</div>
                <div style={{ width: "100%" }}>
                  <Select
                    onChange={(e) => {
                      handleChangeCategory(e);
                      handleChangeSubCategory("");
                    }}
                    value={calculateDefaultCategory()}
                    style={{ width: "100%" }}
                  >
                    <Option value="">
                      {" "}
                      {language === "en" ? en.any : vi.any}
                    </Option>
                    {categories.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {categoryNames[category.name][language]}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Grid>
              {state.category && (
                <Grid container style={{ width: "100%" }}>
                  <div>
                    {language === "en" ? en.sub_category : vi.sub_category}
                  </div>
                  <div style={{ width: "100%" }}>
                    <Select
                      onChange={(e) => handleChangeSubCategory(e)}
                      value={calculateDefaultSubCategory()}
                      style={{ width: "100%" }}
                    >
                      <Option value="">
                        {language === "en" ? en.any : vi.any}
                      </Option>
                      {categories
                        .filter((category) => category._id === state.category)
                        .map((category) =>
                          category.subCategory.map((subCategory) => (
                            <Option
                              key={subCategory._id}
                              value={subCategory.title}
                            >
                              {subCategory.title}
                            </Option>
                          ))
                        )}
                    </Select>
                  </div>
                </Grid>
              )}
              <Grid container style={{ width: "100%" }}>
                <div>{language === "en" ? en.available : vi.available}</div>
                <div style={{ width: "100%" }}>
                  <Select
                    onChange={(e) => setAvailable(e)}
                    defaultValue=""
                    style={{ width: "100%" }}
                  >
                    <Option value="">
                      {language === "en" ? en.any : vi.any}
                    </Option>
                    <Option value="true">
                      {language === "en" ? en.on_sale : vi.on_sale}
                    </Option>
                    <Option value="false">
                      {language === "en" ? en.sold : vi.sold}
                    </Option>
                  </Select>
                </div>
              </Grid>
              <Grid container style={{ width: "100%" }}>
                <div>
                  {language === "en" ? en.custom_price : vi.custom_price}
                </div>
                <div style={{ width: "100%" }}>
                  <InputNumber
                    value={min}
                    onChange={(e) => setMin(e)}
                    min={0}
                    placeholder={language === "en" ? en.min : vi.min}
                    style={{ width: mobile ? "48%" : tablet ? "49%" : "48%" }}
                  />
                  <span> - </span>
                  <InputNumber
                    value={max}
                    onChange={(e) => setMax(e)}
                    min={0}
                    placeholder={language === "en" ? en.max : vi.max}
                    style={{ width: mobile ? "48%" : tablet ? "49%" : "48%" }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={9} className="text-start ">
          <Grid container style={{ gridGap: "20px 0px" }}>
            {products.length > 0 ? (
              products?.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/item/${product._id}`)}
                >
                  <ProductList
                    title={product.title}
                    price={product.price}
                    img={product.photos[0]}
                    sold={!product.isAvailable}
                  />
                </Grid>
              ))
            ) : (
              <Grid container style={{ marginTop: 15 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <h2>
                    {language === "en" ? en.no_product.no1 : vi.no_product.no1}
                  </h2>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <h4>
                    {language === "en" ? en.no_product.no2 : vi.no_product.no2}
                  </h4>
                </Grid>

                <Grid
                  item
                  md={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div>
                    <Search
                      categoryNames={categoryNames}
                      placeholder={language === "en" ? en.search : vi.search}
                      language={language}
                    />{" "}
                  </div>
                </Grid>
              </Grid>
            )}
          </Grid>
          {products.length > 0 && (
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Pagination
                onChange={(e) => setPage(e)}
                current={page}
                total={totalPages * 10}
                showSizeChanger={false}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
