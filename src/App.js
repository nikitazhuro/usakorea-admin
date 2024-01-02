import React, { createContext, useContext, useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { jwtDecode } from 'jwt-decode';

import './App.css';

import AppRouter from './AppRouter';
import { useLocation, useNavigate } from 'react-router-dom';
import { authCheck } from './http/userApi';
import LoginForm from './components/LoginForm/LoginForm';
import Loader from './components/Loader/Loader';

const { Header, Content, Footer } = Layout;

const items = [
  { key: '1', label: 'Заявки' },
  { key: '2', label: 'Отзывы' },
  { key: '3', label: 'Доставленные авто' },
]

export const Context = createContext(null);

const App = () => {
  const [defaultSelected, setDefaultSelected] = useState([]);
  const { user } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const router = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange = ({ key }) => {
    switch (key) {
      case '2':
        router('/reviews');
        setDefaultSelected(['2'])
        break;
      case '3':
        router('/delivered');
        setDefaultSelected(['3'])
        break;
      case '1':
      default:
        router('/orders');
        setDefaultSelected(['1'])
        break;
    }
  }

  const checkAuthAndSetUser = async () => {
    try {
      await authCheck();

      user.setIsAuth(true);
      const token = localStorage.getItem('accessToken');
      const data = jwtDecode(token);

      user.setUser(data);
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (location.pathname.includes('/orders')) {
      setDefaultSelected(['1'])
    } else if (location.pathname.includes('/reviews')) {
      setDefaultSelected(['2'])
    } else if (location.pathname.includes('/delivered')) {
      setDefaultSelected(['3'])
    } else {
      setDefaultSelected(['1'])
    }
  }, [])

  useEffect(() => {
    checkAuthAndSetUser();
  }, []);

  if (!isLoading && !user._isAuth) {
    return (
      <div className="login-form">
        <LoginForm />
      </div>
    )
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={defaultSelected}
          onClick={onChange}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            height: 'calc(100vh - 185px)',
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <AppRouter />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default App;