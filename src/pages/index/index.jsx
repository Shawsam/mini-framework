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
export default class Index extends Component {
  config = {
    navigationStyle: 'custom',
    disableScroll: true
  }

  state = {
    isLoading:false,
    bannerList:[],
    noticeMessage:[{content:'指定精酿啤酒 限时特惠 买一送一'},{content:'指定精酿啤酒 限时特惠 买一送一'}],
    couponCount:'00',
    beerNumber: 0,
    showQrPanel: false
  }

  PidReady(){
      this.fetchBannerList();
  }

  userInfoReady(){
      // this.fetchNoticeMessage();
      this.fetchCouponCount();
      // this.getXlAct();
  }
  
  //轮播图
  fetchBannerList(){
      Api.fetchBannerList(1000).then(res=>{
          this.setState({bannerList:res.data});
      }).catch(err=>{
          console.log(err);
          Taro.showModal({  content:err.msg,
                            showCancel:false,
                            success:()=>{
                                this.fetchBannerList()
                            }
                         })
      });
  }

  //券数量
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

  formatNumber = n => {n = n.toString();return n[1] ? n : '0' + n};

  //蓄力有礼
  getXlAct(){
      Api.getXlAct().then(res=>{
          this.setState({beerNumber:res.data.currentNumber});
      }).catch(err=>{
          console.log(err);
          Taro.showModal({  content:err.msg,
                            showCancel:false,
                            success:()=>{
                                this.getXlAct()
                            }
                         })
      });
  }

  //消息通知
  fetchNoticeMessage(){
      Api.fetchNoticeMessage().then(res=>{
          let noticeMessage = res.data||[];
          this.setState({noticeMessage});          
      }).catch(err=>{
          console.log(err);
          Taro.showModal({  content:err.msg,
                            showCancel:false,
                            success:()=>{
                                this.fetchNoticeMessage()
                            }
                         })
      });
  }

   //banner跳转
  bannerJump(item,closePanel){
      let url = item.hrefUrl;
      try{
         url = JSON.parse(url)
      }catch(err){
         console.log(err)
         return;
      }
      console.log(url)
      const { appid, isSelf, page } = url
      if(!page){
           console.log('跳转路径为空');
           return;
      }
      switch(true){
        case appid && isSelf: if(userInfoCache.isAuthorized){
                                  if(this.state.isRegister){
                                      if(page=='/pages/shop/index'||page=='pages/shop/index'){
                                          Taro.switchTab({  url:'/pages/shop/index',
                                                            success:()=>{
                                                                closePanel && setTimeout(()=>this.closePanelAd(),800);
                                                            } 
                                          });
                                      }else if(page=='/pages/mine/index'||page=='pages/mine/index'){
                                          Taro.switchTab({  url:'/pages/mine/index',
                                                            success:()=>{
                                                                closePanel && setTimeout(()=>this.closePanelAd(),800);
                                                            } 
                                          });
                                      }else{
                                          Taro.navigateTo({ url:'/'+page,
                                                            success:()=>{
                                                                closePanel && setTimeout(()=>this.closePanelAd(),800);
                                                            } 
                                          });
                                      }                                    
                                  }else{
                                      this.slideDownFun();
                                  }
                              }else{
                                  this.setState({isAuthorized:false})
                              }
                              break;
        case appid && !isSelf: Taro.navigateToMiniProgram({appId:appid,path:page})
                               break;
        default:Taro.navigateTo({url:'/pages/webview/index?url='+page});
      }
  }

  showQrPanel(e){
      e.stopPropagation();
      this.interceptShowAuthorize().then(()=>{
          this.setState({showQrPanel:!this.state.showQrPanel})
      }).catch(err=>{
          console.log(err);
      })
  }   

  render() {
    const { isLoading, couponCount, beerNumber, bannerList, noticeMessage } = this.state;
    const { userInfo } = this.props.userStore;
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
              <View className='avaAll' onClick={this.openPage.bind(this,'/pages/userInfo/index')}>
                <Image src={userInfo.avatarUrl} mode='aspectFill' className='avaphotoPhoto'></Image>
                <View className='avaList'>
                  <View>
                    <Text className='userName'>{userInfo.name||'点击授权'}</Text>
                    <Text className='userQ'>拳力值:</Text>
                    <Text className='userQdata'>{userInfo.point>=0?userInfo.point:'--'}</Text>
                  </View>
                  <View className='avaDJ'>
                    <Text className='userD'>{userInfo.levelName}</Text>
                    <Text className='userDdata'>{userInfo.accScore}/{userInfo.accScoreGift}</Text>
                  </View>
                </View>
                <View className='qrdata' onClick={this.showQrPanel.bind(this)}>
                  <Image src={require('../../assets/images/QRh.png')} mode='aspectFill' className='qrdataPhoto'></Image>
                </View>
              </View>

              {/* 活动滚动字幕 */}

              <Image src={require('../../assets/images/gundong.png')} mode='aspectFill' className='gundongPhoto'></Image>
              {
                noticeMessage.length &&
                <Swiper className='gundongTextSwiper' vertical circular autoplay>
                    {
                        noticeMessage.map((item,index)=>{
                            return(
                              <SwiperItem>
                                <View className='gundongPhotoText' onClick={this.openPage.bind(this,'/'+item.hrefUrl)}>
                                  <Text className='gundongText'>{item.content}</Text>
                                  <View className='gundongQG'>
                                    <Text className='gundongTextQG'>立即抢购</Text>
                                    <Image src={require('../../assets/images/liji.png')} mode='aspectFill' className='lijiPhoto'></Image>
                                  </View>
                                </View>
                              </SwiperItem>
                            )
                        })
                    }
                </Swiper>
              }

              {/* 买就要购，优惠卷... */}
              <View className='gyhqAll'>
                <Image onClick={this.openPage.bind(this,'/pages/goBuy/index')}  src={require('../../assets/images/getGou.png')} mode='aspectFill' className='getGouPhoto'></Image>

                <View className='mhList'>
                  <View className='mhqMH'>
                    <View className='myCouponPhoto' onClick={this.openPage.bind(this,'/pages/coupon/index')}>
                      <Text className='couponTextsp'>{couponCount}</Text>
                    </View>
                    {/* <Image src={require('../../assets/images/myCouponnull.png')} mode='aspectFill' className='myCouponPhoto'></Image> */}
                    <Image onClick={this.openPage.bind(this,'/pages/pointsMall/index')}  src={require('../../assets/images/haowu.png')} mode='aspectFill' className='haowuPhoto'></Image>
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

              { bannerList.length>0 && 
                <View className='nav_banner'>
                  { bannerList.length==1?
                    <Image onClick={ this.bannerJump.bind(this,bannerList[0]) } mode="widthFix" className='bannerImg' src={bannerList[0].imgUrl} />:
                    <View className='swiper-banner'>
                      <Swiper autoplay circular className='banner'>
                        {
                            bannerList.map((item,index)=>{
                                 return (
                                      <SwiperItem  key={index} className={'swipe-item'}>
                                          <Image onClick={ this.bannerJump.bind(this,item) } mode="widthFix" className='bannerImg' src={item.imgUrl} />
                                      </SwiperItem>
                                 )
                            })
                        }
                      </Swiper>
                    </View>
                  }
                </View> 
              }
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
