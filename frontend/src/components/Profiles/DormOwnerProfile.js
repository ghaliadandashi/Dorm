import React from 'react';
import { Card, Form, Input, Button, Table } from 'antd';

const DormOwnerProfile = () => {
    const properties = [
        {
            key: '1',
            name: 'Sunrise Apartments',
            location: 'Downtown',
            status: 'Available'
        },
        {
            key: '2',
            name: 'Moonlight Dorms',
            location: 'Suburb',
            status: 'Full'
        }
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="Profile" bordered={false} style={{ marginBottom: 24 }}>
                <Form layout="vertical">
                    <Form.Item label="Name">
                        <Input placeholder="Enter your name" />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary">Update Profile</Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="My Properties" bordered={false}>
                <Table dataSource={properties} columns={columns} />
            </Card>
        </div>
    );
};

export default DormOwnerProfile;
