import 'antd/dist/antd.css';
import '../assets/css/index.css';
import { Button, Table, Modal, Input, Pagination } from 'antd';
import { useState } from 'react';
import qs from 'qs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FilterValue, SorterResult } from 'antd/lib/table/interface';
import type { ColumnsType, TablePaginationConfig } from 'antd/lib/table';

function App() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>();

    const pageSize = 2;

    const [dataSource, setDataSource] = useState([
        {
            key: 1,
            name: 'John',
            email: 'john@gmail.com',
            address: 'John Address',
        },
        {
            key: 2,
            name: 'David',
            email: 'david@gmail.com',
            address: 'David Address',
        },
        {
            key: 3,
            name: 'James',
            email: 'james@gmail.com',
            address: 'James Address',
        },
        {
            key: 4,
            name: 'Sam',
            email: 'sam@gmail.com',
            address: 'Sam Address',
        },
    ]);
    const columns = [
        {
            key: '1',
            title: 'Id',
            dataIndex: 'key',
        },
        {
            key: '2',
            title: 'Name',
            sorter: true,
            dataIndex: 'name',
        },
        {
            key: '3',
            title: 'Email',
            dataIndex: 'email',
        },
        {
            key: '4',
            title: 'Address',
            dataIndex: 'address',
        },
        {
            key: '5',
            title: 'Actions',
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

    const onAddStudent = () => {
        const randomNumber = Math.random() * 1000;
        const newStudent = {
            key: randomNumber,
            name: 'Name ' + randomNumber,
            email: randomNumber + '@gmail.com',
            address: 'Address ' + randomNumber,
        };
        setDataSource((pre) => {
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

    const onEditStudent = (record: any) => {
        setIsEditing(true);
        setEditingStudent({ ...record });
    };

    const resetEditing = () => {
        setIsEditing(false);
        setEditingStudent(null);
    };

    const getData = (current: any, pageSize: any) => {
        // Normally you should get the data from the server
        return dataSource.slice((current - 1) * pageSize, current * pageSize);
    };

    const MyPagination = ({ total, onChange, current }: any) => {
        return (
            <Pagination onChange={onChange} total={total} current={current} pageSize={pageSize} />
        );
    };

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    const getRandomuserParams = (params: any) => ({
        results: params.pagination?.pageSize,
        page: params.pagination?.current,
        ...params,
    });

    const fetchData = (params: any = {}) => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(params))}`)
            .then((res) => res.json())
            .then(({ results }) => {
                setData(results);
                setLoading(false);
                setPagination({
                    ...params.pagination,
                    total: 200,
                    // 200 is mock data, you should read it from server
                    // total: data.totalCount,
                });
            });
    };

    const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
        fetchData({
            sortField: sorter.field as string,
            sortOrder: sorter.order as string,
            pagination: newPagination,
            ...filters,
        });
    };

    const [current, setCurrent] = useState(1);

    return (
        <div className="App">
            <header className="App-header">
                <Button onClick={onAddStudent}>Add a new Student</Button>
                <Table
                    columns={columns}
                    dataSource={getData(current, pageSize)}
                    pagination={false}
                    onChange={handleTableChange}
                />
                <MyPagination
                    className="pagination-wrapper"
                    total={dataSource.length}
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
                    onOk={() => {
                        setDataSource((pre) => {
                            return pre.map((student) => {
                                if (student.key === editingStudent.key) {
                                    return editingStudent;
                                } else {
                                    return student;
                                }
                            });
                        });
                        resetEditing();
                    }}
                >
                    <Input
                        value={editingStudent?.name}
                        onChange={(e) => {
                            setEditingStudent((pre: any) => {
                                return { ...pre, name: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={editingStudent?.email}
                        onChange={(e) => {
                            setEditingStudent((pre: any) => {
                                return { ...pre, email: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={editingStudent?.address}
                        onChange={(e) => {
                            setEditingStudent((pre: any) => {
                                return { ...pre, address: e.target.value };
                            });
                        }}
                    />
                </Modal>
            </header>
        </div>
    );
}

export default App;
