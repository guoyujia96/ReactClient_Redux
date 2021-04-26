import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from "antd"
import { formateDate } from '../../utils/dateUtils'
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api/index"
import AddForm from "./add-form"
import AuthForm from "./auth-form"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils";
export default class Role extends Component {

    auth = React.createRef()
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
    }


    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        // console.log(result)
        if (result.status === 200) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: () => {
                // console.log(role)
                this.setState({ role })
            }
        }
    }

    addRole = () => {

        // 进行表单验证，验证过了才进行后面操作
        this.form.validateFields().then(async values => {
            // 隐藏 添加 的对话框（modal）
            this.setState({ isShowAdd: false })
            //收集数据
            // const roleName = this.form.getFieldValue("roleName")
            // 解构赋值
            const { roleName } = values;
            //清空数据:好像会自动清空？
            // this.form.resetFields();
            // console.log(roleName)
            //请求添加
            const result = await reqAddRole(roleName)
            if (result.data.status === 0) {
                // console.log(result.data)
                const roleData = result.data.data
                // console.log(roleData)
                message.success("添加角色成功")
                // //重新获取角色列表
                // this.getRoles()
                const roles = this.state.roles
                // console.log(roles)
                // roles.push(roleData)
                // console.log(roles)
                this.setState({ roles: [roleData, ...roles] })
                // 比较推荐的写法如下:原生的setState的参数是一个回调函数
                // this.setState((state,props) => {
                //     roles:[...state.roles,roleData]
                // })
            } else {
                message.error("添加角色失败")
            }


        })

    }

    updateRole = () => {
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        // 隐藏确认框
        this.setState({
            isShowAuth: false
        })
        message.success('当前用户角色权限成功')
        this.setState({
            roles: [...this.state.roles]
        })
        // 如果当前更新的是自己的权限，强制退出
        if (role._id === memoryUtils.user.role_id) {
            memoryUtils.user = {}
            storageUtils.removeUser()
            this.props.history.replace('/login')
            message.success('当前用户角色权限成功')
          } else {
            message.success('设置角色权限成功')
            this.setState({
              roles: [...this.state.roles]
            })
          }
        // // 请求更新
        // const result = await reqUpdateRole(role)
        // if (result.data.status === 0) {
        //     // this.getRoles()
        //     // 如果当前更新的是自己角色的权限, 强制退出
        //     if (role._id === memoryUtils.user.role_id) {
        //         memoryUtils.user = {}
        //         storageUtils.removeUser()
        //         this.props.history.replace('/login')
        //         message.success('当前用户角色权限成功')
        //     } else {
        //         message.success('设置角色权限成功')
        //         this.setState({
        //             roles: [...this.state.roles]
        //         })
        //     }

        // }

    }

    componentWillMount() {
        this.initColumn();
    }
    componentDidMount() {
        this.getRoles();
    }

    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>&nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5 }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { // 选择某个radio时回调
                            this.setState({
                                role
                            })
                        }

                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}
                >
                    <AuthForm ref={this.auth} role={role} />
                </Modal>
            </Card>
        )
    }
}