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
let disableOnshow = false, isFirstShow = true;
let editSuccess = false;
@inject('userStore')
export default class Index extends Component {
  config = {
    disableScroll: true,
    navigationBarTitleText: '个人信息',
    navigationStyle: 'custom',
  }
  state = {
    isLoading: false,
    userInfo:this.props.userStore.userInfo
  }

  componentWillMount(){
      editSuccess = false;
  }

  birthChoose(e) {
    const { userInfo } = this.state;
    userInfo.birth = e.detail.value;
    this.setState({ userInfo });
  }

  nameInput(e){
    const userInfo = this.state.userInfo;
    userInfo.name = e.target.value.replace(/\s*/g,"");
    this.setState({userInfo});
  }

  genderChange(gender) {
    const { userInfo } = this.state;
    userInfo.gender = gender;
    this.setState({ userInfo });
  }

  subimitFun(){
      const { userInfo } = this.state;
      if(userInfo.name==''){
          this.setState({msgPanelShow:true,msgText:'请输入您的名字'})
          return;   
      }
      if(!userInfo.birth){
          this.setState({msgPanelShow:true,msgText:'请选择您的生日'})
          return;   
      } 
      Api.editUserInfo(userInfo).then(res=>{
          Taro.setStorageSync('userInfo',userInfo);
          this.props.userStore.setUserInfo(userInfo);
          editSuccess = true;
          this.setState({msgPanelShow:true,msgText:'资料修改成功'})
      }).catch(err=>{
          console.log(err)
      })
  }

  closeMsgPanel(){
     if(editSuccess){
         Taro.navigateBack();
         editSuccess = false;
     }
     this.setState({msgPanelShow:false})
  }

  Return(){ 
    Taro.navigateBack(); 
  }

  render() {
    const { isLoading, userInfo, msgText, msgPanelShow } = this.state;
    return (
      <View className='page'>
        {isLoading ? <Loading /> :
          <View className='container'>
            <NavBar id="fixed" title="个人资料" background='rgba(0,0,0,0)' color="#fff" showBack={true} m_page={true} back={this.Return.bind(this)} />

            <View className='wrapper'>
              <View className="membg">
                <View className='name'>
                  <View className='header'>
                    <Image className='header-img' src={userInfo.avatarUrl}></Image>
                  </View>
                  <View className='header-name'>{userInfo.name}</View>
                </View>
              </View>


              <View className="hei102"></View>
              <View className='ul'>
                <View className='li'>
                  <View className='left'>昵称</View>
                  <View className='right'>
                    <Input className='input' maxlength="15" placeholderClass='placla' type='text' placeholder='请输入昵称' value={userInfo.name} onInput={this.nameInput.bind(this)} />
                  </View>
                </View>
                <View className='li'>
                  <View className='left'>手机号</View>
                  <View className='right'>{userInfo.mobile}</View>
                </View>
                <View className='li'>
                  <View className='left'>性别</View>
                  <View className='right'>
                    <View onClick={this.genderChange.bind(this, '1')} className={`sex sex10  ${userInfo.gender == 1 ? 'act' : ''}`}><View></View>先生</View>
                    <View onClick={this.genderChange.bind(this, '0')} className={`sex  ${userInfo.gender == 0 ? 'act' : ''}`}><View></View>女士</View>
                  </View>
                </View>
                <View className='li'>
                  <View className='left'>生日</View>
                  <View className='right'>
                    {
                      userInfo.birth ?
                        <View className="birth">
                          {userInfo.birth}
                          {/* <Text>(生日只可填写一次)</Text> */}
                        </View>
                        :
                        <Picker className="gray" onChange={this.birthChoose.bind(this)} mode='date'>
                          请填写你的生日
                      </Picker>
                    }
                  </View>
                </View>


              </View>

            </View>
            <View className="bottom">
              <Button onClick={this.subimitFun.bind(this)} className="save">保存</Button>
            </View>


          </View>
        }

        { msgPanelShow?
            <View className="panel msgPanel">
                <View className="shadow"></View>
                <View className="panelContent">
                    <View class="content">
                        <View className="title">{msgText}</View>
                        <View className="btnCon flexbox">
                            <View className="btn confirmBtn" onClick={this.closeMsgPanel.bind(this)}>确定</View>
                        </View>
                    </View>
                </View>
            </View>:null 
          }
      </View>
    );
  }

}
