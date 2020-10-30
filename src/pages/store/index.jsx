import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import location from "../../assets/images/loaction.png";
import storeImg from "../../assets/images/storeimgtwo.png";
import xcqImg from "../../assets/images/xcq.png";
import NavBar from '../../components/NavBar';
import TabBar from '../../components/TabBar';

export default class storeList extends Component {
  config ={
      navigationBarTitleText:'附近的门店',
      disableScroll:true,
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
                <Text>我附近的门店(30Km)</Text>
                <View><Image src={location} className='locationImg'></Image>
                  <Text>上海</Text></View>
              </View>

              {

                this.state.storeNearList.map(() => {

                  return (
                    <View className='listdata'>
                      <View className='storeAll'>
                        <Image src={storeImg} className='storeImg' mode='aspectFill'></Image>
                        <View className='storeTextData'>
                          <Text className='storeTitle'>Boxing Cat Brewery拳击猫精酿啤酒馆(新天地旗舰店)</Text>
                          <Text className='storeAddress'>上海市黄浦区太仓路181弄18号</Text>
                          <Text className='storeTime'>11:00-01:30</Text>
                        </View>
                      </View>
                      <View className='xcqAll'><Image src={xcqImg} className='xcq'></Image><Text className='xcqText'>指定精酿啤酒 限时特惠 买一送一</Text></View>

                    </View>

                  )
                })
              }




              <View className='storeListTextMore'>
                <Text>更多门店</Text>

              </View>
              {

                this.state.storeMoreList.map(() => {

                  return (
                    <View className='listdata'>
                      <View className='storeAll'>
                        <Image src={storeImg} className='storeImg' mode='aspectFill'></Image>
                        <View className='storeTextData'>
                          <Text className='storeTitle'>Boxing Cat Brewery拳击猫精酿啤酒馆(新天地旗舰店)</Text>
                          <Text className='storeAddress'>上海市黄浦区太仓路181弄18号</Text>
                          <Text className='storeTime'>11:00-01:30</Text>
                        </View>
                      </View>
                      <View className='xcqAll'><Image src={xcqImg} className='xcq'></Image><Text className='xcqText'>指定精酿啤酒 限时特惠 买一送一</Text></View>

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
