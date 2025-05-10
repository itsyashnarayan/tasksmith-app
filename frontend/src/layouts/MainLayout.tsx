import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import useStore from '../store/useStore';

const LayoutContainer = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const Content = styled.main<{ sidebarOpen: boolean }>`
  flex-grow: 1;
  padding: 1rem;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '200px' : '60px')};
  margin-top: 60px;
  transition: margin-left 0.3s ease;
  overflow: hidden; 
`;

const MainLayout: React.FC = () => {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <LayoutContainer>
        <Sidebar isOpen={isSidebarOpen} />
        <Content sidebarOpen={isSidebarOpen}>
          <Outlet />
        </Content>
      </LayoutContainer>
    </>
  );
};

export default MainLayout;
