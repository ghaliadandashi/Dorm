import React, {useEffect, useState} from 'react';
import {Card, Form, Input, Button, Table, Tabs} from 'antd';
import TabPane from "antd/es/tabs/TabPane";
import {useAuth} from "../Auth/AuthHook";
import axios from "axios";


const DormOwnerProfile = () => {
    const {user, setUser} = useAuth()
    const [profile,setProfile] = useState({
        name:'',
        email:'',
        dob:'',
        phone:'',

    })
    const [dorm,setDorm] =useState([])
    const columns = [
        {
            title: 'Dorm Name',
            dataIndex: 'dormName',
            key: 'dormName',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
        },
        {
            title: 'Dorm Type',
            dataIndex: 'dormType',
            key: 'dormType',
        },
        {
            title: 'Services',
            dataIndex: 'services',
            key: 'services',
            render: services => services.join(", ")
        }
    ];


    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/profile`)
                .then(response => {
                    setProfile({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        dob:response.data.user.dob,
                        phone:response.data.user.phoneNo
                    });
                })
                .catch(error => console.error("Failed to fetch user data:", error));
            axios.get(`http://localhost:3001/api/dorm`)
                .then(response=>{
                    console.log(response)
                    setDorm(response.data);
                })
        }
    }, [user]);


    return (
        <Card title="" style={{margin:'0px 170px'}}>
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Personal Info" key="1">
                    <Form layout="vertical">
                        <Form.Item label="Name">
                            <Input placeholder="Your Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}/>
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input placeholder="Email Address" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Date of Birth" >
                            <Input placeholder="Your birth date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })}/>
                        </Form.Item>
                        <Form.Item label="Phone Number">
                            <Input placeholder="Your phone number" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}/>
                        </Form.Item>
                        <Button type="primary">Update Profile</Button>
                    </Form>
                </TabPane>
                <TabPane tab="Booking Requests" key='2'>

                </TabPane>
                <TabPane tab="Properties" key="3" >
                    <Button type='primary'>Add Property</Button>
                    <Table columns={columns} dataSource={dorm} rowKey="id" />
                </TabPane>
                <TabPane tab="Financials" key="4">
                    <p>Financial Dashboard here</p>
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default DormOwnerProfile;
