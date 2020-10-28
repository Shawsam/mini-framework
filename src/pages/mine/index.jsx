import './index.scss'
import TabBar from '../../components/TabBar';
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import scrollbanner from "../../assets/images/scrollbanner.png";
import quanyi from "../../assets/images/quanyi.png";
import to from "../../assets/images/to.png";
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '我的',
    disableScroll: true
  }

  state = {

  }

  componentDidMount() {

  }
  componentWillMount() {

  }
  componentDidShow() {

  }

  toMyOrder() {
    Taro.navigateTo({
      url: '/pages/order/index'
    })
  }
  toPointMall() {
    Taro.navigateTo({
      url: '/pages/pointsMall/index'
    })
  }


  Return = () => {

  }
  render() {

    return (
      <View className='page'>

        <View className='container'>

          <View className="wrapper">
            <View className='userMy'>
              <ScrollView
                className='scrollview'
                scrollX='true'
                scrollWithAnimation



              >
                <View className='imgscrollAll'>
                  <Image src={scrollbanner} className='imgscroll' mode='aspectFill'></Image>
                  <Image src={scrollbanner} className='imgscroll' mode='aspectFill'></Image>
                </View>

              </ScrollView>

              <View className='qyTextAll'>
                <Text className='qyText'>蝇量级会员享<Text className='quanynumber'>2</Text>项权益</Text>
                <Text className='qyTexttwo'>展开</Text>
              </View>

              <View className='quyiAllLogo'>
                <View className='quyitypeAll'>
                  <Image src={quanyi} className='quyimg'></Image>
                  <Text className='quyitype'>权益一</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={quanyi} className='quyimg'></Image>
                  <Text className='quyitype'>权益一</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={quanyi} className='quyimg'></Image>
                  <Text className='quyitype'>权益一</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={quanyi} className='quyimg'></Image>
                  <Text className='quyitype'>权益一</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={quanyi} className='quyimg'></Image>
                  <Text className='quyitype'>权益一</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={quanyi} className='quyimg'></Image>
                  <Text className='quyitype'>权益一</Text>
                </View>
              </View>



            </View>

            <View className='youquanAll'>
              {/* <Image src={youquan} className='youquanimg' mode='aspectFill'></Image> */}
              <View className='youquanimg'>
                <Text className='yhjdata'>12</Text>
                <Text className='qlzdata'>1024</Text>
              </View>
            </View>

            <View className='nama'>
              <View className='naAll' onClick={this.toMyOrder}>
                <Text className='naText'>我的订单</Text>
                <Image src={to} className='naImg'></Image>
              </View>
              <View className='naAll' onClick={this.toPointMall}>
                <Text className='naText'>任务中心</Text>
                <Image src={to} className='naImg'></Image>
              </View>
              <View className='naAll'>
                <Text className='naText'>个人资料</Text>
                <Image src={to} className='naImg'></Image>
              </View>
              <View className='naAll'>
                <Text className='naText'>品牌故事</Text>
                <Image src={to} className='naImg'></Image>
              </View>
            </View>


          </View>
          <TabBar selected={2} />

        </View>

      </View>
    )
  }
}
