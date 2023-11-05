import React from "react";
import Role from "./AdminChildren/Role";
import { UserOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import Platform from "./AdminChildren/Platform";
import Category from "./AdminChildren/Category";
import User from "./AdminChildren/User";
import { Grid } from "@material-ui/core";
import UserItems from "./AdminChildren/UserItems";
export default function AdminDashboard() {
  const children = [
    <User />,
    <Role />,
    <Platform />,
    <Category />,
    <UserItems />,
  ];
  const tabName = [
    <span>User</span>,
    <span>Role</span>,
    <span>Platform </span>,
    <span>Category </span>,
    <span>User Items </span>,
  ];
  const icons = [
    <UserOutlined />,
    <UserOutlined />,
    <UserOutlined />,
    <UserOutlined />,
    <UserOutlined />,
  ];

  return (
    <Grid container className="pb-50">
      <div className="mt-15 mg-auto-80 admin">
        <Helmet>
          <title>Admin Dashboard</title>
        </Helmet>
        <Tabs
          defaultActiveKey="1"
          centered
          items={new Array(6).fill(null).map((_, i) => {
            return {
              label: (
                <span>
                  {icons[i]}
                  {tabName[i]}
                </span>
              ),
              key: i,
              children: children[i],
            };
          })}
        />
      </div>
    </Grid>
  );
}
