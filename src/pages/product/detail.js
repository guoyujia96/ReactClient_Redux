import React, { Component } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from "@ant-design/icons"

import LinkButton from '../../component/Link-button'
import { reqCategory } from '../../api'


const Item = List.Item
export default class Detail extends Component {

    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId === '0') {
            const result = reqCategory(categoryId)
            const cName1 = result.name
            this.setState({ cName1 })
        } else {
            const results =await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            console.log(results)
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }
    render() {

        // 读取携带过来的state数据
        const { name, desc, price, detail, imgs } = this.props.location.state.product
        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        onClick={() => this.props.history.goBack()}
                        style={{ marginRight: 10, fontSize: 20 }} />


                </LinkButton>

                <span>商品详情</span>
            </span>
        )

        return (
            <Card title={title} className='product-detail'>
                <List className="product-list">
                    <Item style={{ display: 'block' }}>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item style={{ display: 'block' }}>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item style={{ display: 'block' }}>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item style={{ display: 'block' }}>
                        <span className="left">所属分类:</span>
                        <span>{cName1} {cName2 ? ' --> ' + cName2 : ''}</span>
                    </Item>
                    <Item style={{ display: 'block' }}>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={'https://th.bing.com/th/id/R1c85606fdb3be2032d4a6078a29c0877?rik=XFxs%2bPUndOSO%2fw&riu=http%3a%2f%2fpic266.nipic.com%2ffile%2f20200107%2f5577804_153053604082_2.jpg&ehk=XBmBOUnyphSVZ3ceALKFfhcu252CWijnSWGa4SuDNB4%3d&risl=&pid=ImgRaw' + img}
                                        className="product-img"
                                        alt="img"
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item style={{ display: 'block' }}>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}>
                        </span>
                    </Item>

                </List>
            </Card>
        )
    }
}
