import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text } from '@tarojs/components'
import Api from '../../common/api';
import Loading from '../../components/Loading';

const Env = Taro.getEnv();
export default class Index extends Component {
  config = {
    navigationBarTitleText: '我的优惠卷',
    disableScroll: true
  }

  state = {
      isLoading:false,
      item:{}
  }

componentDidMount () {
    Taro.hideShareMenu();
    const  item  = JSON.parse(this.$router.params.item);
    const description = item.description.split("；");
    const couponNo = item.couponNo;
    Api.couponCheck(couponNo).then(res=>{
        this.setState({item:item, description:description, couponNo, status:item.status, isTransfer:item.isTransfer,isLoading:false}); 
    }).catch(err=>{
        this.setState({item:item, description:description, couponNo, status:item.status, isTransfer:0, isLoading:false});
    })
  }

  onShareAppMessage() {
    const { code, couponNo, item } = this.state;
    item.status = 4;
    this.setState({sharePanelShow:false,status:4,item}); 
    return {
        title: 'Hey，赠你一份优惠福利，点击速领！',
        imageUrl:"http://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/tims/1602733078180%E5%88%B8%E8%BD%AC%E5%A2%9E%E5%9B%BE.jpg",
        bgImgUrl:"http://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/tims/1602733078180%E5%88%B8%E8%BD%AC%E5%A2%9E%E5%9B%BE.jpg",
        path: 'pages/coupon_fetch/index?code='+code+'&coupon='+couponNo
    }
  }

  transDate (str) { 
      return(str.substring(0,4)+'.'+str.substring(4,6)+'.'+str.substring(6,8));
  }

  addShare(e){
      Taro.setStorageSync('couponStatusChange',true)
      let { couponNo, status } = this.state;
      if(Env=="WEAPP"){
          //category=7 券分享  category=10 券领取
          Api.getTempList(1).then(res=>{
              let tmplIds=[], data = res.data;
              for(let i=0; i<data.length; i++){
                  tmplIds.push(data[i].tempId);
              }
              wx.requestSubscribeMessage({
                tmplIds,
                success:(res)=>{
                    let templateIds = [];
                    for(let key in res){
                        if(res[key]==='accept') templateIds.push(key);
                    }
                    if(templateIds.length){
                        Api.addFormId(3,1,templateIds).then(res=>{
                            console.log('埋点成功')
                        }).catch(err=>{
                            console.log('埋点失败')
                        })
                    }
                },
                fail:(err)=>{
                    console.log(err);
                },
                complete:(res)=>{
                    if(status==4){
                        Api.couponGetShareCode(couponNo).then((res)=>{
                            this.setState({sharePanelShow:true,code:res.data.ucode}); 
                        }).catch((err)=>{
                            Taro.showModal({content:err.msg,showCancel:false})
                        })
                    }else{
                        Api.couponAddShare(couponNo).then((res)=>{
                           Taro.setStorageSync('couponStatusChange',true)
                           this.setState({sharePanelShow:true,code:res.data.ucode}); 
                        }).catch((err)=>{
                           Taro.showModal({content:err.msg,showCancel:false})
                        })
                    }
                }
              })
          }).catch(err=>{
              console.log(err)
              if(status==4){
                  Api.couponGetShareCode(couponNo).then((res)=>{
                      this.setState({sharePanelShow:true,code:res.data.ucode}); 
                  }).catch((err)=>{
                      Taro.showModal({content:err.msg,showCancel:false})
                  })
              }else{
                  Api.couponAddShare(couponNo).then((res)=>{
                     Taro.setStorageSync('couponStatusChange',true)
                     this.setState({sharePanelShow:true,code:res.data.ucode}); 
                  }).catch((err)=>{
                     Taro.showModal({content:err.msg,showCancel:false})
                  })
              }
          })
      }else{
          const formId = e.detail.formId;
          const location = 1;
          const expiryTime = new Date().getTime()+7*24*3600000-3600000;
          Api.addFormId(formId, expiryTime, location).then(res=>{
              console.log('埋点成功');
          }).catch(err=>{
              console.log('埋点失败');
          });
          if(status==4){
              Api.couponGetShareCode(couponNo).then((res)=>{
                  this.setState({sharePanelShow:true,code:res.data.ucode}); 
              }).catch((err)=>{
                  Taro.showModal({content:err.msg,showCancel:false})
              })
          }else{
              Api.couponAddShare(couponNo).then((res)=>{
                 Taro.setStorageSync('couponStatusChange',true)
                 this.setState({sharePanelShow:true,code:res.data.ucode}); 
              }).catch((err)=>{
                 Taro.showModal({content:err.msg,showCancel:false})
              })
          }
      }
  }

