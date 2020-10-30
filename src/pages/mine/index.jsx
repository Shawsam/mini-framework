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
let disableOnshow = false, isFirstShow = true, pageData, shopId;

@frameWork(frameOptions)
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '我的',
    disableScroll: true
  }

  state={
    cardIndex:0,
    couponCount:0
  }

  userInfoReady(){
    this.fetchCouponCount();
  }

  fetchCouponCount(){
      Api.fetchCouponCount().then(res=>{
          this.setState({couponCount:this.formatNumber(res.data)});
      }).catch(err=>{
          console.log(err);
          Taro.showModal({  content:err.msg,
                            showCancel:false,
                            success:()=>{
                                this.fetchCouponCount()
                            }
                         })
      });
  }

  swipeChange(e){
      let cardIndex = e.detail.current;
      this.setState({cardIndex})
  }

  render() {
    let { couponCount, cardIndex } = this.state;
    let { userInfo } = this.props.userStore;
    return (
      <View className='page'>

        <View className='container'>

          <View className="wrapper">
            <View className='userMy'>
              <View className="card">
              <Swiper className='scrollview'  circular previous-margin="30rpx" next-margin="30rpx" onChange={this.swipeChange.bind(this)}>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card1.png')} className='imgscroll' />
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card2.png')} className='imgscroll' />
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card3.png')} className='imgscroll' />
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card4.png')} className='imgscroll' />
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card5.png')} className='imgscroll' />
                </SwiperItem>
              </Swiper>
              </View>

              <View className='qyTextAll'>
                <Text className='qyText'>蝇量级会员享<Text className='quanynumber'>{cardIndex+1<2?2:cardIndex+1}项</Text>权益</Text>
{/*                <Text className='qyTexttwo'>收起</Text>*/}
              </View>

              <View className='quyiAllLogo'>
                <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/right1.png')} className='quyimg'></Image>
                  <Text className='quyitype'>生日礼遇</Text>
                </View>
                <View className='quyitypeAll'>
                  <Image src={require('../../assets/images/right2.png')} className='quyimg'></Image>
                  <Text className='quyitype'>入会礼包</Text>
                </View>
                <View className='quyitypeAll'>
                  { cardIndex>=2?<Image src={require('../../assets/images/right3.png')} className='quyimg'></Image>
                    :<Image src={require('../../assets/images/right3_a.png')} className='quyimg'></Image>
                  }
                  <Text className='quyitype'>升级礼包</Text>
                </View>
                <View className='quyitypeAll'>
                  { cardIndex>=3?<Image src={require('../../assets/images/right4.png')} className='quyimg'></Image>
                    :<Image src={require('../../assets/images/right4_a.png')} className='quyimg'></Image>
                  }
                  <Text className='quyitype'>活动礼遇</Text>
                </View>
                <View className='quyitypeAll'>
                  { cardIndex>=4?<Image src={require('../../assets/images/right5.png')} className='quyimg'></Image>
                    :<Image src={require('../../assets/images/right5_a.png')} className='quyimg'></Image>
                  }
                  <Text className='quyitype'>巡游礼遇</Text>
                </View>
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
              <View className='naAll' onClick={this.openPage.bind(this,'/pages/userInfo/index')}>
                <Text className='naText'>个人资料</Text>
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
