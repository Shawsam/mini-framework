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
    showEightZhe: false,
    showZhid: false,
    showdk:true,
    couponStatus: 1,
    couponContent: '1.使用本券可享受本单8折优惠 \n 2.使用期限：2020.05.12-2020.07.21 \n 3.适用门店：上海拳击猫新天地店/思南店/永 \n 福店/北京金尚店 \n 4.本券仅限每单使用1张 \n 5.本券不可兑换现金 \n 6.本券不可与其他优惠券同时使用 \n 7.拳击猫精酿酒馆保留对此活动的最终解释权',

  }

  componentDidMount() {


  }
  componentWillMount() {

  }
  componentDidShow() {

  }

  toforwardCoupon() {
    Taro.navigateTo({
      url: '/pages/forwardCoupon/index'
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

            {
              this.state.showEightZhe ? (
                <View>
                  <Image src={require('../../assets/images/eightz.png')} mode='aspectFill' className='eightzPhoto'></Image>
                  <View className='coupondetail'>

                    <Text className='couponEightT'>8折消费折扣券</Text>
                    <Text className='couponEightSy'>使用说明</Text>

                    <ScrollView
                      className='scrollview'
                      scrollY
                      scrollWithAnimation
                      style='height:280px'
                    >
                      <View className='couponContentData'><Text className='couponEightCt'>{this.state.couponContent}</Text></View>
                    </ScrollView>


                    {this.state.couponStatus == 1 && <View className="SYbtn"><Text className="coLiJ">立即使用</Text><Text className="ZHyou" onClick={this.toforwardCoupon}>转赠好友</Text></View>}
                    {this.state.couponStatus == 2 && <View className="SYbtn"><Text className="ZHyoustatus">转赠好友中...</Text></View>}

                  </View>

                </View>
              ) : null
            }

            {
              this.state.showZhid ? (
                <View>
                  <Image src={require('../../assets/images/xj.png')} mode='aspectFill' className='eightzPhoto'></Image>
                  <View className='coupondetail'>

                    <Text className='couponEightT'>指定饮品免费品尝</Text>
                    <Text className='couponEightSy'>使用说明</Text>

                    <ScrollView
                      className='scrollview'
                      scrollY
                      scrollWithAnimation
                      style='height:280px'
                    >
                      <View className='couponContentData'><Text className='couponEightCt'>{this.state.couponContent}</Text></View>
                    </ScrollView>

                    {this.state.couponStatus == 1 && <View className="SYbtn"><Text className="coLiJ">立即使用</Text><Text className="ZHyou" onClick={this.toforwardCoupon}>转赠好友</Text></View>}
                    {this.state.couponStatus == 2 && <View className="SYbtn"><Text className="ZHyoustatus">转赠好友中...</Text></View>}

                  </View>

                </View>
              ) : null
            }


            {
              this.state.showdk ? (
                <View>
                  <Image src={require('../../assets/images/dk.png')} mode='aspectFill' className='eightzPhoto'></Image>
                  <View className='coupondetail'>

                    <Text className='couponEightT'>20元现金抵扣券</Text>
                    <Text className='couponEightSy'>使用说明</Text>

                    <ScrollView
                      className='scrollview'
                      scrollY
                      scrollWithAnimation
                      style='height:280px'
                    >
                      <View className='couponContentData'><Text className='couponEightCt'>{this.state.couponContent}</Text></View>
                    </ScrollView>

                    {this.state.couponStatus == 1 && <View className="SYbtn"><Text className="coLiJ">立即使用</Text><Text className="ZHyou" onClick={this.toforwardCoupon}>转赠好友</Text></View>}
                    {this.state.couponStatus == 2 && <View className="SYbtn"><Text className="ZHyoustatus">转赠好友中...</Text></View>}

                  </View>

                </View>
              ) : null
            }


          </View>
          {/* <TabBar selected={1} /> */}
        </View>
        {/* } */}
      </View>
    )
  }
}
