import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import xiaoquanquan from "../../assets/images/xiaoquanquan.png";
import xcq from "../../assets/images/xcq.png";
import beer from "../../assets/images/beer.png";
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '积分商城',
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

  openPage(url,e){
      Taro.navigateTo({url})
  }

  render() {

    return (
      <View className='page'>

        <View className='container'>

          <View className="wrapper">

            <View className='pointmall'>
              <View className='pointdata'>
                <Text className='pointql'>拳力值：</Text>
                <View className='pointone'>
                  <View>
                    <Image src={xiaoquanquan} className='xiaoquanquan'></Image>
                    <Text className='pointqlnumber'>1024</Text></View>
                  <View className='pointtextdh' onClick={this.openPage.bind(this,'/pages/pointsDetail/index')}><Text className='pointdh'>明细</Text></View>

                </View>
              </View>

            </View>

            <View className='pointmallyellow'>
              <View className='xcqcssAll'> <Image src={xcq} className='xcqcss'></Image>
                <Text className='xcqtext'>积分促销活动即将开始，部分商品积分减半兑换</Text></View>

            </View>

            <View className='fivetype'>
              <Text className='fivetext'>全部</Text>
              <Text className='fivetextnomal'>门店礼券</Text>
              <Text className='fivetextnomal'>服饰周边</Text>
              <Text className='fivetextnomal'>啤酒周边</Text>
              <Text className='fivetextnomal'>宠物周边</Text>
            </View>

            <View className='typedatapb'>
            <View className='typedata'>
              <View className='typedataimgk'><Image src={beer} className='typedataimg' mode='aspectFill'></Image></View>
              <View className='typetwotext'>
                <Text className='typet'>搏击者兑换券</Text>
                <Text className='typetw'><Text className='typetwnumber'>50</Text>拳力值</Text>
              </View>
            </View>
            <View className='typedata'>
              <View className='typedataimgk'><Image src={beer} className='typedataimg' mode='aspectFill'></Image></View>
              <View className='typetwotext'>
                <Text className='typet'>搏击者兑换券</Text>
                <Text className='typetw'><Text className='typetwnumber'>199</Text>拳力值</Text>
              </View>
            </View>
            <View className='typedata'>
              <View className='typedataimgk'><Image src={beer} className='typedataimg' mode='aspectFill'></Image></View>
              <View className='typetwotext'>
                <Text className='typet'>搏击者兑换券</Text>
                <Text className='typetw'><Text className='typetwnumber'>50</Text>拳力值</Text>
              </View>
            </View>
            <View className='typedata'>
              <View className='typedataimgk'><Image src={beer} className='typedataimg' mode='aspectFill'></Image></View>
              <View className='typetwotext'>
                <Text className='typet'>搏击者兑换券</Text>
                <Text className='typetw'><Text className='typetwnumber'>50</Text>拳力值</Text>
              </View>
            </View>
            </View>

            

          </View>


        </View>

      </View>
    )
  }
}
