import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import location from "../../assets/images/loaction.png";
import storeImg from "../../assets/images/storeimgtwo.png";
import xcqImg from "../../assets/images/xcq.png";
import NavBar from '../../components/NavBar';
import TabBar from '../../components/TabBar';

export default class storeList extends Component {
  config = {

    disableScroll: true
  }

  state = {
    storeNearList: [
     {
       title: 'Boxing Cat Brewery XTD 拳击猫精酿啤酒馆(新天地旗舰店)',
       address: '上海太仓路181弄新天地北里1层19号',
       phone: '021-6426-0360',
       time: '周一到周日11AM – 1:30 AM',
       image: 'https://mj-obs.obs.myhwclouds.com/160437383516120190802LR00099.jpg'
     },
     {
      title: 'Boxing Cat Brewery Sinan 拳击猫精酿啤酒馆(思南公馆店)',
      address: '思南公馆 26A单元 黄浦区复兴中路 519号',
      phone: '021-6426-0360',
      time: '周一到周四 ： 下午五点-凌晨2点， 周五： 下午三点-凌晨2点， 周六-周日：上午10点-凌晨两点',
      image: 'https://mj-obs.obs.myhwclouds.com/1604373824962boxing-2.jpg'
    },
    {
      title: 'Boxing Cat Brewery Yongfu 拳击猫精酿啤酒馆(永福店)',
      address: '徐汇区复兴西路82号',
      phone: '021-6431-2091',
      time: '周一到周四 ： 下午五点-凌晨2店， 周五： 下午三点-凌晨2点， 周六-周日：上午10点-凌晨两点',
      image: 'https://mj-obs.obs.myhwclouds.com/160437380009320190416LR06420.jpg'
    },
    {
      title: 'Boxing Cat Brewery Beijing 拳击猫精酿啤酒馆(北京)',
      address: '北京市朝阳区新源里西20号楼金尚首层109单元',
      phone: '010-6461-6737',
      time: '周一到周四/周日 ： 上午11：30-凌晨1点， 周五-周六：上午11：30点-凌晨两点',
      image: 'https://mj-obs.obs.myhwclouds.com/1604373814965boxing-cat-1.jpg'
    },
    ],
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
          <NavBar title="附近的门店" background='#F4F5F6' showBack={false} m_page={true} back={this.Return.bind(this)} />
          <View className="wrapper">
            <View className='storeList'>
              <View className='storeListText'>
                <Text>我附近的门店</Text>
              </View>

              {

                this.state.storeNearList.map((v,k) => {

                  return (
                    <View className='listdata'>
                      <View className='storeAll'>
                        <View>
                        <Image src={v.image} className='storeImg' mode='aspectFill'></Image>

                        </View>
                        <View className='storeTextData'>
                          <Text className='storeTitle'>{v.title}</Text>
                          <Text className='storeAddress'>{v.address}</Text>
                          <Text className='storeAddress'>{v.phone}</Text>
                          <Text className='storeTime storeTime-padding'>{v.time}</Text>
                        </View>
                      </View>
                      <View className='xcqAll'><Image src={xcqImg} className='xcq'></Image><View className='xcqText'>指定精酿啤酒 限时特惠 买一送一</View></View>

                    </View>

                  )
                })
              }

            </View>

          </View>
          <TabBar selected={1} />

        </View>

      </View>
    )
  }
}
