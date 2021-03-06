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

@frameWork(false)
export default class Index extends Component {
    config ={
        navigationBarTitleText:'首页',
        disableScroll:true,
        navigationStyle:'default'
    }
    
    state ={
        isLoading:true,
    }
   
    render () {
      const { isLoading } = this.state;
      return (
          <View className='page'>
              {isLoading?<Loading/>:
                  <View className='container'>
                      {this.config.navigationStyle=='custom' && <NavBar />  }
                      <View className="wrapper">
                          {/* 页面主体内容 */}
                          <View style="text-align:center;padding-top:20px;">{this.config.navigationBarTitleText}-页面内容</View>
                      </View>
                      <TabBar selected={0} />
                  </View>
              }
          </View>
      )
    }
}
