import './index.scss'
import TabBar from '../../components/TabBar';
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import orderimg from "../../assets/images/orderimg.png";

export default class storeList extends Component {
  config = {
    navigationBarTitleText: '订单',
    disableScroll: true
  }

  state = {
    storeNearList: [1, 2],
    storeMoreList: [1, 2]
  }

  componentDidMount() {

  }
  componentWillMount() {

  }
  componentDidShow() {

  }

  toOrderDetail(){
    Taro.navigateTo({
      url: '/pages/orderDetail/index'
    })
  }


  Return = () => {

  }
  render() {

    return (
      <View className='page'>

        <View className='container'>

          <View className="wrapper">
            <View className='orderTextAll'>
             <Text className='orderTextm'>门店订单</Text>  
             <Text className='orderText'>商城订单</Text>
             <Text className='orderText'>周边商品</Text>
            </View>
            <View className='orderimgAll' onClick={this.toOrderDetail}>
              {/* <Image src={orderimg} className='orderimg'></Image> */}
              <View className='orderimgText'>
              <Text className='orderAddress'>上海新天地广场店</Text>
              <Text className='orderTime'>下单时间：2020.05.12 21:30:33</Text>
              <View className='orderMoneyflex'>
              <Text className='orderMoney'>实付：<Text className='orderMoneyRed'>￥103.00</Text></Text>
              <Text className='pinj'>评价</Text>
              <Text className='kfp'>开发票</Text>
              </View>
              
              </View>
              
            </View>

            <View className='orderimgAll'>
              {/* <Image src={orderimg} className='orderimg'></Image> */}
              <View className='orderimgText'>
              <Text className='orderAddress'>上海新天地广场店</Text>
              <Text className='orderTime'>下单时间：2020.05.12 21:30:33</Text>
              <View className='orderMoneyflex'>
              <Text className='orderMoney'>实付：<Text className='orderMoneyRed'>￥103.00</Text></Text>
              <Text className='pinj'>评价</Text>
              <Text className='kfp'>开发票</Text>
             
              
              </View>
              
              </View>
              
            </View>
          </View>
          <TabBar selected={1} />

        </View>

      </View>
    )
  }
}
