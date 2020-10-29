import './index.scss';
import classNames from 'classnames';
import {Text, View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';
import frameWork  from '../../common/decorator/frameWork';
import Api from '../../common/api';
import Loading from '../../components/Loading';
import NavBar from '../../components/NavBar';
import TabBar from '../../components/TabBar';
import Authorize from '../../components/Authorize';
import Register from '../../components/Register';

const Env = Taro.getEnv();
const frameOptions = {
  userInfoCached:false,
  loadToAuthorize:false
}
let disableOnshow = false, isFirstShow = true, userInfoCache = {}, pageData, shopId;

@frameWork(frameOptions)
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '我的',
    disableScroll: true
  }

  state = {
      couponCount:'0'
  }

  render() {
    let { couponCount } = this.state;
    let { userInfo } = this.props.userStore;
    return (
      <View className='page'>

        <View className='container'>

          <View className="wrapper">
            <View className='userMy'>
              <ScrollView className='scrollview' scrollX='true' scrollWithAnimation>
                <View className='imgscrollAll'>
                  <Image src={require('../../assets/images/scrollbanner.png')} className='imgscroll' mode='aspectFill'></Image>
                  <Image src={require('../../assets/images/scrollbanner.png')} className='imgscroll' mode='aspectFill'></Image>
                </View>
              </ScrollView>

              <View className='qyTextAll'>
                <Text className='qyText'>蝇量级会员享<Text className='quanynumber'>4项</Text>权益</Text>
{/*                <Text className='qyTexttwo'>收起</Text>*/}
              </View>

              <View className='quyiAllLogo'>
                <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/quanyi.png')} className='quyimg'></Image>
                  <Text className='quyitype'>权益一</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/quanyi.png')} className='quyimg'></Image>
                  <Text className='quyitype'>权益二</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/quanyi.png')} className='quyimg'></Image>
                  <Text className='quyitype'>权益三</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/quanyi.png')} className='quyimg'></Image>
                  <Text className='quyitype'>权益四</Text>
                </View>
{/*             <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/quanyi.png')} className='quyimg'></Image>
                  <Text className='quyitype'>权益五</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/quanyi.png')} className='quyimg'></Image>
                  <Text className='quyitype'>权益六</Text>
                </View>*/}
              </View>
            </View>
            
            <View className="tabCon">
              <View className='tab flexbox'>               
                  <View className='flex-item' onClick={this.openPage.bind(this,'/pages/coupon/index')}><View className="txt">优惠券</View><View className="num">{couponCount}</View></View>
                  <View className='flex-item' onClick={this.openPage.bind(this,'/pages/pointsMall/index')}><View className="txt">拳力值</View><View className="num">{userInfo.point>=0?userInfo.point:'--'}</View></View>
                  <View className='rect'></View>
              </View>
               <Image src={require('../../assets/images/cat.png')} className='cat' mode='aspectFill'></Image>
            </View>

            <View className='nama'>
              <View className='naAll' onClick={this.openPage.bind(this,'/pages/order/index')}>
                <Text className='naText'>我的订单</Text>
                <Image src={require('../../assets/images/to.png')} className='naImg'></Image>
              </View>
  {/*            <View className='naAll' onClick={this.toPointMall}>
                <Text className='naText'>任务中心</Text>
                <Image src={require('../../assets/images/to.png')} className='naImg'></Image>
              </View>*/}
              <View className='naAll'>
                <Text className='naText' onClick={this.openPage.bind(this,'/pages/userInfo/index')}>个人资料</Text>
                <Image src={require('../../assets/images/to.png')} className='naImg'></Image>
              </View>
              <View className='naAll'>
                <Text className='naText'>品牌故事</Text>
                <Image src={require('../../assets/images/to.png')} className='naImg'></Image>
              </View>
            </View>


          </View>
          <TabBar selected={2} />

        </View>

      </View>
    )
  }
}
