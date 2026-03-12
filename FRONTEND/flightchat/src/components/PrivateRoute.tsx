import { FC, ReactNode } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        const token = localStorage.getItem('token');
        return token ? children : <Redirect to="/login" />;
      }}
    />
  );
};

export default PrivateRoute;
