import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { getUserProducts } from "../../../../api";
import { Store } from "../../../../Store";
import ProductList from "../../../../component/Product/ProductList";
import { useNavigate } from "react-router-dom";

export default function Listings({
  slug,
  loading,
  setLoading,
  reload,
  setReload,
  handleLoading,
  Loading,
}) {
  const { state } = useContext(Store);
  const navigate = useNavigate();
  // const slug = params?.slug;
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      if (slug) {
        handleLoading(
          async () => {
            const result = await getUserProducts(slug);
            setProducts(result.data);
          },
          setLoading,
          setReload
        );
      }
    };
    getProducts();
  }, [slug, handleLoading, setLoading, setReload]);
  return (
    <Grid container className="pb-50">
      {loading && <Loading />}
      <Grid container style={{ gridGap: "10px 0px" }}>
        {products?.map(
          (product, index) =>
            product.isAvailable && (
              <Grid
                key={index}
                item
                xs={12}
                sm={6}
                md={3}
                onClick={() => navigate(`/item/${product._id}`)}
              >
                <ProductList
                  title={product.title}
                  price={product.price}
                  img={product.photos[0]}
                />
              </Grid>
            )
        )}
      </Grid>
    </Grid>
  );
}
