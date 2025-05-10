import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const Wrapper = styled.div`
  padding: 2rem;
`;

const Layout = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};

export default Layout;