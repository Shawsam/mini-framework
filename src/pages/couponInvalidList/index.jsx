import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text } from '@tarojs/components'


export default class Index extends Component {
  config = {

    navigationBarTitleText: '我的失效优惠卷',
    disableScroll: true
  }

  state = {
    // isLoading:false,
    // title:'首页'

  }

  componentDidMount() {


  }
  componentWillMount() {

  }
  componentDidShow() {

  }

  tocouponListDetail() {
    Taro.navigateTo({
      url: '/pages/couponListDetail/index'
    })
  }

  tocouponList() {
    Taro.redirectTo({
      url: '/pages/couponList/index'
    })
  }


  Return = () => {

  }
  render() {
    //this.state.beerListActive.length = 2
    // let { isLoading,title } = this.state;
    return (
      <View className='page'>
        {/* { isLoading?<Loading/>: */}
        <View className='container'>
          {/* <NavBar logo={true} title={title} showBack={false} color="#000" background="rgba(0,0,0,0)" m_page={true} back={this.Return.bind(this)} /> */}
          <View className="wrapper">
            <View className='shixiaoPhoto'>
              {/* <Image src={require('../../assets/images/shixiao.png')} mode='aspectFill' ></Image> */}
              <View className='mydataAll' onClick={this.tocouponList}>
                <Text className='mytext'>我的优惠券</Text>
                <Image src={require('../../assets/images/toright.png')} mode='aspectFill' className='myImagedata'></Image>
              </View>
            </View>
            <View className='couponListImg'>
              <View className='couponit' onClick={this.tocouponListDetail}>
                <Image src={require('../../assets/images/xjcouponHui.png')} mode='aspectFill' className='couponPhoto'></Image>
                <Text className='couponText'><Text className='couponTextr'>￥</Text>20</Text>
                <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                <Text className='couponStatus'>已使用</Text>
              </View>

              <View className='couponit'>
                <Image src={require('../../assets/images/zdcouponHui.png')} mode='aspectFill' className='couponPhoto'></Image>
                <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                <Text className='couponStatus'>已过期</Text>
              </View>

              <View className='couponit'>
                <Image src={require('../../assets/images/xfcouponHui.png')} mode='aspectFill' className='couponPhoto'></Image>
                <Text className='couponTextxf'><Text className='couponTextrxf'>8</Text>折</Text>
                <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                <Text className='couponStatus'>已转赠</Text>
              </View>
            </View>

          </View>
          {/* <TabBar selected={1} /> */}
        </View>
        {/* } */}
      </View>
    )
  }
}
