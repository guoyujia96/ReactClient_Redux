import React from "react"
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts"
import DataSet from "@antv/data-set"


// 数据源
const data = [
  {
    month: "Jan",
    city: "a",
    temperature: 7
  },
  {
    month: "Jan",
    city: "b",
    temperature: 3.9
  },
  {
    month: "Feb",
    city: "a",
    temperature: 6.9
  },
  {
    month: "Feb",
    city: "b",
    temperature: 4.2
  },
  {
    month: "Mar",
    city: "a",
    temperature: 9.5
  },
  {
    month: "Mar",
    city: "b",
    temperature: 5.7
  },
  {
    month: "Apr",
    city: "a",
    temperature: 14.5
  },
  {
    month: "Apr",
    city: "b",
    temperature: 8.5
  },
  {
    month: "May",
    city: "a",
    temperature: 18.4
  },
  {
    month: "May",
    city: "b",
    temperature: 11.9
  },
  {
    month: "Jun",
    city: "a",
    temperature: 21.5
  },
  {
    month: "Jun",
    city: "b",
    temperature: 15.2
  },
  {
    month: "Jul",
    city: "a",
    temperature: 25.2
  },
  {
    month: "Jul",
    city: "b",
    temperature: 17
  },
  {
    month: "Aug",
    city: "a",
    temperature: 26.5
  },
  {
    month: "Aug",
    city: "b",
    temperature: 16.6
  },
  {
    month: "Sep",
    city: "a",
    temperature: 23.3
  },
  {
    month: "Sep",
    city: "b",
    temperature: 14.2
  },
  {
    month: "Oct",
    city: "a",
    temperature: 18.3
  },
  {
    month: "Oct",
    city: "b",
    temperature: 10.3
  },
  {
    month: "Nov",
    city: "a",
    temperature: 13.9
  },
  {
    month: "Nov",
    city: "b",
    temperature: 6.6
  },
  {
    month: "Dec",
    city: "a",
    temperature: 9.6
  },
  {
    month: "Dec",
    city: "b",
    temperature: 4.8
  }
];

export default class Line extends React.Component {
  render() {
    
    const ds = new DataSet()
    const dv = ds.createView().source(data)
    dv.transform({
      type: "fold",
      fields: ["a", "b", "c"],
      // 展开字段集
      key: "city",
      // key字段
      value: "temperature" // value字段
    })
    const cols = {
      month: {
        range: [0, 1]
      }
    }
    return (
      <div style={{float: 'right', width: 650, height: 132}}>
        <Chart height={250} data={data} scale={this.cols} autoFit onAxisLabelClick={console.log}>
          <Legend/>
          <Axis name="month"/>
          <Axis
            name="temperature"
            label={{
              formatter: val => `${val}万个`
            }}
          />
          {/* 提示信息：是指当鼠标悬停在图表上的某点时，以提示框的形式展示该点的数据，比如该点的值，数据单位等 */}
          <Tooltip
            crosshairs={{
              type: "y"
            }}
            itemTpl={`
              <tr data-index={index}>'
                <td><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span></td>
                <td>{name}</td>
                <td>{value}</td>
              </tr>
           `}

          >
					 {
						 (title, items) => {
							 // 配置了 class="g2-tooltip-list" 则会将模版中的内容渲染进来
							 // 您也可以根据 items 自行渲染
							 return (<table>
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th>名称</th>
										<th>值</th>
									</tr>
								</thead>
									<tbody
										class="g2-tooltip-list"
									>
								</tbody>
            		</table>);
						 }
					 }
					</Tooltip>
          <Geom
            type="line"
            position="month*temperature"
            size={2}
            color={"city"}
            shape={"smooth"}
          />
          <Geom
            type="point"
            position="month*temperature"
            size={4}
            shape={"circle"}
            color={"city"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    )
  }
}
