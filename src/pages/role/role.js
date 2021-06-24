import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from "antd"
import { formateDate } from '../../utils/dateUtils'
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api/index"
import AddForm from "./add-form"
import AuthForm from "./auth-form"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils";
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'

class Role extends Component {

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
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
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
            const { roleName } = values;
            this.form.resetFields();
            // console.log(roleName)
            //请求添加
            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                // console.log(result.data)
                const role = result.data
                console.log(role)
                message.success("添加角色成功")
                // //重新获取角色列表
                // this.getRoles()
                this.setState( state => ({
                    roles: [...state.roles,role] 
                }))
                // 原生的setState的参数是一个回调函数
                // this.setState((state,props) => {
                //     roles:[...state.roles,roleData]
                // })
            } else {
                message.error("添加角色失败")
            }


        })

    }

    updateRole = async() => {
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        // role.auth_name = memoryUtils.user.username
        role.auth_name = this.props.user.username

        // 隐藏确认框
        this.setState({
            isShowAuth: false
        })
        const result = await reqUpdateRole(role)
        if(result.status === 0){
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
        }
        
        // this.setState({
        //     roles: [...this.state.roles]
        // })
        // 如果当前更新的是自己的权限，强制退出

        if (role._id === this.props.user.role_id) {
            // memoryUtils.user = {}
            // storageUtils.removeUser()
            this.props.logout()
            // this.props.history.replace('/login')
            message.success('当前用户角色权限成功')
          } else {
            message.success('设置角色权限成功')
            this.setState({
              roles: [...this.state.roles]
            })
          }
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
                <Button type="primary" onClick={() => this.setState({ isShowAdd: true })}>添加角色</Button>&nbsp;&nbsp;
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

export default connect(
    state => ({user: state.user}),
    {logout}
  )(Role)
