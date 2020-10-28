import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import xiaoquanquan from "../../assets/images/xiaoquanquan.png";
import xcq from "../../assets/images/xcq.png";
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '积分明细',
    disableScroll: true
  }

  state = {
    current: 1
  }

  componentDidMount() {

  }
  componentWillMount() {

  }
  componentDidShow() {

  }



  switchs(e) {
    let index = parseInt(e.currentTarget.dataset.item)
    console.log(index)

    this.setState({
      current: index,

    })
    //this.couponList()

  }
  toPointMall() {
    Taro.redirectTo({
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

            <View className='pointmall'>
              <View className='pointdata'>
                <Text className='pointql'>拳力值：</Text>
                <View className='pointone'>
                  <View>
                    <Image src={xiaoquanquan} className='xiaoquanquan'></Image>
                    <Text className='pointqlnumber'>1024</Text></View>
                  <View className='pointtextdh' onClick={this.toPointMall}><Text className='pointdh'>去兑换</Text></View>

                </View>
              </View>

            </View>

            <View className='pointmallyellow'>
              <View className='xcqcssAll'> <Image src={xcq} className='xcqcss'></Image>
                <Text className='xcqtext'>积分促销活动即将开始，部分商品积分减半兑换</Text></View>

            </View>

            <View className='twotype'>
              <Text onClick={this.switchs} className={current == 1 ? "mxql" : "mxqlnomal"} data-item='1'>拳力值新增</Text>
              <Text onClick={this.switchs} className={current == 2 ? "mxql" : "mxqlnomal"} data-item='2'>拳力值使用</Text>


            </View>

            {
              this.state.current == 1 ? (

                <View className='textan'>
                  <View className='mxlist'>
                    <View className='mxlixf'>
                      <Text className='mxnumber'>+10</Text>
                      <Text className='mxnumberzs'>消费赠送</Text>
                    </View>
                    <View className='mxtime'>2020.08.02</View>
                  </View>


                  <View className='mxlist'>
                    <View className='mxlixf'>
                      <Text className='mxnumber'>+10</Text>
                      <Text className='mxnumberzs'>消费赠送</Text>
                    </View>
                    <View className='mxtime'>2020.08.02</View>
                  </View>
                </View>
              ) : null

            }

            {
              this.state.current == 2 ? (

                <View className='textanr'>
                  <View className='mxlist'>
                    <View className='mxlixf'>
                      <Text className='mxnumberhui'>-10</Text>
                      <Text className='mxnumberzs'>兑换消费</Text>
                    </View>
                    <View className='mxtime'>2020.08.02</View>
                  </View>


                  <View className='mxlist'>
                    <View className='mxlixf'>
                      <Text className='mxnumberhui'>-10</Text>
                      <Text className='mxnumberzs'>兑换消费</Text>
                    </View>
                    <View className='mxtime'>2020.08.02</View>
                  </View>
                </View>
              ) : null

            }




          </View>


        </View>

      </View>
    )
  }
}
