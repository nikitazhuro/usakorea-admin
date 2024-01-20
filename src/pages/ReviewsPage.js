import { Button, Col, Input, Modal, Popconfirm, Row, Table, notification } from "antd";
import { useEffect, useState } from "react";
import { createReview, deleteReview, getAllRevies, updateReview } from "../http/reviewsApi";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const ReviewsPage = () => {
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
    console.log(data);

    if (data) {
      try {
        await updateReview({ ...data, id });
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

  const deleteRow = async (id) => {
    try {
      await deleteReview(id);
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
      width: '30%',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (id) => {
        return (
          <Row style={{ gap: '5px' }}>
            <Button onClick={() => updateRow(id)} disabled={!dataToUpdate[id]}>
              Update
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
      const data = await getAllRevies();
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createReviewData, setCreateReviewData] = useState({
    date: '',
    name: '',
    grade: '',
    comment: '',
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await createReview(createReviewData);

    setIsModalOpen(false);

    await fetchData();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  return (
    <Row>
      {contextHolder}
      <Col span={24} className="reviews-page-header">
        <h1>Отзывы</h1>
        <Button onClick={showModal}>
          Create
        </Button>
      </Col>
      <Modal
        destroyOnClose
        title="Create review:"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <span>Date</span>
          <Input
            placeholder="DD-MM-YYYY, HH:mm"
            type="date"
            value={createReviewData.date}
            onChange={(e) => setCreateReviewData((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div>
          <span>Name</span>
          <Input
            value={createReviewData.name}
            onChange={(e) => setCreateReviewData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <span>Grade</span>
          <Input
            type="number"
            value={createReviewData.grade}
            onChange={(e) => setCreateReviewData((prev) => ({ ...prev, grade: e.target.value }))}
          />
        </div>
        <div>
          <span>Comment</span>
          <TextArea
            value={createReviewData.comment}
            onChange={(e) => setCreateReviewData((prev) => ({ ...prev, comment: e.target.value }))}
          />
        </div>
      </Modal>
      <Col span={24}>
        <Table
          scroll={{ y: 'calc(100vh - 289px)', x: 768 }}
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

export default ReviewsPage;