  confirmShare(){
      console.log('确定转发')
      Env=="WEAPP" && my.showSharePanelShow();
  }

  cancelShare(){
      const { couponNo, status, code } = this.state;
      if(status==4){
          console.log('此券转发中')
          this.setState({sharePanelShow:false});
          return;
      } 
      console.log('取消转发')
      Api.cancelShare(couponNo,code).then((res)=>{
          this.setState({sharePanelShow:false}); 
      }).catch((err)=>{
          Taro.showModal({content:err.msg,showCancel:false})
      })
  }
 

  render() {
    let { isLoading, item, sharePanelShow, isTransfer } = this.state;
    return (
      <View className='page'>
        {/* { isLoading?<Loading/>: */}
        <View className='container'>
          {/* <NavBar logo={true} title={title} showBack={false} color="#000" background="rgba(0,0,0,0)" m_page={true} back={this.Return.bind(this)} /> */}
          <View className="wrapper">
            {
              item.category==2 &&
                <View>
                  <Image src={require('../../assets/images/eightz.png')} mode='aspectFill' className='eightzPhoto'></Image>
                  <View className='coupondetail'>
                    <Text className='couponEightT'>8折消费折扣券</Text>
                    <Text className='couponEightSy'>使用说明</Text>

                    <ScrollView
                      className='scrollview'
                      scrollY
                      scrollWithAnimation
                      style='height:280px'
                    >
                      <View className='couponContentData'><Text className='couponEightCt'>{item.description}</Text></View>
                    </ScrollView>


                    <View className="SYbtn">
                        <Text className="coLiJ">立即使用</Text>
                        { isTransfer==1 && <Text className="ZHyou" onClick={this.addShare.bind(this)} >转赠好友</Text>}
                    </View>

                  </View>
                </View>
            }

            {
              item.category==1 &&
                <View>
                  <Image src={require('../../assets/images/xj.png')} mode='aspectFill' className='eightzPhoto'></Image>
                  <View className='coupondetail'>

                    <Text className='couponEightT'>指定饮品免费品尝</Text>
                    <Text className='couponEightSy'>使用说明</Text>

                    <ScrollView
                      className='scrollview'
                      scrollY
                      scrollWithAnimation
                      style='height:280px'
                    >
                      <View className='couponContentData'><Text className='couponEightCt'>{item.description}</Text></View>
                    </ScrollView>

                    <View className="SYbtn">
                        <Text className="coLiJ">立即使用</Text>
                        { isTransfer==1 && <Text className="ZHyou" onClick={this.addShare.bind(this)} >转赠好友</Text>}
                    </View>

                  </View>

                </View>
            }

            {
              item.category==0 &&
                <View>
                  <Image src={require('../../assets/images/dk.png')} mode='aspectFill' className='eightzPhoto'></Image>
                  <View className='coupondetail'>

                    <Text className='couponEightT'>20元现金抵扣券</Text>
                    <Text className='couponEightSy'>使用说明</Text>

                    <ScrollView
                      className='scrollview'
                      scrollY
                      scrollWithAnimation
                      style='height:280px'
                    >
                      <View className='couponContentData'><Text className='couponEightCt'>{item.description}</Text></View>
                    </ScrollView>
                    
                    <View className="SYbtn">
                        <Text className="coLiJ">立即使用</Text>
                        { isTransfer==1 && <Text className="ZHyou" onClick={this.addShare.bind(this)} >转赠好友</Text>}
                    </View>
                 
                    {/* <View className="SYbtn"><Text className="ZHyoustatus">转赠好友中...</Text></View> */}

                  </View>
                </View>
            }

          </View>
        </View>
        { sharePanelShow &&
            <View class="panel panelShare">
              <View className="shadow"></View>
              <View className="panelContent" catchtouchmove="ture">
                  <View className="closeBtn"><Image className="innerImg" onClick={ this.cancelShare.bind(this) } src={require('../../assets/images/close.png')} /></View>
                  {/*  <Image mode="widthFix" className="centerImg" src={require('../../assets/user/sharePanelShow.jpg')} />*/  }
                  <View className="title">是否确认转赠好友</View>
                  <View className="txt">转赠发起后不可撤回，若24小时未被他人领取自动退回到您的券包。</View>
                  <View className="btnCon flexbox">
                      <View className="btn cancelBtn" onClick={ this.cancelShare.bind(this) }>取消</View>
                      <Button className="btn" openType="share" onClick={ this.confirmShare.bind(this) }>确定</Button>
                  </View>
              </View>
            </View>
          }
      </View>
    )
  }
}
