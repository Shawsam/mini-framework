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
let isFirstShow = true;

const frameOptions = {
  userInfoCached:false,
  loadToAuthorize:false
}
@frameWork(frameOptions)
export default class Index extends Component {
    config ={
        navigationBarTitleText:'示例页',
        disableScroll:true,
        navigationStyle:'default'
    }
    
    state ={
        isLoading:true,
    }
    
    openPage(){
        this.interceptShowAuthorize().then(()=>{
            console.log('跳转页面');
        }).catch(err=>{
            console.log(err);
        })
    } 
   
    render () {
      let { isLoading } = this.state;
      let { userInfo } = this.props.userStore;
      return (
          <View className='page'>
              {isLoading?<Loading/>:
                  <View className='container'>
                      {this.config.navigationStyle=='custom' && <NavBar title={this.config.navigationBarTitleText} />  }
                      <View className="wrapper">
                          {/* 页面主体内容 */}
                          <View style="text-align:center;padding-top:20rpx;">{this.config.navigationBarTitleText}-页面内容</View>
                          <View style="text-align:center;padding-top:300rpx;" onClick={this.openPage.bind(this)}>
                              <View>{ userInfo.nickName||'点击授权'}</View>
                              <Image style="height:100rpx; width:100rpx; border-radius:100%; margin-top:20rpx;" src={ userInfo.avatarUrl } />
                          </View>
                      </View>
                  </View>
              }
              <Authorize authorizeSuccess={this.fetchUserInfoById.bind(this)} />
              <Register registerSuccess={this.fetchUserInfoById.bind(this)} />
          </View>
      )
    }
}
