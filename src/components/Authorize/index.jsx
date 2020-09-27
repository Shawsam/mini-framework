import './index.scss';
import classNames from 'classnames';
import {Text, View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';

const Env = Taro.getEnv();

@inject('userStore')
@observer
export default class Authorize extends Component {
  static defaultProps = {
      showCancel:true,
      authorizeSuccess:Function
  }

  constructor(props) {
      super(props)
  }

  confirmAuthrize(res){
      if(Env==='ALIPAY'){
          my.getOpenUserInfo({
            fail: (res) => {
              console.log(res);
            },
            success: (res) => {
              let userInfo = JSON.parse(res.response).response;
              this.props.authorizeSuccess(userInfo);
            }
          });
      }else if(Env==='WEAPP'){
          const { encryptedData, iv, userInfo } = res.detail;
          encryptedData && Taro.setStorageSync('encryptedData', encryptedData);
          iv && Taro.setStorageSync('iv', iv);
          Taro.setStorageSync('authInfo', userInfo);    //设置缓存
          this.props.userStore.setUserInfo(userInfo);   //设置userInfo
          this.props.userStore.setAuthorizeShow(false); //关闭授权
          this.props.authorizeSuccess();              //执行页面回调
      }
  }

  cancelAuthorize(){
      this.props.userStore.setAuthorizeShow(false);    //关闭授权
  }

  render() {
    const { showCancel } = this.props;
    const { userStore:{ authorizeShow } } = this.props;
    return (
        <View>
            { Env != 'WEB' && authorizeShow?
            <View className="panel">
                <View className="shadow"></View>
                <View className="panelContent" catchTouchMove="ture">
                    { showCancel && <Image className="closeBtn" onClick={ this.cancelAuthorize.bind(this) } src={require('./images/close.png')} /> }
                    <Image mode="widthFix" className="centerImg" src={require('./images/authorize.jpg')} />
                    <View class="content">
                        <View class="title">{Env == 'WEAPP'?'微信':'支付宝'}授权</View>
                        <View class="tit">小程序需要获取您的用户信息</View>
                        { Env == 'ALIPAY' && <View className="flex-item confirmBtn"><Button className="btn" scope='userInfo' open-type="getAuthorize" onGetAuthorize={ this.confirmAuthrize.bind(this) }>确定</Button></View> }
                        { Env == 'WEAPP' && <View className="flex-item confirmBtn"><Button className="btn" open-type="getUserInfo" bindgetuserinfo={ this.confirmAuthrize.bind(this) }><Image className="wx" src={require('./images/wx.png')}  />授权登录</Button></View> }
                    </View>
                </View>
            </View>:null }
        </View>
    )
  }
}