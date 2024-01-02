import { Button, Col, Image, Input, Row, Switch, Table, notification } from "antd";
import { createDeliveredCar, deleteDeliveredCar, getAllDeliveredCars, updateDeliveredCar } from "../http/deliveredCars";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const DeliveredPage = () => {
  const [file, setFile] = useState(null);

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
        description: 'Для получения актуальных данных обновите страницу',
      });
    } catch (error) {
      api.error({
        message: 'Ошибка при удалении записи',
        description: error.message,
      });
    }
  }

  const uploadImage = async () => {
    const formData = new FormData();

    formData.append('image', file);

    await createDeliveredCar(formData);

    setFile(null);
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
      sorter: true,
      width: '4%',
    },
    {
      title: 'Create',
      dataIndex: 'createdAt',
      sorter: true,
      render: (data) => dayjs(data).format('DD-MM-YYYY, HH:mm'),
      width: '15%',
    },
    {
      title: 'Name',
      dataIndex: 'image',
      sorter: true,
      render: (image) => {
        return (
          <Image width={400} height={200} src={`http://localhost:5000/${image}`} />
        )
      },
      width: '20%',
    },
    {
      title: 'Show',
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
          <Row>
            <Button onClick={() => updateRow(id)} disabled={!dataToUpdate[id]}>
              Update
            </Button>
            <Button onClick={() => deleteRow(id)}>
              Delete
            </Button>
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

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  return (
    <Row>
      <Col span={24} className="reviews-page-header">
        <h1>Отзывы</h1>
        <div>
          {file && (
            <img width={200} height={200} src={URL.createObjectURL(file)} alt="image" />
          )}
          <Input type="file" onChange={onChange} />
          <Button onClick={uploadImage}>
            Create
          </Button>
        </div>
      </Col>
      <Col span={24}>
        <Table
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