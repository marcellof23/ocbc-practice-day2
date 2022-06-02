import React, { useRef, useState } from 'react';
import { Table, Input, Button, Space, Pagination, Modal, Form, Checkbox } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const get_data = (): any[] => {
    let storage_data = localStorage.getItem('student');
    console.log(storage_data);
    if (storage_data == null) {
        return [];
    } else {
        let obj = JSON.parse(storage_data);
        let storage_array: any = [];
        for (var i in obj) {
            storage_array.push(obj[i]);
        }
        return storage_array;
    }
};

const source_data = get_data();

//let data = source_data;

function App() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [data, setData] = useState(source_data);

    const searchInput = useRef<any>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>();

    const search = useLocation().search;
    const pageSize = new URLSearchParams(search).get('pageSize') || '2';
    const page = new URLSearchParams(search).get('page');

    const [current, setCurrent] = useState(page);

    const navigate = useNavigate();

    const handlePagination = (pageNumber: any) => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        setCurrent(pageNumber);
        currentUrlParams.set('page', pageNumber);
        navigate(window.location.pathname + '?' + currentUrlParams.toString());
    };

    const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        //setData(data.filter((d: any) => d[dataIndex].toLowerCase().includes(selectedKeys[0])));
    };

    const handleReset = (clearFilters: any) => {
        setData(source_data);
        clearFilters();
        setSearchText('');
        setSearchedColumn('');
    };

    const getColumnSearchProps = (dataIndex: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: any) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text: any) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const onDeleteStudent = (record: any) => {
        Modal.confirm({
            title: 'Are you sure, you want to delete this student record?',
            okText: 'Yes',
            okType: 'danger',
            onOk: () => {
                setData((pre) => {
                    return pre.filter((student) => student.key !== record.key);
                });
            },
        });
    };

    const onEditStudent = (record: any) => {
        setIsEditing(true);
        setEditingStudent({ ...record });
    };

    const columns: any = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: '20%',
            ...getColumnSearchProps('age'),
            sorter: (a: any, b: any) => a.age - b.age,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
            sorter: (a: any, b: any) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },

        {
            title: 'Actions',
            key: 'actions',
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

    const onFinish = (values: any) => {
        const newStudent = {
            key: data.length + 1,
            name: values.name,
            age: values.age,
            address: values.address,
        };

        let storage_data = localStorage.getItem('student');
        if (storage_data == null) {
            let empty_array: any = [];
            empty_array.push(newStudent);
            localStorage.setItem('student', JSON.stringify(empty_array));
        } else {
            let obj = JSON.parse(storage_data);
            let storage_array = [];
            for (var i in obj) {
                storage_array.push(obj[i]);
            }

            storage_array.push(newStudent);
            localStorage.setItem('student', JSON.stringify(storage_array));
        }

        setData((pre: any) => {
            return [...pre, newStudent];
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const getData = (current: any, pageSize: any) => {
        console.log('DATA   ', data);
        return data
            .filter((d) => d.name.includes(searchText))
            .slice((current - 1) * pageSize, current * pageSize);
    };

    const MyPagination = ({ total, onChange, current }: any) => {
        return (
            <Pagination
                onChange={onChange}
                total={total}
                current={current}
                pageSize={parseInt(pageSize || '1')}
            />
        );
    };

    const resetEditing = () => {
        setIsEditing(false);
        setEditingStudent(null);
    };

    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            <Table columns={columns} dataSource={getData(current, pageSize)} pagination={false} />
            <MyPagination
                className="pagination-wrapper"
                total={data.length}
                current={current}
                onChange={handlePagination}
            />
            <Modal
                title="Edit Student"
                visible={isEditing}
                okText="Save"
                onCancel={() => {
                    resetEditing();
                }}
                onOk={() => {
                    setData((pre) => {
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
                    value={editingStudent?.age}
                    onChange={(e) => {
                        setEditingStudent((pre: any) => {
                            return { ...pre, age: e.target.value };
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
            {console.log(data.length, current, pageSize, getData(current, pageSize))}
        </>
    );
}

export default App;
