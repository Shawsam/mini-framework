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

  state = {
    imgIndex:0
  }

  componentWillMount() {    
      let imgIndex = this.$router.params.imgIndex;
      this.setState({imgIndex});
  }  

  Return = () => { 
      Taro.navigateBack(); 
  }

  render() {
    let { imgIndex } = this.state;
    return (
      <View className='page'>
        {  imgIndex==-1 &&
          <View className='container'>
            <NavBar title="隐私条款" background='#F4F5F6' showBack={true} m_page={true} back={this.Return.bind(this)} />
            <View className="wrapper">
                { <Image className='img' mode="widthFix" src='https://mj-obs.obs.myhwclouds.com/1604384401851566.png' />  }
            </View>
          </View>
        }

        {  imgIndex==0 &&
          <View className='container'>
            <NavBar title="品牌故事" background='#F4F5F6' showBack={true} m_page={true} back={this.Return.bind(this)} />
            <View className="wrapper">
                { <Image className='img' mode="widthFix" src='https://mj-obs.obs.myhwclouds.com/1604313362238%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201102182037.png' />  }
            </View>
          </View>
        }

        {  imgIndex==1 &&
          <View className='container'>
            <NavBar title="每日欢乐时光" background='#F4F5F6' showBack={true} m_page={true} back={this.Return.bind(this)} />
            <View className="wrapper">
                { <Image className='img' mode="widthFix" src='https://mj-obs.obs.myhwclouds.com/1604374194042c8dfd357f828dcdde38d6cff3794670.png' />  }
            </View>
          </View>
        }


      </View>
    )
  }
}
