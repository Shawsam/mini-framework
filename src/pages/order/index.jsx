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
import ScrollList from '../../components/ScrollList';

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
    navigationBarTitleText: '我的订单',
    disableScroll: true
  }

  state = {
    isLoading: true,
    cates:[],
    listData:[]
  }

  userInfoReady(){
      frameIndex = 0;
      frameArry = [];
      let cates = [{status:1,categoryName:'我的订单'}];
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
          Api.fetchTransLog({ status, pageNo }).then(res=>{
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
          Api.fetchTransLog({ status, pageNo }).then(res=>{
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

  transDate(str){
      if(str){
          return(str.substring(0,4)+'-'+str.substring(4,6)+'-'+str.substring(6,8))
      }
  }

  render() {
    const { isLoading, cates, listData, scrollTop, listInit, noMore  } = this.state;
    console.log(listData)
    return (
      <View className='page'>
        { isLoading?<Loading/>:
          <View className='container'>
          <NavBar title="我的订单" background='#F4F5F6' showBack={true} m_page={true} back={this.Return.bind(this)} />
  {/*       <View className='orderTextAll'>
                 <Text className='orderTextm'>门店订单</Text>  
                 <Text className='orderText'>商城订单</Text>
                 <Text className='orderText'>周边商品</Text>
            </View>*/  }
            <View className="wrapper">
                  <ScrollList emptyImg={require('../../assets/images/billEmpty.png')} 
                              emptyStr = "暂无记录" 
                              scrollTop = { scrollTop } 
                              isInit = { listInit }  
                              dataLength={ listData.length } 
                              noMore = { noMore }                            
                              pullToRefresh={this.listInit.bind(this)} 
                              pullToLoad={this.loadMoreData.bind(this)}>
                      {
                          listData.map((item,index)=>{
                              return(
                                  <View className='orderimgAll' onClick={this.openPage.bind(this,'/pages/orderDetail/index?orderNo='+item.logSeq)}>
                                    <View className='orderimgText'>
                                        <Text className='orderAddress'>{item.shopAddress}</Text>
                                        <Text className='orderTime'>下单时间：{this.transDate(item.transDate)}</Text>
                                        <View className='orderMoneyflex'>
                                          <Text className='orderMoney'>实付：<Text className='orderMoneyRed'>￥{item.transAmt}</Text></Text>
                      {/*                 <Text className='pinj'>评价</Text>
                                          <Text className='kfp'>开发票</Text>   */}
                                        </View>
                                    </View>          
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
