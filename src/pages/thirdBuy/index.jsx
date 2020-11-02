import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import './index.scss'
import NavBar from '../../components/NavBar'

export default class Index extends Component {
  config = {
    disableScroll: true,
    navigationBarTitleText: '第三方购买',
    navigationStyle: 'custom',
  }

  state = {
      bannerList:[
          {imgUrl:'https://mj-obs.obs.myhwclouds.com/160431063417420201030_BCB_CRM_ProductPage_750x1200_CTD.png'},
          {imgUrl:'https://mj-obs.obs.myhwclouds.com/160431063751320201030_BCB_CRM_ProductPage_750x1200_FB.png'},
          {imgUrl:'https://mj-obs.obs.myhwclouds.com/160431064068520201030_BCB_CRM_ProductPage_750x1200_FM.png'},
          {imgUrl:'https://mj-obs.obs.myhwclouds.com/160431064407920201030_BCB_CRM_ProductPage_750x1200_TKO.png'}
      ]
  }

  Return = () => { 
    Taro.navigateBack(); 
  }

  render() {
    const { isLoading, bannerList } = this.state;
    console.log(bannerList);
    return (
      <View className='page'>
        {isLoading ? <Loading /> :
          <View className='container'>
            <NavBar title="第三方购买" background='#fff' showBack={true} m_page={true} back={this.Return.bind(this)} />
            <View className='wrapper'>
                  <View className='swiper-banner'>
                      <Swiper autoplay circular className='banner'>
                        {
                            bannerList.map((item,index)=>{
                                 return (
                                      <SwiperItem key={index} className='swiperItem'>
                                          <Image className='bannerImg' src={item.imgUrl} />
                                      </SwiperItem>
                                 )
                            })
                        }
                      </Swiper>
                    </View>
            </View>
          </View>
        }
      </View>
    );
  }

}
