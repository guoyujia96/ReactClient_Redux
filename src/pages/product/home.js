import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import LinkButton from '../../component/Link-button'
import { reqProducts } from '../../api'

const Option = Select.Option
export default class ProductHome extends Component {


    state = {
        total: 0, // 商品的总数量
        products: [], // 商品的数组
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据哪个字段搜索
 
     
    }

    /*
初始化table的列的数组
*/
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product 
                    // console.log(product)

                    const newStatus = status === 1 ? 2 : 1

                    return (
                        <span>
                            <Button
                                type='primary'
                                // 点击按钮切换文字
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                // 参数product是被点击的商品
                render: (product) => {
                    return (
                        <span>
                            {/*将product对象使用location下的state参数传递给目标路由组件*/}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

      /*
  更新指定商品的状态
   */
  updateStatus = async (productId, newStatus) => {
    // const result = await reqUpdateStatus(productId, status)
    // if(result.status===0) {
    //   message.success('更新商品成功')
    //   this.getProducts(this.pageNum)
    // }
 
    const {products} = this.state
    // console.log(products,newStatus)
    const UpdateProducts = products.map(item => {
        if (item._id === productId) {
            // console.log(item)
            item.status = newStatus
            return item;
        }
        return item
    })
    // console.log(UpdateProducts)
    this.setState({products:UpdateProducts})
   
    message.success('更新商品成功')
  }
    getProducts = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        this.setState({ loading: true })
        const result = await reqProducts();
        this.setState({ loading: false })
        // console.log(result.data);
        if (result.data.status === 0) {
            const { total, list } = result.data.data;
            this.setState({
                total,
                products: list
            })
        }
    }

    getSearchProduct = () =>{
        const {products,searchName} = this.state;
        // console.log(products)//14
        const arr = products.filter((item) => {
            // ES6 新增方法includes
            return item.name.includes(searchName);
        })
        // console.log(arr)//9
        this.setState({
            products:arr,
            total:arr.length
        })
    }

    change = (event) => {
        this.setState({ searchName: event.target.value })
        console.log("change")
        this.getProducts();
    }
    componentDidMount() {
        this.getProducts();
    }
    render() {
        this.initColumns()
        // 取出状态数据
        const { products, total, loading, searchType, searchName } = this.state
        const title = (
            <span>
                <Select
                    value={searchType} //设置下拉框的默认值
                    style={{ width: 150 }}
                    // select的onchange()回调有一个默认的参数是option的value
                    onChange={value =>  this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    // input的onchange()回调的默认参数是event
                    onChange={event => this.change(event)}
                />
                <Button type='primary' onClick={() => this.getSearchProduct()}>搜索</Button>
            </span>
        )

        const extra = (
            // 点击 添加商品，跳转页面到addUpdate
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )


        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    // 分页设置
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: 3,
                        showQuickJumper: true,
                        // onChange: this.getProducts

                    }}
                />
            </Card>
        )
    }
}
