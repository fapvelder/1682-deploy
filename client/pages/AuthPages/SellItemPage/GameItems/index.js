import { Grid } from "@material-ui/core";
import { Button, Divider } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemSteam, getUserByID } from "../../../../api";
import { Store } from "../../../../Store";
import "./gameItems.css";
import { toast } from "react-toastify";
import { getError } from "../../../../utils.js";
import handleLoading from "../../../../component/HandleLoading";
import useLoading from "../../../../component/HandleLoading/useLoading";
import Loading from "../../../../component/Loading";
import axios from "axios";
import Responsive from "../../../../component/ResponsiveCode/Responsive";
import vi from "../../../../component/languages/vi.json";
import en from "../../../../component/languages/en.json";
export default function GameItems() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const params = useParams();
  const element = useRef(null);
  const category = params.category;
  const subCategory = params.subcategory;
  const gameTitle = params.gametitle;
  const navigate = useNavigate();
  const { loading, setLoading, reload, setReload } = useLoading();
  const steam = state?.data?.profile?.steam;
  const url = "https://community.cloudflare.steamstatic.com/economy/image/";
  const language = state?.language || "en";
  const [steamInventory, setSteamInventory] = useState([]);
  const [priceInventory, setPriceInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const userID = state?.data?._id;
      if (userID) {
        try {
          const result = await getUserByID(userID);
          ctxDispatch({ type: "SET_DATA", payload: result?.data });
        } catch (err) {
          toast.error(getError(err));
        }
      }
    };
    getUser();
  }, [ctxDispatch, reload]);
  const handleScroll = () => {
    if (element?.current) {
      setTimeout(() => {
        element?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 200);
    }
  };
  const refreshInventory = async () => {
    handleLoading(
      async () => {
        const userID = state?.data?._id;
        const steamID = state?.data?.profile?.steam?.steamID;
        await getItemSteam(userID, steamID);
      },
      setLoading,
      setReload,
      "Refresh successfully"
    );
  };
  const handleContinue = (item) => {
    navigate("/listing", {
      state: {
        item: item,
        url: `${url}${selectedItem.icon_url}`,
        title: selectedItem.name,
        description: selectedItem.description,
        category: category,
        subCategory: subCategory,
        suggestedPrice: selectedItem.price,
        gameTitle: gameTitle,
      },
    });
  };
  useEffect(() => {
    if (steam) {
      if (gameTitle === "CS:GO") {
        setSteamInventory(
          steam?.steamInventory[1]?.filter((item) => item?.tradable)
        );
      } else if (gameTitle === "Steam Items") {
        setSteamInventory(
          steam?.steamInventory[0]?.filter((item) => item?.tradable)
        );
      } else {
        navigate("/settings", { state: { warn: "steam" } });
      }
    }
  }, [
    steam?.steamInventory,
    gameTitle,
    reload,
    navigate,
    steam,
    setLoading,
    setReload,
    state?.data?.profile?.steam?.steamID,
    state?.data?._id,
  ]);
  useEffect(() => {
    const getPrice = async () => {
      if (steamInventory) {
        // const requests = steamInventory.map(
        //   (item) =>
        //     item.tradable &&
        //     axios.get(
        //       `https://gameflip.com/api/v1/steam/price/730/${item.market_hash_name}`
        //     )
        // );
        // const responses = await axios?.all(requests);
        // const price = responses?.map(
        //   (response) => response?.data?.data?.median_price
        // );
        setPriceInventory(
          steamInventory.map((item, index) => ({
            key: item.assetid,
            appid: item.appid,
            contextid: item.contextid,
            icon_url: item.icon_url,
            market_hash_name: item.market_hash_name,
            name: item.name,
            description: item.descriptions,
            assetID: item.assetid,
            classID: item.classid,
            // price: gameTitle === "CS:GO" ? price[index] : "No suggested price",
            // price: gameTitle === "CS:GO" ? "1$" : "No suggested price",
          }))
        );
      }
    };
    getPrice();
  }, [steamInventory, reload, gameTitle]);
  const { tablet, mobile, minipad } = Responsive();
  return (
    <Grid container className="selling-item pb-50">
      {loading && <Loading />}
      <div className="mg-auto-80">
        <h3 className="mt-15">
          {language === "en" ? en.start_selling.title : vi.start_selling.title}{" "}
          - {gameTitle}
        </h3>
        <Grid
          container
          style={{ gridGap: minipad ? "40px" : "70px" }}
          className="selectSkin"
        >
          <Grid item xs={12} sm={7} md={7} className="inventorySection">
            <h3>
              <span>
                {language === "en"
                  ? en.start_selling.items.your_inventory
                  : vi.start_selling.items.your_inventory}
              </span>
            </h3>
            <Grid container>
              <Grid container style={{ marginBottom: 20, padding: 10 }}>
                <Button onClick={() => refreshInventory()}>
                  {language === "en"
                    ? en.start_selling.items.refresh_inventory
                    : vi.start_selling.items.refresh_inventory}
                </Button>
              </Grid>
              {steamInventory &&
                priceInventory.map((item) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    key={item.key}
                    className="product"
                    onClick={() => {
                      setSelectedItem(item);
                      handleScroll();
                    }}
                  >
                    <div className="specific-item">
                      <p
                        className="text-start ml-15"
                        style={{
                          paddingBottom: 15,
                          fontSize: gameTitle === "Steam Items" && 10,
                        }}
                      >
                        {item?.price}
                      </p>
                      <div
                        style={{
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img src={`${url}${item.icon_url}`} alt="" />
                      </div>
                    </div>
                    <p>{item?.name}</p>
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={4} className="skinSelectSection">
            <h3>
              <span>
                {language === "en"
                  ? en.start_selling.items.skin_sell
                  : vi.start_selling.items.skin_sell}{" "}
              </span>
            </h3>
            <Grid container>
              <Grid
                container
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {" "}
                  {selectedItem ? 1 : 0}{" "}
                  {language === "en"
                    ? en.start_selling.items.items_selected
                    : vi.start_selling.items.items_selected}{" "}
                </div>
                <div>
                  <Button
                    className="defaultButton ml-15"
                    disabled={selectedItem ? false : true}
                    onClick={() => handleContinue(selectedItem)}
                  >
                    {language === "en"
                      ? en.start_selling.items.continue
                      : vi.start_selling.items.continue}
                  </Button>
                </div>
              </Grid>
              <Divider />
              {selectedItem && (
                <Grid container className="text-start" ref={element}>
                  <div className="chooseSection">
                    <div className="chooseItem">
                      <img
                        style={{ width: "90%" }}
                        src={`${url}${selectedItem.icon_url}`}
                        alt=""
                      />
                    </div>
                    <div style={{ padding: 10 }}>
                      <div>{selectedItem.name}</div>
                      {/* <div style={{ color: "#E32636" }}>
                        Suggested Price: {selectedItem.price}
                      </div> */}
                      <div>
                        {selectedItem?.description?.map((item, index) => (
                          <div key={index}>
                            {item.value.split("\n").map((line, lineIndex) => (
                              <p key={lineIndex}>{line}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Divider />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
