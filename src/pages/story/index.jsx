import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text, ScrollView } from '@tarojs/components'
import location from "../../assets/images/loaction.png";
import storeImg from "../../assets/images/storeimgtwo.png";
import xcqImg from "../../assets/images/xcq.png";
import NavBar from '../../components/NavBar';
import TabBar from '../../components/TabBar';

export default class storeList extends Component {
  config ={
      navigationBarTitleText:'品牌故事',
      disableScroll:true,
  }
  

  Return = () => { 
    Taro.navigateBack(); 
  }

  render() {

    return (
      <View className='page'>
        <View className='container'>
          <NavBar title="品牌故事" background='#F4F5F6' showBack={true} m_page={true} back={this.Return.bind(this)} />
          <View className="wrapper">
               <Image className='img' src='https://mj-obs.obs.myhwclouds.com/1604313362238%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201102182037.png' />
          </View>
        </View>

      </View>
    )
  }
}
