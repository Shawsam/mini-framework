import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import orderDetailImg from "../../assets/images/orderDetail.png";
import wechatpay from "../../assets/images/wechatpay.png";
export default class storeList extends Component {
  config = {

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




  Return = () => {

  }
  render() {

    return (
      <View className='page'>

        <View className='container'>

          <View className="wrapper">
            <View className='detailAll'>
              <Text className='titleText'>仅显示最近30天内消费记录</Text>
              <View className='detailImg'>
                <View className='detailtitleTextp'><Text className='detailtitleText'>上海新天地广场店</Text></View>
                <View className='orderdata'>订单信息</View>
                <View className='detailAllText'>
                  <ScrollView
                    className='scrollview'
                    scrollY
                    scrollWithAnimation
                    
                    style='height:150px;'
                    
                  >
                    <View className='orderdataAll'>
                    <View className='detailone'>精酿啤酒</View>
                    <View className='detailTwo'>*1</View>
                    <View className='detailThree'>￥38</View>
                  </View>
                  <View className='orderdataAll'>
                    <View className='detailone'>拳击猫凯撒沙拉千岛酱</View>
                    <View className='detailTwo'>*1</View>
                    <View className='detailThree'>￥38</View>
                  </View>
                  <View className='orderdataAll'>
                    <View className='detailone'>迷你芝士蛋糕</View>
                    <View className='detailTwo'>*1</View>
                    <View className='detailThree'>￥38</View>
                  </View>
                  <View className='orderdataAll'>
                    <View className='detailone'>迷你芝士蛋糕</View>
                    <View className='detailTwo'>*1</View>
                    <View className='detailThree'>￥38</View>
                  </View>
                  </ScrollView>
                  
                </View>

                <View className='orderdataYouHui'>优惠信息</View>
                <View className='orderdataAll'>
                  <View className='detailone'>指定饮品品尝券</View>

                  <View className='detailThree'>￥38</View>
                </View>

                <View className='orderdataYouHui'>总计</View>
                <View>
                  <View className='detailHeJi'>共计4件 合计金额<Text className='detailHeJiMoneydata'>￥95</Text></View>
                </View>


                <View className='orderdatazhifuall'><View className='orderdatazhifu'>支付方式</View><View className='wechatall'><Image src={wechatpay} className='wechat'></Image><Text className='wechatText'>微信支付</Text></View></View>

              </View>


              <View className='underText'>
                <Text>订单编号：123456789</Text>
                <Text>交易编号：123456789</Text>
                <Text>下单时间：2020.05.12 21:30:33</Text>
                <Text>下单门店：上海新天地广场店</Text>
              </View>

              <View className='twobtn'>
                <View className='pinjbig'>评价</View>
                <View className='kaifap'>开发票</View>
              </View>

            </View>



          </View>

        </View>

      </View>
    )
  }
}
