import { Button, Col, Input, Popconfirm, Row, Switch, Table, notification } from "antd";
import { useEffect, useState } from "react";
import { deleteUserReview, getAllUsersRevies, updateUserReview } from "../http/users-reviewsApi";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { createReview } from "../http/reviewsApi";

const UsersReviewsPage = () => {
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

  const createReviewWrapper = async (id) => {
    const updateData = dataToUpdate[id];
    const tableData = data.find((e) => e.id === id);

    const config = {
      grade: tableData.grade,
      name: tableData.name,
      comment: tableData.comment,
      date: tableData.date,
      ...updateData,
    }

    try {
      await createReview({ ...config });
      await updateUserReview({ id, approved: true });
      api.success({
        message: 'Отзыв успешно создан',
        description: 'Для получения актуальных данных обновите страницу',
      });
    } catch (error) {
      api.error({
        message: 'Ошибка при создании отзыва',
        description: error.message,
      });
    }
  }

  const deleteRow = async (id) => {
    try {
      await deleteUserReview(id);
      api.success({
        message: 'Отзыв удален успешно',
      });

      await fetchData();
    } catch (error) {
      api.error({
        message: 'Ошибка при удалении отзыва',
        description: error.message,
      });
    }
  }

  const onChangeGrade = ({ target }, id) => {
    setDataToUpdate((prev) => ({ ...prev, [id]: { ...prev[id], grade: target.value } }));
  }
  const onChangeDate = ({ target }, id) => {
    setDataToUpdate((prev) => ({ ...prev, [id]: { ...prev[id], date: target.value } }));
  }
  const onChangeComment = ({ target }, id) => {
    setDataToUpdate((prev) => ({ ...prev, [id]: { ...prev[id], comment: target.value } }));
  }
  const onChangeName = ({ target }, id) => {
    setDataToUpdate((prev) => ({ ...prev, [id]: { ...prev[id], name: target.value } }));
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
      render: (value, row) => {
        const { id } = row;
        const currentName = dataToUpdate[id]?.name;

        return (
          <Input
            type="text"
            value={currentName == undefined ? value : currentName}
            onChange={(e) => onChangeName(e, id)}
          />
        )
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: '15%',
      render: (value, row) => {
        const { id } = row;
        const currentDate = dataToUpdate[id]?.date;

        return (
          <Input
            type="date"
            value={currentDate == undefined ? dayjs(value).format('YYYY-MM-DD') : currentDate}
            onChange={(e) => onChangeDate(e, id)}
          />
        )
      },
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      width: '15%',
      render: (value, row) => {
        const { id } = row;
        const currentGrade = dataToUpdate[id]?.grade;

        return (
          <Input
            type="number"
            value={currentGrade == undefined ? value : currentGrade}
            onChange={(e) => onChangeGrade(e, id)}
          />
        )
      },
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
      width: '25%',
    },
    {
      title: 'Approved',
      dataIndex: 'approved',
      render: (value, row) => {
        const { id } = row;

        return (
          <Switch
            defaultChecked={value}
            onChange={(e) => updateUserReview({ id, approved: e })}
          />
        )
      },
      width: '5%',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (id) => {
        return (
          <Row style={{ gap: '5px' }}>
            <Button onClick={() => createReviewWrapper(id)}>
              Create from
            </Button>
            <Popconfirm
              title="Delete the document"
              description="Are you sure to delete this document?"
              onConfirm={() => deleteRow(id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Row>
        )
      }
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    let length = 0;

    try {
      const data = await getAllUsersRevies();
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
      <Col span={24} className="reviews-page-header">
        <h1>Отзывы пользователей</h1>
      </Col>
      <Col span={24}>
        <Table
          scroll={{ y: 'calc(100vh - 410px)', x: 768 }}
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

export default UsersReviewsPage;