import { Button, Col, Row, Switch, Table, notification } from "antd";
import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";

import { getAllOrders, updateOrder } from "../http/orderApi";
import TextArea from "antd/es/input/TextArea";

const OrdersPage = () => {
  const [data, setData] = useState();
  const [dataToUpdate, setDataToUpdate] = useState({});
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [api, contextHolder] = notification.useNotification();

  const updateRow = async (id) => {
    const data = dataToUpdate[id];

    if (data) {
      try {
        await updateOrder({ ...data, id });
        api.success({
          message: 'Заявка обновлена успешно',
          description: 'Для получения актуальных данных обновите страницу',
        });
      } catch (error) {
        api.error({
          message: 'Ошибка при обновлении ордера',
          description: error.message,
        });
      }
    }
  }

  const onChangeComplete = (e, id) => {
    setDataToUpdate((prev) => ({ ...prev, [id]: { ...prev[id], complete: e } }));
  }
  const onChangeComment = ({ target }, id) => {
    setDataToUpdate((prev) => ({ ...prev, [id]: { ...prev[id], comment: target.value } }));
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: '4%',
    },
    {
      title: 'Create',
      dataIndex: 'createdAt',
      render: (data) => dayjs(data).format('DD-MM-YYYY, HH:mm'),
      width: '15%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: 'Number',
      dataIndex: 'number',
      width: '15%',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (value, row) => {
        const { id } = row;
        const currentComment = dataToUpdate[id]?.comment;

        return (
          <TextArea
            value={currentComment == undefined ? value : currentComment}
            onChange={(e) => onChangeComment(e, id)}
          />
        )
      },
      width: '30%',
    },
    {
      title: 'Complete',
      dataIndex: 'complete',
      render: (value, row) => {
        const { id } = row;
        const currentComplete = dataToUpdate[id]?.complete;
        return (
          <Switch
            value={currentComplete == undefined ? value : currentComplete}
            onChange={(e) => onChangeComplete(e, id)}
          />
        )
      }
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (id) => {
        return (
          <Button onClick={() => updateRow(id)} disabled={!dataToUpdate[id]}>
            Update
          </Button>
        )
      }
    },
  ];

  const fetchData = async () => {
    setLoading(true);

    let length = 0

    try {
      const data = await getAllOrders();
      length = data.length;
      setData(data);
    } catch (error) {

    } finally {
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: length,
        },
      });
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  return (
    <Row>
      {contextHolder}
      <Col span={24}><h1>Заявки</h1></Col>
      <Col span={24}>
        <Table
          scroll={{ y: 'calc(100vh - 410px)' }}
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Col>
    </Row>
  )
}

export default OrdersPage;
