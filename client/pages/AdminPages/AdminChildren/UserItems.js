import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../../api";
import { getError } from "../../../utils";
import { toast } from "react-toastify";
import useLoading from "../../../component/HandleLoading/useLoading";
import { Button, Collapse, Table } from "antd";
import { Grid } from "@material-ui/core";
import Loading from "../../../component/Loading";
const { Panel } = Collapse;
export default function UserItems() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const { loading, setLoading, reload, setReload } = useLoading();
  const url = "https://community.cloudflare.steamstatic.com/economy/image/";
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await fetchUsers();
        const userItems = data
          ?.filter((user) => user?.tradeItem?.user !== undefined)
          ?.map((user) => ({
            user: user,
            items: user.tradeItem.user,
          }));
        setUsers(userItems);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchAllUsers();
  }, [reload]);
  console.log(users);
  const data = users?.map((user) => ({
    key: user?._id,
    username: user?.user.displayName || user?.user?.fullName,
    email: user?.user?.email,
    items: user?.items?.descriptions?.map((item) => ({
      id: item.classid,
      name: item.market_hash_name,
      image: url + item.icon_url,
      tradable: item.tradable,
      tags: item?.tags?.[0]?.localized_tag_name,
    })),
  }));
  const columns = [
    {
      title: "Users Inventories",
      dataIndex: "username",
      key: "username",
      width: "90%",
      render: (text, record) => (
        <Collapse
          className="collapseCategory"
          //   collapsible={record.subCategory.length > 0 ? "icon" : "disabled"}
        >
          <Panel
            header={
              <span>
                {record.username} ({record.email})
              </span>
            }
          >
            <table className="categoryTable">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Item Name</th>
                  <th>Image</th>
                  <th>Tags</th>
                  <th>Tradable</th>
                </tr>
              </thead>
              <tbody>
                {record.items.length > 0 &&
                  record.items.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.name}</td>
                      <td>
                        {item?.image ? (
                          <img
                            src={item?.image}
                            alt=""
                            style={{ width: 70, height: 70 }}
                          />
                        ) : (
                          <p>No image</p>
                        )}
                      </td>
                      <td>{item.tags}</td>
                      <td>
                        {item.tradable === 1
                          ? "True"
                          : item.tradable === 0 && "False"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Panel>
        </Collapse>
      ),
    },
  ];
  return (
    <Grid container alignItems="stretch" className="mg-auto-80">
      {loading && <Loading />}
      <Grid item xs={12} sm={12}>
        <Table columns={columns} dataSource={data} />
      </Grid>
    </Grid>
  );
}
