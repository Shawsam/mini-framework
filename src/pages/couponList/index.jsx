import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text } from '@tarojs/components'


export default class Index extends Component {
  config = {

    navigationBarTitleText: '优惠卷',
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

  tocouponInvalid() {
    Taro.redirectTo({
      url: '/pages/couponInvalidList/index'
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
              <View className='mydataAll' onClick={this.tocouponInvalid}>
                <Text className='mytext'>已失效卡券</Text>
                <Image src={require('../../assets/images/toright.png')} mode='aspectFill' className='myImagedata'></Image>
              </View>
            </View>

            <View className='couponListImg'>
              <View className='couponit' onClick={this.tocouponListDetail}>
                <Image src={require('../../assets/images/xjcoupon.png')} mode='aspectFill' className='couponPhoto'></Image>
                <Text className='couponText'><Text className='couponTextr'>￥</Text>20</Text>
                <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
              </View>

              <View className='couponit'>
                <Image src={require('../../assets/images/zdcoupon.png')} mode='aspectFill' className='couponPhoto'></Image>

                <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
              </View>

              <View className='couponit'>
                <Image src={require('../../assets/images/xfcoupon.png')} mode='aspectFill' className='couponPhoto'></Image>
                <Text className='couponTextxf'><Text className='couponTextrxf'>8</Text>折</Text>
                <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
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
