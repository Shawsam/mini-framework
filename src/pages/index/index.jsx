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
import QR from '../../common/lib/qrcode.js'

const Env = Taro.getEnv();
const frameOptions = {
  userInfoCached:false,
  loadToAuthorize:false
}
let disableOnshow = false, isFirstShow = true, pageData, shopId;
let Timer;

@frameWork(frameOptions)
export default class Index extends Component {
  config = {
    disableScroll: true
  }

  state = {
    isLoading:false,
    bannerList:[],
    noticeMessage:[{content:'指定精酿啤酒 限时特惠 买一送一',hrefUrl:'pages/thirdBuy/index'},{content:'指定精酿啤酒 限时特惠 买一送一',hrefUrl:'pages/thirdBuy/index'}],
    couponCount:'00',
    beerNum: 0,
    showQrPanel: false
  }

  PidReady(){
      //this.setState({isLoading:false});
      this.fetchBannerList();
  }

  userInfoReady(){
      // this.fetchNoticeMessage();
      this.fetchCouponCount();
      this.getXlAct();
      this.cardNoToQrcode();
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

  //蓄力有礼
  getXlAct(){
      Api.getXlAct().then(res=>{
          this.setState({beerNum:res.data.currentNumber});
      }).catch(err=>{
          console.log(err);
          // Taro.showModal({  content:err.msg,
          //                   showCancel:false,
          //                   success:()=>{
          //                       this.getXlAct()
          //                   }
          //                })
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
        case appid && isSelf: if(page=='/pages/shop/index'||page=='pages/shop/index'){
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
                              break;
        case appid && !isSelf: Taro.navigateToMiniProgram({appId:appid,path:page})
                               break;
        default:Taro.navigateTo({url:'/pages/webview/index?url='+page});
      }
  }

  showQrPanel(e){
      e.stopPropagation();
      this.interceptShowAuthorize().then(()=>{
          this.setState({showQrPanel:true});
          Taro.showLoading({title:'正在生成会员码...'})
          setTimeout(()=>{
              this.cardNoToQrcode();
              clearInterval(Timer);
              Timer = setInterval(()=>{
                  Taro.showLoading({title:'正在生成会员码...'})
                  this.cardNoToQrcode()
              },30000)
          },300)
      }).catch(err=>{
          console.log(err);
      })
  }  

  closeQrpanel(){
      clearInterval(Timer);
      this.setState({showQrPanel:false});
  } 

  cardNoToQrcode(){
    Api.getQrcode().then(res=>{
        let qrCode = res.data.qrCode;
        let size = this.setCanvasSize(); 
        this.createQrCode(qrCode,'mycanvas',size.w,size.h);
    }).catch(err=>{
        console.log(err);
    });
  }

  //绘制二维码图片
  createQrCode(str,canvasId,cavW,cavH){
    QR.api.draw(Taro.createCanvasContext,str,canvasId,cavW,cavH,this);
    setTimeout(() => { 
      this.canvasToTempImage()
      Taro.hideLoading()
    },500);
  }

  //适配不同屏幕大小的canvas
  setCanvasSize(){
    var size={};
    try {
        var res = Taro.getSystemInfoSync();
        var scale = 750/600;  //不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;   //canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        console.log("获取设备信息失败"+e);
      } 
    return size;
  }

  //获取临时缓存照片路径，存入data中
  canvasToTempImage(){
    var _this = this;
    Taro.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          _this.setState({
              imagePath:tempFilePath
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  }

  openMini(){
    Taro.navigateToMiniProgram({appId:'wxece3a9a4c82f58c9',path:'pages/container/index?q=https%3A%2F%2Ftb.ele.me%2Fwow%2Fzele-nr%2Fact%2Fqjm%3Fwh_biz%3Dtm'})
  }

  render() {
    const { isLoading, couponCount, beerNum, bannerList, noticeMessage, imagePath } = this.state;
    const { userInfo } = this.props.userStore;
    return (
      <View className='page'>
        { isLoading?<Loading/>:
          <View className='container'>
{ /*        <NavBar title="" background='#911414' showBack={false} m_page={true} />*/ }
            <View className="wrapper">
              {
                this.state.showQrPanel &&
                  <View className='qrAll'>
                    <View className='qrUserInfo'>
                      <Image src={userInfo.avatarUrl} mode='aspectFill' className='avaphotoPhotoQR'></Image>
                      <Image src={imagePath} mode='aspectFill' className='qrqrPhoto'></Image>
                      <Image src={require('../../assets/images/logo.png')}  className='logo'></Image>
                      <Text className='qrmiao'>二维码30秒自动刷新</Text>
                    </View>
                    <View className='closeAll'>
                      <View className='closeText'><View>门店消费时请出示给店员进行扫码，</View><View>获取您的积分权益。</View></View>
                      <Image src={require('../../assets/images/closetc.png')} mode='aspectFill' onClick={this.closeQrpanel} className='closetcPhoto'></Image>
                    </View>
                  </View>
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
                <Image onClick={this.openPage.bind(this,'/pages/thirdBuy/index')}  src={require('../../assets/images/getGou.png')} mode='aspectFill' className='getGouPhoto'></Image>

                <View className='mhList'>
                  <View className='mhqMH'>
                    <View className='myCouponPhoto' onClick={this.openPage.bind(this,'/packageCoupon/pages/coupon/index')}>
                      <Text className='couponTextsp'>{couponCount}</Text>
                    </View>
                    {/* <Image src={require('../../assets/images/myCouponnull.png')} mode='aspectFill' className='myCouponPhoto'></Image> */}
                    <Image onClick={this.openPage.bind(this,'/pages/pointsMall/index')}  src={require('../../assets/images/haowu.png')} mode='aspectFill' className='haowuPhoto'></Image>
                  </View>
                  <View className='mhqJL' onClick={this.openMini.bind(this)}>
                    <Image src={require('../../assets/images/quanli.png')} mode='aspectFill' className='quanliPhoto'></Image>
                  </View>
                </View>

              </View>


              {/* 蓄力有礼 */}
              <View className='xuLi'  onClick={this.openPage.bind(this,'/packageAct/pages/actDetail/index')}>
                <View className='xuLiimgs'>
                  {
                    [1,2,3,4,5].map((item,index) => {
                      return (
                          index<beerNum?<Image src={require('../../assets/images/beer.png')} mode='aspectFill' className='beerPhoto' />
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
        <Authorize authorizeSuccess={this.fetchUserInfoById.bind(this)} />
        <Register registerSuccess={this.fetchUserInfoById.bind(this)} />
        <Canvas className="canvasImg" canvasId="mycanvas"/>
      </View>
    )
  }
}
