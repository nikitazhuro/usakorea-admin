import { Button, Col, Image, Input, Modal, Popconfirm, Row, Switch, Table, notification } from "antd";
import { createDeliveredCar, deleteDeliveredCar, getAllDeliveredCars, updateDeliveredCar } from "../http/deliveredCars";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const DeliveredPage = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState();
  const [dataToUpdate, setDataToUpdate] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        await updateDeliveredCar({ show: data.show, id });
        api.success({
          message: 'Запись обновлена успешно',
          description: 'Для получения актуальных данных обновите страницу',
        });
      } catch (error) {
        api.error({
          message: 'Ошибка при обновлении записи',
          description: error.message,
        });
      }
    }
  }

  const deleteRow = async (id) => {
    try {
      await deleteDeliveredCar(id);
      api.success({
        message: 'Запись удалена успешно',
      });
      await fetchData();
    } catch (error) {
      api.error({
        message: 'Ошибка при удалении записи',
        description: error.message,
      });
    }
  }

  const onChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  }

  const onChangeShow = (e, id) => {
    setDataToUpdate((prev) => ({ ...prev, [id]: { ...prev[id], show: e } }));
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
      title: 'Image',
      dataIndex: 'image',
      render: (image) => {
        return (
          <Image src={`https://api.autosaya.by/${image}`} />
        )
      },
      width: '20%',
    },
    {
      title: 'Show on site',
      dataIndex: 'show',
      render: (value, row) => {
        const { id } = row;
        const currentComplete = dataToUpdate[id]?.show;

        return (
          <Switch
            value={currentComplete == undefined ? value : currentComplete}
            onChange={(e) => onChangeShow(e, id)}
          />
        )
      }
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

    let length = 0

    try {
      const data = await getAllDeliveredCars();
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const formData = new FormData();

    formData.append('image', file);

    await createDeliveredCar(formData);

    setFile(null);

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
      <Col style={{ height: '40px' }} span={24} className="reviews-page-header">
        <h1>Доставленные авто</h1>
        <Button onClick={showModal}>
          Create
        </Button>
      </Col>
      <Modal
        width={478}
        destroyOnClose
        title="Add photo:"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Input type="file" onChange={onChange} />
          {file && (
            <Image src={URL.createObjectURL(file)} alt="image" className="upload_img" />
          )}
        </div>

      </Modal>
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

export default DeliveredPage;