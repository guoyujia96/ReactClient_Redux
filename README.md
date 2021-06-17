<Switch>标签标识只匹配一个

1.维持登录与自动登录
    登录后保存用户数据到内存和local
    app在渲染前，先从local读用户数据并保存在内存中，login界面的render调用的时候先读取内存中是否有username和password，有则直接跳转到主界面，没有则显示登录界面s
2.请求登录时返回的data中必须包含_id吗？ 不然登录了不跳转

3.如何向事件回调函数传递参数：先定义一个匿名函数，在函数体中调用处理函数并传入参数
    <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton>
4.修改分类的form表达，给imput设置value不显示，给Item设置initialValue和给input设置defaultValue只赋值一次
 解决办法：item的name也动态赋值，使得组件再次渲染

5.addUpdate 
    1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
    2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
6.表单验证
    validateFields 会返回 Promise 对象，因而你可以通过 async/await 或者 then/catch 来执行对应的错误处理。不再需要判断 errors 是否为空：

##### 优化
1.分页获取后台数据展示
2.使用PureCompoent代替Component，避免了父组件渲染引起子组件渲染以及setState为发生改变而引起的渲染

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */