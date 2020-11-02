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
let cateEmpty = false;

@frameWork(frameOptions)
export default class storeList extends Component {
  config = {
    navigationBarTitleText: '积分商城',
    disableScroll: true
  }

  state ={
      isLoading:true,
      cates:[],
      listData:[]
  }
  
  userInfoReady(){
      cateEmpty = false;
      frameIndex = 0;
      frameArry = [];
      Api.fetchShopCategory().then(res => {
          let cates = res.data;
          //cates.unshift({categoryId:0,categoryName:'全部'})
          if(cates.length){
            for(let i in cates){
                const singleItem = cates[i];
                singleItem.pageNo = 1;
                singleItem.listData = [];
                singleItem.noMore = false;
                frameArry.push(singleItem);
            }
            this.setState({cates})
          }else{
            return Promise.reject({msg:'暂无分类'})
          }
      }).then((res) => {
          this.listInit()
      }).catch(err => {
          console.log(err);
          if(err.msg=="暂无分类"){
            cateEmpty = true;
            this.setState({isLoading:false})
          }else{
            Taro.showModal({
                            content:err.msg,
                            showCancel:false,
                            success:()=>{
                                this.componentDidMount()
                            }
                        })
          }
      });
  }

  listInit() {
    if(cateEmpty){
        return Promise.resolve()
    }else{
      pageNo = 1;
      frameArry[frameIndex].pageNo = 1;
      this.setState({listInit:true});

      let { isLoading } = this.state;
      !isLoading && Taro.showLoading({title:'加载中...',mask:true});

      let categoryId = frameArry[frameIndex].categoryId;
      return new Promise((resolve,reject)=>{
          Api.fetchGoodsList({ categoryId, pageNo }).then(res => {
              resolve(res);
              Taro.hideLoading();
              let listData = res.data;
              let noMore = listData.length!=10;
              frameArry[frameIndex].listData = listData; 
              frameArry[frameIndex].noMore = noMore; 
              this.setState({isLoading:false, listInit:false, listData, noMore});
          }).catch(err => {
              resolve(err);
              console.log(err);
              Taro.hideLoading();
              Taro.showModal({
                                content:err.msg||'内部错误',
                                showCancel:false,
                                success:()=>{
                                    this.listInit()
                                }
                            })
          });
      })
    }
  }

  loadMoreData() {
    let { listData } = this.state;
    pageNo++;
    frameArry[frameIndex].pageNo = pageNo;
    
    let categoryId = frameArry[frameIndex].categoryId;
    return new Promise((resolve,reject)=>{
        Api.fetchGoodsList({ categoryId, pageNo }).then(res => {
            resolve(res)
            let resData = res.data;
            let noMore = resData.length!=10;
            listData = listData.concat(resData)
            frameArry[frameIndex].listData = listData; 
            frameArry[frameIndex].noMore = noMore; 
            this.setState({listData,noMore});
        }).catch(err => {
            resolve(err)
            console.log(err);
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

  updatePoints(){
      Api.fetchUserInfoById().then(res=>{
          let userInfo = res.data;
          this.props.userStore.setUserInfo(userInfo);         //同步用户数据             
      }).catch(err=>{
          console.log(err);
      })
  }

  goodsExChange(item){
     let { goodsId, points, goodsName } = item;
     Taro.showModal({
        title:`确定使用${points}拳力值兑换${goodsName}吗？`,
        success:(res)=>{
           if(res.confirm){
               Api.goodsExChange(goodsId, points).then(res=>{
                 Taro.showModal({   content:'兑换成功',
                                    showCancel:false,
                                    success:()=>{
                                        this.updatePoints();
                                        this.listInit()
                                    }
                                }) 
              }).catch(err => {
                 console.log(err);
                 if(err.errcode=="200001"){
                      Taro.showModal({    content:"该商品已售罄",
                                          showCancel:false,
                                          success:()=>{
                                              this.listInit()
                                          }
                                      }) 
                  }else{
                      Taro.showModal({  content:err.msg,
                                        showCancel:false,
                                        success:()=>{
                                            this.listInit()
                                        }
                                    }) 
                  }
              });
          }
        }
     })
  }

  openDetailPage(){
     Taro.redirectTo({url:'/pages/pointsDetail/index'});
  }

  render() {
    const { isLoading, cates, listData, scrollTop, listInit, noMore  } = this.state;
    const { userInfo } = this.props.userStore;
    return (
      <View className='page'>
        { isLoading?<Loading/>:
          <View className='container'>
              <NavBar title="积分商城" background='#911414'  color="#fff" showBack={true} m_page={true} back={this.Return.bind(this)} />
              <View className='pointmall'>
                <View className='pointdata'>
                  <Text className='pointql'>拳力值：</Text>
                  <View className='pointone'>
                    <View>
                      <Image src={require('../../assets/images/xiaoquanquan.png')} className='xiaoquanquan'></Image>
                      <Text className='pointqlnumber'>{userInfo.point}</Text></View>
                    <View className='pointtextdh' onClick={this.openDetailPage.bind(this
                      )}><Text className='pointdh'>明细</Text></View>
                  </View>
                </View>
              </View>

              <View className='pointmallyellow'>
                <View className='xcqcssAll'> <Image src={require('../../assets/images/xcq.png')} className='xcqcss'></Image>
                  <Text className='xcqtext'>积分促销活动即将开始，部分商品积分减半兑换</Text></View>
              </View>
              
              {  cates.length?
                    <View className='fivetype'>
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
                  <ScrollList emptyImg={require('../../assets/images/goodsEmpty.png')} 
                              emptyStr = "暂无商品" 
                              scrollTop = { scrollTop } 
                              isInit = { listInit }  
                              dataLength={ listData.length } 
                              noMore = { noMore }                            
                              pullToRefresh={this.listInit.bind(this)} 
                              pullToLoad={this.loadMoreData.bind(this)}>
                      {
                          listData.map((item,index)=>{
                              return(
                                  <View className='itemCon' onClick={this.goodsExChange.bind(this,item)}>
                                    <View className="item">
                                        <View className='typedataimgk'>
                                            <Image src={item.masterImgUrl?item.masterImgUrl:require('../../assets/images/beer.png')} className='typedataimg' mode='aspectFill'></Image>
                                        </View>
                                        <View className='typetwotext'>
                                          <Text className='typet text-ellipsis'>{item.goodsName}</Text>
                                          <Text className='typetw'><Text className='typetwnumber'>{item.points}</Text>拳力值</Text>
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
