import './index.scss';
import classNames from 'classnames';
import {Text, View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';
import Api from '../../common/api'
import * as User from '../../common/utils/user';


const Env = Taro.getEnv();
@inject('userStore')
@observer
export default class Register extends Component {
  static defaultProps = {
      showCancel:false,
      registerSuccess:Function
  }

  constructor(props) {
    super(props)
    this.state = { 
        panelTipShow:false,
        panelYzmShow:false,
        counter:60,
        codeInput:'',
        phoneInput:'',
        yzmInput:'',
        agree:true
    }
  }

  cancelPhoneAuthorize(){
      this.props.userStore.setRegisterShow(false);
  }
  
  phoneAuthorized(res){
      if(!this.state.agree){
          this.setState({panelTipShow:true,tipMsg:'请阅读并同意隐私条款'})
          return;
      }
      const { encryptedData, iv } = res.detail;
      if(encryptedData){
          Api.encryptedData(encryptedData, iv).then((res)=>{
              const mobile = res.data.purePhoneNumber;
              this.mobileNext(mobile);
          }).catch((err)=>{
              console.log(err)
              Taro.showModal({content:err.msg,showCancel:false})
          })
     }
  }

  mobileNext(mobile){
      Api.fetchUserInfoByMobile(mobile).then((res)=>{
          Api.userLogin(mobile).then(res=>{
              console.log('=====登录成功=====');
              this.setState({panelYzmShow:false})
              this.props.userStore.setRegisterShow(false);
              this.props.registerSuccess();
          }).catch(err=>{
              return Promise.reject(err);
          });
      }).catch((err)=>{
          console.log(err)
          if(err.errcode==401){
              User.updateToken().then(res=>{
                  this.mobileNext(mobile);
              })
          }else if(err.errcode==100124){
              let { nickName, gender, birth } = Taro.getStorageSync('authInfo');
              gender = gender=='m'?1:0;
              const shopId = Taro.getStorageSync('shopId');
              Api.userRegister({mobile,gender,birth,shopId}).then(res=>{
                  console.log('=====注册成功=====');
                  this.setState({panelYzmShow:false})
                  this.props.userStore.setRegisterShow(false);
                  this.props.registerSuccess();
              }).catch(err=>{
                  console.log(err)
              })
          }
      })
  }

  checkAgree(){
      this.setState({agree:!this.state.agree})
  }

  openYzmRegister(){
      if(!this.state.agree){
        this.setState({panelTipShow:true,tipMsg:'请阅读并同意用户协议'})
        return;
      }
      this.getCaptcha();
      this.setState({  panelYzmShow:true })
  }

  phoneInput(e){
      let phoneInput = e.target.value;
      phoneInput = phoneInput.replace(/[^0-9]/g,'');
      this.setState({ phoneInput })
      return { value:phoneInput };
  }

  codeInput(e){
      let codeInput = e.target.value;
      codeInput = codeInput.replace(/[^a-zA-Z0-9]/g,'').substr(0,4);
      this.setState({ codeInput })
      return { value:codeInput };
  }

  yzmInput(e){
      let yzmInput = e.target.value;
      yzmInput = yzmInput.replace(/[^0-9]/g,'');
      this.setState({ yzmInput })
      return { value:yzmInput };
  }

  getCaptcha(){
      this.setState({codeImg:Api.getImageCode()})
  }

  sendCode(){
      if(this.state.sendSuccess) return;
      let { codeInput, phoneInput } = this.state;
      if(phoneInput=='' || phoneInput.length<11 ){
          Taro.showToast({title:'请输入正确的手机号',icon:'none'});
          return;
      }
      if(codeInput==''){
          Taro.showToast({title:'请输入图形验证码',icon:'none'});
          return;
      }

      let mobile = phoneInput;
      Api.sendCode(mobile, codeInput).then(res => {
          Taro.showToast({title:'短信发送成功',icon:'none'})
          this.setState({sendSuccess:true})
          let counterInterval = setInterval(()=>{
              let counter = this.state.counter
              if(counter==0){
                  this.getCaptcha()
                  this.setState({sendSuccess:false,counter:60})
                  clearInterval(counterInterval)
              }else{
                  this.setState({counter:counter-1})
              }
         },1000)
      }).catch(err=>{
          console.log(err);
          Taro.showToast({title:err.msg||'内部错误',icon:'none'})
          this.getCaptcha()
      })
  }

  subimitFun(){
      let { codeInput, phoneInput } = this.state;
      if(phoneInput=='' || phoneInput.length<11 ){
          Taro.showToast({title:'请输入正确的手机号',icon:'none'});
          return;
      }

      if(codeInput==''){
          Taro.showToast({title:'请输入图形验证码',icon:'none'});
          return;
      }

      let { yzmInput } = this.state;
      if(yzmInput==''){
          Taro.showToast({title:'请输入短信验证码',icon:'none'});
          return;
      }
      let mobile = phoneInput;
      Api.checkCode(mobile, yzmInput).then(res=>{
          console.log('验证通过')
          this.mobileNext(mobile);
      }).catch(err=>{
          Taro.showToast({title:err.msg,icon:'none'});
      })
  }

  closeYzmPanel() {
      this.setState({ panelYzmShow: false, yzmInput: '', phoneInput: '', codeInput: '' })
  }

  closePanel(){
      this.setState({panelTipShow:false, panelWelcomeShow:false })
  }

  openProtocol(e){
     e.stopPropagation();
     Taro.navigateTo({url:'/pages/story/index?imgIndex=-1'})
  }

  render() {
    const { showCancel } = this.props;
    const { userStore:{ registerShow } } = this.props;
    const { panelTipShow, tipMsg, panelYzmShow, agree, codeImg, codeInput, phoneInput, sendSuccess, counter } = this.state;
    return (
        Env !== 'WEB' && registerShow &&
        <View>
            <View className="panel registerPanel">
                <View className="shadow"></View>
                <View className="panelContent" catchTouchMove="ture">
                    { showCancel && <Image className="closeBtn" onClick={ this.cancelPhoneAuthorize } src={require('./images/close.png')} /> }
                    <Image mode="widthFix" className="centerImg" src={require('./images/authorize.jpg')} />
                    <View className="content">
                        { Env == 'WEAPP' && <Button className="btn authorizeBtn" openType="getPhoneNumber" onGetPhoneNumber={this.phoneAuthorized.bind(this)}>{/*<Image className="wx" src={require('./images/wx2.png')} />*/}微信快速注册</Button> }
                        { Env == 'ALIPAY' && <Button className="btn authorizeBtn" openType="getAuthorize" scope='phoneNumber'  onGetAuthorize={ this.phoneAuthorized.bind(this) }>授权手机号注册</Button> }
                        <Button className="btn" onClick={this.openYzmRegister.bind(this)}>输入手机号注册</Button>
                        <View className="protocol" onClick={this.checkAgree.bind(this)}>{agree ? <Image className="yes" src={require('./images/selected.png')} /> : <Image className="yes" src={require('./images/select.png')} />}您是否已满18岁Are You Legal To Drink?同意拳击猫<Text onClick={this.openProtocol.bind(this)} className="link">隐私条款</Text></View>
                    </View>
                </View>
            </View>


            {   panelYzmShow &&
                <View className="panel panelYzm">
                    <View className="shadow"></View>
                    <View className="panelContent" catchTouchMove="ture">
                        { /* <Image className="closeBtn" onClick={this.closeYzmPanel.bind(this)} src={require('./images/close.png')} /> */}
                        <View className="title">手机号注册</View>
                        <View className="content">
                           {/* <View className="tit">欢迎注册拳击猫会员</View> */}
                            <View className="fmGroup hasBtn">
                                <Input className="input" type="text" maxlength="11" onInput={this.phoneInput.bind(this)} value={phoneInput} placeholder="请输入手机号" enableNative={true} controlled={true} />
                            </View>
                            <View className="fmGroup hasBtn">
                                <Input className="input" type="text" maxlength="4" onInput={this.codeInput.bind(this)} value={codeInput} placeholder="请输入验证码" enableNative={true} controlled={true} />
                                <Image className="captcha" src={codeImg} onClick={this.getCaptcha} /></View>
                            <View className="fmGroup hasBtn">
                                <Input className="input" type="text" maxlength="6" onInput={this.yzmInput.bind(this)} value={yzmInput} placeholder="请输入短信验证码" enableNative={true} controlled={true} />
                                <View className={`sendBtn ${phoneInput.length == 11 ? 'active' : ''}`} onClick={this.sendCode}>{sendSuccess ? counter + '秒后重试' : '获取验证码'}</View>
                            </View>
                            <View className="btnCon flexbox">
                                <View className="flex-item cancelbtn" onClick={this.closeYzmPanel.bind(this)}>取消</View>
                                <View className="flex-item confirmbtn" onClick={this.subimitFun}>确定</View>
                            </View>
                        </View>
                    </View>
                </View>

            }

            {   panelTipShow &&
                <View className="panel panelTip">
                    <View className="shadow"></View>
                    <View className="panelContent">
                        <View className="content">
                            <View className="title">{tipMsg}</View>
                            <View className="btnCon flexbox">
                                <View className="btn confirmBtn" onClick={this.closePanel.bind(this)}>确定</View>
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
  }
}
