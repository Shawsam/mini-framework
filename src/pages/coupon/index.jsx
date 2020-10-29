import './index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View, Text } from '@tarojs/components'
import Api from '../../common/api';
import Loading from '../../components/Loading';
let pageNo = 1, status = 1;

export default class Index extends Component {
  config = {
    navigationBarTitleText: '我的优惠卷',
    disableScroll: true
  }

  state = {
      status:1,
      isLoading:false,
      listData:[]
  }

  componentDidMount() {
      status = 1;
      this.listInit();
  }

  listInit(){
      pageNo = 1;
      this.setState({noMore:false, listIniting:true});
      let { isLoading } = this.state;
      !isLoading && Taro.showLoading({title:'加载中...',mask:true});
      
      Api.fetchCouponList({ pageNo, status }).then(res=>{
          Taro.hideLoading();
          let listData = res.data;
          this.setState({isLoading:false, listIniting:false, listData,noMore:true});
      }).catch(err=>{
          console.log(err);
          Taro.hideLoading();
          Taro.showModal({  content:err.msg,

                            showCancel:false,
                            success:()=>{
                                this.listInit()
                            }
                        })
      });
  }

  switchCate(){
      if(status==1){
          status = 2;
          this.setState({status:2});
      }else if(status==2){
          status = 1;
          this.setState({status:1});
      }
      this.listInit();
  }

  openDetail(item){
    Taro.navigateTo({
      url: '/pages/couponDetail/index?item='+JSON.stringify(item)
    })
  }

  render() {
    let { isLoading, title, status, listData } = this.state;
    return (
      <View className='page'>
        {/* { isLoading?<Loading/>: */}
        <View className='container'>
          {/* <NavBar logo={true} title={title} showBack={false} color="#000" background="rgba(0,0,0,0)" m_page={true} back={this.Return.bind(this)} /> */}
          <View className="wrapper">
            <View className='shixiaoPhoto'>
              <View className='mydataAll' onClick={this.switchCate.bind(this)}>
                <Text className='mytext'>{ status==1?'已失效卡券':'我的优惠券' }</Text>
                <Image src={require('../../assets/images/toright.png')} mode='aspectFill' className='myImagedata'></Image>
              </View>
            </View>
            
            { status == 1 && 
              <View>
              { listData.length>0?
                <View className='list'>
                {  listData.map((item,index)=>{
                      return(
                        <View>
                        {  item.category==0 &&
                          <View className='couponit' onClick={this.openDetail.bind(this,item)}>
                            <Image src={require('../../assets/images/xfcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                            <Text className='couponTextxf'><Text className='couponTextrxf'>8</Text>折</Text>
                            <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                          </View>                          
                        }
                        {  item.category==1 &&
                          <View className='couponit' onClick={this.openDetail.bind(this,item)}>
                            <Image src={require('../../assets/images/xjcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                            <Text className='couponText'><Text className='couponTextr'>￥</Text>20</Text>
                            <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                          </View>
                        }
                        {  item.category==2 &&
                          <View className='couponit' onClick={this.openDetail.bind(this,item)}>
                            <Image src={require('../../assets/images/zdcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                            <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                          </View>
                        }
                        </View>
                      )
                   })
                }
                </View>
                :<View className='empty'>
                    <Image className="image" src={require('../../assets/images/empty.png')} />
                    <View className="text">没有优惠券</View>
                </View>
              }
              </View>
            }

            { status == 2 && 
              <View>
              { listData.length>0?
                <View className='list'>
                {  listData.map((item,index)=>{
                      return(
                        <View>
                        {  item.category==0 &&
                          <View className='couponit invalid'>
                            <Image src={require('../../assets/images/xfcouponHui.png')} mode='aspectFill' className='centerImg'></Image>
                            <Text className='couponTextxf'><Text className='couponTextrxf'>8</Text>折</Text>
                            <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                            <Text className='couponStatus'>已转赠</Text>
                          </View>
                        }
                        {  item.category==1 &&
                          <View className='couponit invalid' onClick={this.openDetail}>
                            <Image src={require('../../assets/images/xjcouponHui.png')} mode='aspectFill' className='centerImg'></Image>
                            <Text className='couponText'><Text className='couponTextr'>￥</Text>20</Text>
                            <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                            <Text className='couponStatus'>已使用</Text>
                          </View>
                        }
                        {  item.category==2 &&
                           <View className='couponit invalid'>
                              <Image src={require('../../assets/images/zdcouponHui.png')} mode='aspectFill' className='centerImg'></Image>
                              <Text className='couponDate'>有效期：2020.8.20-9.30</Text>
                              <Text className='couponStatus'>已过期</Text>
                            </View>
                        }
                        </View>
                      )
                   })
                }
                </View>
               :<View className='empty'>
                    <Image className="image" src={require('../../assets/images/empty.png')} />
                    <View className="text">没有优惠券</View>
                </View>
              }
              </View>
            }

          </View>
          {/* <TabBar selected={1} /> */}
        </View>
        {/* } */}
      </View>
    )
  }
}
