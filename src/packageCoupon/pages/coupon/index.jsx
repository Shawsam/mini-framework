import './index.scss';
import classNames from 'classnames';
import {Text, View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';
import frameWork  from '../../../common/decorator/frameWork';
import Api from '../../../common/api';
import Loading from '../../../components/Loading';
import NavBar from '../../../components/NavBar';
import TabBar from '../../../components/TabBar';
import Authorize from '../../../components/Authorize';
import Register from '../../../components/Register';
import ScrollList from '../../../components/ScrollList';

const Env = Taro.getEnv();
const frameOptions = {
  userInfoCached:false,
  loadToAuthorize:false
}
let disableOnshow = false, isFirstShow = true, pageData, shopId;
let frameIndex, frameArry=[];
let pageNo =1;

@frameWork(frameOptions)
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '我的优惠券',
    disableScroll: true
  }

  state = {
    current: 1,
    isLoading: true,
    cates:[],
    listData:[]
  }

  userInfoReady(){
      frameIndex = 0;
      frameArry = [];
      let cates = [{status:1,categoryName:'拳力值新增'},{status:2,categoryName:'拳力值使用'}];
      for(let i in cates){
          const singleItem = cates[i];
          singleItem.pageNo = 1;
          singleItem.listData = [];
          singleItem.noMore = false;
          frameArry.push(singleItem);
      }
      this.setState({cates})
      this.listInit();
  }

  listInit(){
      pageNo = 1;
      frameArry[frameIndex].pageNo = pageNo;
      this.setState({listInit:true});

      let { isLoading } = this.state;
      !isLoading && Taro.showLoading({title:'加载中...',mask:true});

      let status = frameArry[frameIndex].status;
      return new Promise((resolve,reject)=>{
          Api.fetchCouponList({ status, pageNo }).then(res=>{
              resolve(res);
              Taro.hideLoading();
              let listData = res.data;
              let noMore = listData.length==0;
              frameArry[frameIndex].listData = listData; 
              frameArry[frameIndex].noMore = noMore; 
              this.setState({isLoading:false, listInit:false, listData, noMore});
          }).catch(err=>{
              resolve(err);
              console.log(err);
              Taro.hideLoading();
              Taro.showModal({  content:err.msg,
                                showCancel:false,
                                success:()=>{
                                    this.listInit()
                                }
                            })
          });
      })
  }

  loadMoreData(){
      let { listData } = this.state;
      pageNo++;
      frameArry[frameIndex].pageNo = pageNo;
      
      let status = frameArry[frameIndex].status;
      return new Promise((resolve,reject)=>{ 
          Taro.showLoading({title:'加载中...',mask:true});
          Api.fetchCouponList({ status, pageNo }).then(res=>{
              resolve(res);
              Taro.hideLoading();
              let resData = res.data;
              let noMore = resData.length==0;
              listData = listData.concat(resData)
              frameArry[frameIndex].listData = listData; 
              frameArry[frameIndex].noMore = noMore; 
              this.setState({listData,noMore});
          }).catch(err=>{
              resolve(err);
              Taro.showModal({  content:err.msg,
                                showCancel:false,
                                success:()=>{
                                    this.listInit()
                                }
                             })
          });
      })
  }

  switchCate(index){
      frameIndex = index;
      this.setState({frameIndex,scrollTop:Math.random()});
      if(frameArry[frameIndex].listData.length){
          pageNo = frameArry[frameIndex].pageNo;
          let { listData, noMore } = frameArry[frameIndex]
          this.setState({listData,noMore});
          return;
      };
      this.listInit();
  }

  openDetail(item){
    Taro.navigateTo({
      url: '/packageCoupon/pages/couponDetail/index?item='+JSON.stringify(item)
    })
  }

  transDate(start,end){
      let str = start.substr(0,4)+'.'+start.substr(4,2)+'.'+start.substr(6,2);
      str = str + '-' +end.substr(4,2)+'.'+end.substr(6,2);
      return str;
  }

  render() {
    const { isLoading, cates, listData, scrollTop, listInit, noMore  } = this.state;
    return (
      <View className='page'>
        { isLoading?<Loading/>:
          <View className='container'>
            <NavBar title="我的优惠券" background='#F4F5F6' showBack={true} m_page={true} back={this.Return.bind(this)} />
            <View className='shixiaoPhoto'>
              { frameIndex ==0 ?
                <View className='mydataAll' onClick={this.switchCate.bind(this,1)}>
                  <Text className='mytext'>已失效卡券</Text>
                  <Image src={require('../../assets/images/toright.png')} mode='aspectFill' className='myImagedata' />
                </View>:
                <View className='mydataAll' onClick={this.switchCate.bind(this,0)}>
                  <Text className='mytext'>我的优惠券</Text>
                  <Image src={require('../../assets/images/toright.png')} mode='aspectFill' className='myImagedata' />
                </View>
              }
            </View>
            <View className="wrapper">            
                  <ScrollList emptyImg={require('../../assets/images/empty.png')} 
                              emptyStr = { frameIndex==0?'没有优惠券':'无失效卡券信息' } 
                              scrollTop = { scrollTop } 
                              isInit = { listInit }  
                              dataLength={ listData.length } 
                              noMore = { noMore }                            
                              pullToRefresh={this.listInit.bind(this)} 
                              pullToLoad={this.loadMoreData.bind(this)}>
                  {
                      listData.map((item,index)=>{
                          return(
                            <View className="list">
                            { frameIndex == 0 ?
                                  <View>
                                    {  item.category==2 &&
                                      <View className='couponit' onClick={this.openDetail.bind(this,item)}>
                                        <Image src={require('../../assets/images/xfcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                                        <Text className='couponTextxf'><Text className='couponTextrxf'>{(100-item.discountValue)/10}</Text>折</Text>
                                        <Text className='couponDate'>有效期：{this.transDate(item.startDate,item.endDate)}</Text>
                                      </View>                          
                                    }
                                    {  item.category==1 &&
                                      <View className='couponit' onClick={this.openDetail.bind(this,item)}>
                                        <Image src={require('../../assets/images/xjcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                                        <Text className='couponText'><Text className='couponTextr'>￥</Text>{item.couponValue}</Text>
                                        <Text className='couponDate'>有效期：{this.transDate(item.startDate,item.endDate)}</Text>
                                      </View>
                                    }
                                    {  item.category==0 &&
                                      <View className='couponit' onClick={this.openDetail.bind(this,item)}>
                                        <Image src={require('../../assets/images/zdcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                                        <Text className='couponDate'>有效期：{this.transDate(item.startDate,item.endDate)}</Text>
                                      </View>
                                    }
                                  </View>
                                  :<View>
                                      {  item.category==2 &&
                                        <View className='couponit invalid'>
                                          <Image src={require('../../assets/images/xfcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                                          <Text className='couponTextxf'><Text className='couponTextrxf'>{(100-item.discountValue)/10}</Text>折</Text>
                                          <Text className='couponDate'>有效期：{this.transDate(item.startDate,item.endDate)}</Text>
                                          <Text className='couponStatus'>已转赠</Text>
                                        </View>
                                      }
                                      {  item.category==1 &&
                                        <View className='couponit invalid' onClick={this.openDetail}>
                                          <Image src={require('../../assets/images/xjcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                                          <Text className='couponText'><Text className='couponTextr'>￥</Text>{item.couponValue}</Text>
                                          <Text className='couponDate'>有效期：{this.transDate(item.startDate,item.endDate)}</Text>
                                          <Text className='couponStatus'>已使用</Text>
                                        </View>
                                      }
                                      {  item.category==0 &&
                                         <View className='couponit invalid'>
                                            <Image src={require('../../assets/images/zdcoupon.png')} mode='aspectFill' className='centerImg'></Image>
                                            <Text className='couponDate'>有效期：{this.transDate(item.startDate,item.endDate)}</Text>
                                            <Text className='couponStatus'>已过期</Text>
                                          </View>
                                      }
                                  </View>
                            }
                            </View>
                          )
                      })
                  }
                  </ScrollList>   
            </View>
          </View>
        }
      </View>
    )
  }
}
