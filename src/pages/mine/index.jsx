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
let level=[{name:'蝇量级',rightsNum:2},{name:'羽量级',rightsNum:2},{name:'轻量级',rightsNum:3},{name:'中量级',rightsNum:4},{name:'重量级',rightsNum:5}]

@frameWork(frameOptions)
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '我的',
    disableScroll: true
  }

  state={
    levelIndex:0,
    clevelIndex:0,
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
      let levelIndex = e.detail.current;
      this.setState({levelIndex})
  }

  render() {
    let { couponCount, levelIndex } = this.state;
    let { userInfo } = this.props.userStore;
    return (
      <View className='page'>
        <View className='container'>
          <NavBar title="我的" background='#05081E' color="#fff" showBack={false} m_page={true} back={this.Return.bind(this)} />
          <View className="wrapper">
            <View className='userMy'>
              <View className="card">
              <Swiper className='scrollview'  circular previous-margin="30rpx" next-margin="30rpx" onChange={this.swipeChange.bind(this)}>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card1.png')} className='imgscroll' />
                  { clevelIndex==0?
                    <View className="Con">
                      <View className="tips">当前等级</View>
                      <View className="levelName">{level[levelIndex].name}会员</View>
                      <View className="txt">{userInfo.exp}/999</View>
                      <View className="txt">还需{999-userInfo.exp}经验值</View>
                      <View className="txt">可升级{level[levelIndex+1].name}</View>
                    </View>:
                    <View className="Con">
                      <View className="tips"></View>
                      <View className="levelName">{level[levelIndex].name}会员</View>
                      <View className="txt">0-999</View>
                    </View>
                  }
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card2.png')} className='imgscroll' />
                  { clevelIndex==1?
                    <View className="Con">
                      <View className="tips">{clevelIndex==1?'当前等级':''}</View>
                      <View className="levelName">{level[levelIndex].name}会员</View>
                      <View className="txt">{userInfo.exp}/1999</View>
                      <View className="txt">还需{1999-userInfo.exp}经验值</View>
                      <View className="txt">可升级{level[levelIndex+1].name}</View>
                    </View>:
                    <View className="Con">
                      <View className="tips"></View>
                      <View className="levelName">{level[levelIndex].name}会员</View>
                      <View className="txt">1000-1999</View>
                    </View>
                  }
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card3.png')} className='imgscroll' />
                  { clevelIndex==2?
                    <View className="Con">
                      <View className="tips">{clevelIndex==2?'当前等级':''}</View>
                      <View className="levelName">{level[levelIndex].name}会员</View>
                      <View className="txt">{userInfo.exp}/3999</View>
                      <View className="txt">还需{3999-userInfo.exp}经验值</View>
                      <View className="txt">可升级{level[levelIndex+1].name}</View>
                    </View>:
                    <View className="Con">
                        <View className="tips"></View>
                        <View className="levelName">{level[levelIndex].name}会员</View>
                        <View className="txt">2000-3999</View>
                    </View>
                  }
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card4.png')} className='imgscroll' />
                  { clevelIndex==2?
                    <View className="Con">
                      <View className="tips">{clevelIndex==3?'当前等级':''}</View>
                      <View className="levelName">{level[levelIndex].name}会员</View>
                      <View className="txt">{userInfo.exp}/6999</View>
                      <View className="txt">还需{6999-userInfo.exp}经验值</View>
                      <View className="txt">可升级{level[levelIndex+1].name}</View>
                    </View>:
                    <View className="Con">
                        <View className="tips"></View>
                        <View className="levelName">{level[levelIndex].name}会员</View>
                        <View className="txt">4000-6999</View>
                    </View>
                  }
                </SwiperItem>
                <SwiperItem className='item'>
                  <Image src={require('../../assets/images/card5.png')} className='imgscroll' />
                  { clevelIndex==2?
                    <View className="Con">
                    <View className="tips">{clevelIndex==4?'当前等级':''}</View>
                    <View className="levelName">{level[levelIndex].name}会员</View>
                    <View className="txt">{userInfo.exp}/>=7000</View>
                    { clevelIndex==4?<View className="txt">已达最高级别</View>:'' }
                    {/*  :<View>
                        <View className="txt">还需999经验值</View>
                        <View className="txt">可升级{level[levelIndex+1].name}</View>
                      </View>*/}
                    }                  
                    </View>:
                    <View className="Con">
                        <View className="tips"></View>
                        <View className="levelName">{level[levelIndex].name}会员</View>
                        <View className="txt">>=7000</View>
                    </View>
                  }
                </SwiperItem>
              </Swiper>
              </View>

              <View className='qyTextAll'>
                <Text className='qyText'>{level[levelIndex].name}会员享<Text className='quanynumber'>{level[levelIndex].rightsNum}项</Text>权益</Text>
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
                  { levelIndex>=2?<Image src={require('../../assets/images/right3.png')} className='quyimg'></Image>
                    :<Image src={require('../../assets/images/right3_a.png')} className='quyimg'></Image>
                  }
                  <Text className='quyitype'>升级礼包</Text>
                </View>
                <View className='quyitypeAll'>
                  { levelIndex>=3?<Image src={require('../../assets/images/right4.png')} className='quyimg'></Image>
                    :<Image src={require('../../assets/images/right4_a.png')} className='quyimg'></Image>
                  }
                  <Text className='quyitype'>活动礼遇</Text>
                </View>
                <View className='quyitypeAll'>
                  { levelIndex>=4?<Image src={require('../../assets/images/right5.png')} className='quyimg'></Image>
                    :<Image src={require('../../assets/images/right5_a.png')} className='quyimg'></Image>
                  }
                  <Text className='quyitype'>巡游礼遇</Text>
                </View>
              </View>
            </View>
            
            <View className="tabCon">
              <View className='tab flexbox'>               
                  <View className='flex-item' onClick={this.openPage.bind(this,'/packageCoupon/pages/coupon/index')}><View className="txt">优惠券</View><View className="num">{couponCount}</View></View>
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
              <View className='naAll' onClick={this.openPage.bind(this,'/pages/story/index')}>
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
