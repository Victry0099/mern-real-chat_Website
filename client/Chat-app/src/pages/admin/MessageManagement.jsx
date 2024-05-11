import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { transFormImage } from "../../lib/features";
import { Skeleton, Stack } from "@mui/material";
import { Avatar } from "@mui/material";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/Hooks";
import { useFetchData } from "6pp";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <Avatar src={params.row.avatar} alt={params.row.name} />
    ),
  },

  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },

  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack>
        <Avatar src={params.row.sender.avatar} alt={params.row.sender.name} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },

  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "groupChat",
    headerName: "Groups Chat",
    headerClassName: "table-header",
    width: 150,
  },

  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const { data, loading, error } = useFetchData(
    `${server}/api/v1/admin/all-messages`,
    "dashboard-all-messages"
  );
  console.log("data", data);
  console.log("error", error);

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transFormImage(i.sender.avatar, 50),
          },
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Messages"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
