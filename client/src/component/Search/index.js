import React, { useContext, useEffect, useState } from "react";
import "./search.css";
import { Input, Select } from "antd";
import handleLoading from "../HandleLoading";
import useLoading from "../HandleLoading/useLoading";
import { fetchCategories, searchProduct } from "../../api";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import en from "../languages/en.json";
import vi from "../languages/vi.json";
const { Option } = Select;
export default function Search({ placeholder, categoryNames, language }) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const { loading, setLoading, reload, setReload } = useLoading();
  const handleSearch = async () => {
    navigate(`/search/product`);
    ctxDispatch({ type: "SET_SEARCH", payload: search });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await fetchCategories();
      setCategories(result.data);
    };
    fetchAllCategories();
  }, []);
  const calculateDefaultValue = () => {
    return state?.category ? state?.category : "";
  };
  const handleChangeCategory = (category) => {
    ctxDispatch({ type: "SET_CATEGORY", payload: category });
  };
  return (
    <div className="inputGroup">
      <Input
        className="customInputAntd"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        style={{ width: "90%" }}
        onKeyDown={handleKeyDown}
        addonBefore={
          <Select
            defaultValue={state?.category || ""}
            className="borderLeft"
            style={{ backgroundColor: "white" }}
            dropdownMatchSelectWidth={false}
            value={calculateDefaultValue()}
            onChange={(e) => {
              handleChangeCategory(e);
            }}
          >
            <Option value=""> {language === "en" ? en.All : vi.All}</Option>
            {categoryNames &&
              categories?.map((category) => (
                <Option key={category._id} value={category._id}>
                  {categoryNames[category.name][language]}
                </Option>
              ))}
          </Select>
        }
      />
      <div className="inputGroupAppendSearch">
        <button className="borderRight" onClick={() => handleSearch()}>
          <i className="fas fa-search" />
        </button>
      </div>
    </div>
  );
}
