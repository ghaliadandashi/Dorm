import React from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from './AuthHook';
import {Button, Result} from "antd";

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const goBackToHome = () => {
        navigate('/home');
    };
    if (!user) {
        return <>
            <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={goBackToHome}>Back Home</Button>}
        />
            </>;
    }
    return <Component {...rest} />;
};

export default ProtectedRoute;
