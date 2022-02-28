import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import "./style.scss";
import productApi from "../../../../api/productApi.js";
import ProductSkeletonList from "../../components/ProductSkeletonList";
import ProductList from "features/Product/components/ProductList";
import Pagination from "@material-ui/lab/Pagination";
import ProductSort from "features/Product/components/ProductSort";
import ProductFilters from "features/Product/components/ProductFilters";
import FiltersSkeleton from "features/Product/components/FiltersSkeleton";

ListPage.propTypes = {};

const useStyles = makeStyles((theme) => ({
  root: {},

  //   left: {
  //     with: "252px",
  //   },

  // right: {
  //   flex: "1 1 auto",
  // },
}));

function ListPage() {
  // const classes = useStyles();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 8,
    total: 8,
    page: 1,
  });

  const [filters, setFilters] = useState({
    _page: 1,
    _limit: 8,
    _sort: "salePrice:ASC",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data, pagination } = await productApi.getAll(filters);
        // cập nhật danh sách sản phẩm
        setProductList(data);

        // cập nhật pagination
        setPagination(pagination);
      } catch (error) {
        console.log("ERR: ", error);
      }

      setLoading(false);
    })();
  }, [filters]);

  const handlePageChange = (e, page) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      _page: page,
    }));
  };

  const handleSortChange = (newSortValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      _sort: newSortValue,
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item className="left">
            <Paper elevation={0}>
              {loading ? (
                <FiltersSkeleton />
              ) : (
                <ProductFilters
                  filters={filters}
                  onChange={handleFiltersChange}
                />
              )}
            </Paper>
          </Grid>

          <Grid item className="right">
            <Paper elevation={0}>
              {loading ? (
                <ProductSkeletonList />
              ) : (
                <>
                  <ProductSort
                    currentSort={filters._sort}
                    onChange={handleSortChange}
                  />
                  <ProductList data={productList} />
                </>
              )}

              <Box className="pagination">
                <Pagination
                  onChange={handlePageChange}
                  page={pagination.page}
                  count={Math.ceil(pagination.total / pagination.limit)}
                  color="primary"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ListPage;
