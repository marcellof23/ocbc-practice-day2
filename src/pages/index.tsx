import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../assets/css/index.css';
import { Table, Divider, Tag, Pagination, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function App() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [current, setCurrent] = useState(1);

    const onEditStudent = (record: any) => {
        setIsEditing(true);
        setEditingStudent({ ...record });
    };
    const resetEditing = () => {
        setIsEditing(false);
        setEditingStudent(null);
    };

    const onAddStudent = () => {
        const randomNumber = Math.random() * 1000;
        const newStudent = {
            id: randomNumber,
            name: 'Name ' + randomNumber,
            email: randomNumber + '@gmail.com',
            address: 'Address ' + randomNumber,
        };
        setDataSource((pre: any) => {
            return [...pre, newStudent];
        });
    };
    const onDeleteStudent = (record: any) => {
        Modal.confirm({
            title: 'Are you sure, you want to delete this student record?',
            okText: 'Yes',
            okType: 'danger',
            onOk: () => {
                setDataSource((pre) => {
                    return pre.filter((student) => student.key !== record.key);
                });
            },
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: any) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags: any) => (
                <span>
                    {tags.map((tag: any) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: any) => {
                return (
                    <>
                        <EditOutlined
                            onClick={() => {
                                onEditStudent(record);
                            }}
                        />
                        <DeleteOutlined
                            onClick={() => {
                                onDeleteStudent(record);
                            }}
                            style={{ color: 'red', marginLeft: 12 }}
                        />
                    </>
                );
            },
        },
    ];

    const [data, setDataSource] = useState([
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ]);

    const pageSize = 2;

    const getData = (current: any, pageSize: any) => {
        // Normally you should get the data from the server
        return data.slice((current - 1) * pageSize, current * pageSize);
    };

    // Custom pagination component
    const MyPagination = ({ total, onChange, current }: any) => {
        return (
            <Pagination onChange={onChange} total={total} current={current} pageSize={pageSize} />
        );
    };

    return (
        <>
            <div className="table-wrapper">
                <Table
                    columns={columns}
                    dataSource={getData(current, pageSize)}
                    pagination={false}
                />
                <MyPagination
                    className="pagination-wrapper"
                    total={data.length}
                    current={current}
                    onChange={setCurrent}
                />
                <Modal
                    title="Edit Student"
                    visible={isEditing}
                    okText="Save"
                    onCancel={() => {
                        resetEditing();
                    }}
                    // onOk={() => {
                    //     setDataSource((pre) => {
                    //         return pre.map((student) => {
                    //             if (student.key === editingStudent.key) {
                    //                 return editingStudent;
                    //             } else {
                    //                 return student;
                    //             }
                    //         });
                    //     });
                    //     resetEditing();
                    // }}
                >
                    {/* <Input
                        value={editingStudent?.name}
                        onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, name: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={editingStudent?.email}
                        onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, email: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={editingStudent?.address}
                        onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, address: e.target.value };
                            });
                        }}
                    /> */}
                </Modal>
            </div>
        </>
    );
}

export default App;
