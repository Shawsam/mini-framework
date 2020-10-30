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
    navigationBarTitleText: '积分明细',
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
          Api.fetchPointList({ status, pageNo }).then(res=>{
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
          Api.fetchPointList({ status, pageNo }).then(res=>{
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

  transDate(str){
      if(str){
          return(str.substring(0,4)+'-'+str.substring(4,6)+'-'+str.substring(6,8))
      }
  }

  transTime(str){
      if(str){
          return(str.substring(0,2)+':'+str.substring(2,4)+':'+str.substring(4,6))
      }
  }

  formatTime(date,prevYear=0) {
      date = new Date(date);
      let year = date.getFullYear() - prevYear;
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return [year, month, day].map(this.formatNumber).join('');
  }

  formatNumber(n) {
      n = n.toString();
      return n[1] ? n : '0' + n;
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


  openExchangePage() {
    Taro.redirectTo({url:'/pages/pointsMall/index'});
  }

  render() {
    const { isLoading, cates, listData, scrollTop, listInit, noMore  } = this.state;
    const { userInfo } = this.props.userStore;

    return (
      <View className='page'>
        { isLoading?<Loading/>:
          <View className='container'>
              <View className='pointmall'>
                <View className='pointdata'>
                  <Text className='pointql'>拳力值：</Text>
                  <View className='pointone'>
                    <View>
                      <Image src={require('../../assets/images/xiaoquanquan.png')} className='xiaoquanquan'></Image>
                      <Text className='pointqlnumber'>{userInfo.point}</Text></View>
                    <View className='pointtextdh' onClick={this.openExchangePage}><Text className='pointdh'>去兑换</Text></View>
                  </View>
                </View>
              </View>

              <View className='pointmallyellow'>
                <View className='xcqcssAll'> <Image src={require('../../assets/images/xcq.png')} className='xcqcss'></Image>
                  <Text className='xcqtext'>积分促销活动即将开始，部分商品积分减半兑换</Text></View>
              </View>

               {  cates.length?
                    <View className='twotype'>
                    {
                        cates.map((item,index)=>{
                            return(
                              <View onClick={this.switchCate.bind(this,index)}><View className={ `cate ${index==frameIndex?'active':''}` }>{item.categoryName}</View></View>
                            )
                        })
                    }
                    </View>:null
              }

              <View className="wrapper">
                  <ScrollList emptyImg={require('../../assets/images/empty.png')} 
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
                                  <View className='itemCon'>
                                    <View className='item'>
                                      <Text className='mxnumber'>{item.transCode=='A017'?'+':'-'}{item.points}</Text>
                                      <Text className='mxnumberzs'>{item.transNoChildDesc}</Text>
                                    </View>
                                    <View className='mxtime'>{item.transDate}</View>
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
