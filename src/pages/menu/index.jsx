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

const Env = Taro.getEnv();
let isFirstShow = true;

const frameOptions = {
  userInfoCached:false,
  loadToAuthorize:false
}
@frameWork(frameOptions)
export default class Index extends Component {
    config ={
        navigationBarTitleText:'菜单页',
        disableScroll:true,
        navigationStyle:'default'
    }
    
    state ={
        isLoading:true,
    }

    authInfoUnReady(){
        this.setState({isLoading:false});    
    }
   
    render () {
      let {isLoading } = this.state;
      return (
          <View className='page'>
              {isLoading?<Loading/>:
                  <View className='container'>
                      {this.config.navigationStyle=='custom' && <NavBar />  }
                      <View className="wrapper">
                          {/* 页面主体内容 */}
                          <View style="text-align:center;padding-top:20px;">{this.config.navigationBarTitleText}-页面内容</View>
                      </View>
                      <TabBar selected={1} />
                  </View>
              }
          </View>
      )
    }
}
