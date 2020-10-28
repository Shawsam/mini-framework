import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text,ScrollView } from '@tarojs/components'


export default class Index extends Component {
  config = {
    navigationStyle: 'custom',

    disableScroll: true
  }

  state = {
    couponContent: '1.使用本券可享受本单8折优惠 \n 2.使用期限：2020.05.12-2020.07.21 \n 3.适用门店：上海拳击猫新天地店/思南店/永 \n 福店/北京金尚店 \n 4.本券仅限每单使用1张 \n 5.本券不可兑换现金 \n 6.本券不可与其他优惠券同时使用 \n 7.拳击猫精酿酒馆保留对此活动的最终解释权',
  }

  componentDidMount() {

  }
  componentWillMount() {

  }
  componentDidShow() {

  }


  Return = () => {

  }
  render() {

    return (
      <View className='page'>

        <View className='container'>

          <View className="wrapper">
            <View className=''>
              <Image src={require('../../assets/images/zzbac.png')} mode='aspectFill' className='zzbacPhoto'></Image>
              <View className='forwardContent'>
                <Image src={require('../../assets/images/avatar.png')} mode='aspectFill' className='avaPhoto'></Image>
                <Text className='forwardText'>胡文辉 <Text className='forwardTextsong'>送你一张优惠券</Text></Text>

                <View className='couponit' onClick={this.tocouponListDetail}>
                  <Image src={require('../../assets/images/xjcoupon.png')} mode='aspectFill' className='couponPhoto'></Image>
                  <Text className='couponText'><Text className='couponTextr'>￥</Text>20</Text>
                  <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                </View>

                <View className='lijget'>立即使用</View>

              </View>

              {/* <ScrollView
                className='scrollview'
                scrollY
                scrollWithAnimation
                style='height:80px'
              >
                <View className='shiget'>
                  <Text className='shiText'>使用说明</Text>
                  <Text className='shiTextcontent'>{this.state.couponContent}</Text>
                </View>
              </ScrollView> */}
            </View>
          </View>

        </View>

      </View>
    )
  }
}
