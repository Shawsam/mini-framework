import './index.scss';
import classNames from 'classnames';
import {Text, View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';
import frameWork  from '../../common/decorator/frameWork';
import Api from '../../api';
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
export default class Index extends Component {
  config = {
    navigationStyle: 'custom',
    disableScroll: true
  }

  state = {
    isLoading:false,
    couponCount:'00',
    beerNumber: 1,
    showQrPanel: false
  }

  PidReady(){
    
  }

  showQrPanel(){
      this.interceptShowAuthorize().then(()=>{
          this.setState({showQrPanel:!this.state.showQrPanel})
      }).catch(err=>{
          console.log(err);
      })
  } 



  openPage(url,e){
      e.stopPropagation();
      this.interceptShowAuthorize().then(()=>{
          Taro.navigateTo({url})
      }).catch(err=>{
          console.log(err);
      })
  }


   

  render() {
    let { isLoading, couponCount, beerNumber } = this.state;
    let { userInfo } = this.props.userStore;
    return (
      <View className='page'>
        { isLoading?<Loading/>:
          <View className='container'>
            <View className="wrapper">
              {
                this.state.showQrPanel ? (
                  <View className='qrAll'>
                    <View className='qrUserInfo'>
                      <Image src={userInfo.avatarUrl} mode='aspectFill' className='avaphotoPhotoQR'></Image>
                      <Image src={require('../../assets/images/qrqr.png')} mode='aspectFill' className='qrqrPhoto'></Image>
                      <Text className='qrmiao'>二维码30秒自动刷新</Text>
                    </View>
                    <View className='closeAll'>
                      <View className='closeText'>门店消费时请出示给店员进行扫码， 获取您的积分权益。</View>
                      <Image src={require('../../assets/images/closetc.png')} mode='aspectFill' onClick={this.showQrPanel} className='closetcPhoto'></Image>
                    </View>
                  </View>
                ) : null
              }

              <View className='bannerIndex'>
                <Image src={require('../../assets/images/banner.png')} mode='aspectFill' className='bannerPhoto'></Image>
              </View>

              {/* 用户信息 */}
              <View className='avaAll'>
                <Image src={userInfo.avatarUrl} mode='aspectFill' className='avaphotoPhoto'></Image>
                <View className='avaList'>
                  <View>
                    <Text className='userName'>{userInfo.nickName||'点击授权'}</Text>
                    <Text className='userQ'>拳力值:</Text>
                    <Text className='userQdata'>{userInfo.point>=0?userInfo.point:'--'}</Text>
                  </View>
                  <View className='avaDJ'>
                    <Text className='userD'>蝇量级</Text>
                    <Text className='userDdata'>120/999</Text>
                  </View>
                </View>
                <View className='qrdata' onClick={this.showQrPanel}>
                  <Image src={require('../../assets/images/QRh.png')} mode='aspectFill' className='qrdataPhoto'></Image>
                </View>
              </View>

              {/* 活动滚动字幕 */}

              <Image src={require('../../assets/images/gundong.png')} mode='aspectFill' className='gundongPhoto'></Image>

              <Swiper
                className='gundongTextSwiper'
                vertical
                circular
                autoplay>
                <SwiperItem>
                  <View className='gundongPhotoText'>

                    <Text className='gundongText'>指定精酿啤酒 限时特惠 买一送一</Text>

                    <View className='gundongQG'>
                      <Text className='gundongTextQG'>立即抢购</Text>
                      <Image src={require('../../assets/images/liji.png')} mode='aspectFill' className='lijiPhoto'></Image>
                    </View>
                  </View>
                </SwiperItem>
                <SwiperItem>
                  <View className='gundongPhotoText'>

                    <Text className='gundongText'>指定精酿啤酒 限时特惠 买一送一</Text>

                    <View className='gundongQG'>
                      <Text className='gundongTextQG'>立即抢购</Text>
                      <Image src={require('../../assets/images/liji.png')} mode='aspectFill' className='lijiPhoto'></Image>
                    </View>
                  </View>
                </SwiperItem>

              </Swiper>


              {/* 买就要购，优惠卷... */}
              <View className='gyhqAll'>
                <Image src={require('../../assets/images/getGou.png')} mode='aspectFill' className='getGouPhoto'></Image>

                <View className='mhList'>
                  <View className='mhqMH'>
                    <View className='myCouponPhoto' onClick={this.openPage.bind(this,'/pages/coupon/index')}>
                      <Text className='couponTextsp'>{couponCount}</Text>
                    </View>
                    {/* <Image src={require('../../assets/images/myCouponnull.png')} mode='aspectFill' className='myCouponPhoto'></Image> */}
                    <Image src={require('../../assets/images/haowu.png')} mode='aspectFill' className='haowuPhoto'></Image>
                  </View>
                  <View className='mhqJL' onClick={this.openPage.bind(this,'/pages/webview/index')}>
                    <Image src={require('../../assets/images/quanli.png')} mode='aspectFill' className='quanliPhoto'></Image>
                  </View>
                </View>

              </View>


              {/* 蓄力有礼 */}
              <View className='xuLi'>
                <View className='xuLiimgs'>
                  {
                    [1,2,3,4,5].map((item,index) => {
                      return (
                          index<beerNumber?<Image src={require('../../assets/images/beer.png')} mode='aspectFill' className='beerPhoto' />
                          :<Image src={require('../../assets/images/beerhui.png')} mode='aspectFill' className='beerPhoto' />
                      )
                    })
                  }
                </View>
              </View>

              {/* 促销活动 */}
              <View className='cuxBanner'>
                  <Image src={require('../../assets/images/cuxbanner.png')} mode='aspectFill' className='cuxbannerPhoto'></Image>
              </View>
            </View>
            <TabBar selected={0} />
          </View>
        }
        <Authorize showCancel="false" authorizeSuccess={this.fetchUserInfoById.bind(this)} />
        <Register showCancel="false" registerSuccess={this.fetchUserInfoById.bind(this)} />
      </View>
    )
  }
}
