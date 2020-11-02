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

const Env = Taro.getEnv();
const frameOptions = {
  userInfoCached:false,
  loadToAuthorize:false
}
let disableOnshow = false, isFirstShow = true, pageData, shopId;
@frameWork(frameOptions)
export default class storeList extends Component {
  config = {
    disableScroll: true
  }

  state={
    isLoading:true
  }

  userInfoReady() {
      console.log(this.$router.params);
      Api.crmOrderDetail({orderNo2:this.$router.params.orderNo}).then(res=>{
          this.setState({isLoading:false,info:res.data});
      }).catch(err=>{
          console.log(err)
          Taro.showModal({  content:err.msg,
                            showCancel:false,
                            success:()=>{
                                this.Return()
                            }
                        })
      })
  }
  render() {
    let { isLoading, info } = this.state;
    return (
      <View className='page'>
        { isLoading ? <Loading /> :
        <View className='container'>
          <NavBar title="订单详情" background='#F4F5F6' showBack={true} m_page={true} back={this.Return.bind(this)} />
          <View className="wrapper">
            <View className='detailAll'>
              <Text className='titleText'>仅显示最近30天内消费记录</Text>
              <View className='detailImg'>
                <View className='detailtitleTextp'><Text className='detailtitleText'>{info.shopName}</Text></View>
                <View className='orderdata'>订单信息</View>
                <View className='detailAllText'>
                  <ScrollView
                    className='scrollview'
                    scrollY
                    scrollWithAnimation
                    style='max-height:150px;'>
                    {
                          info.orderGoodsList.map((item,index)=>{
                            return(
                                <View className='orderdataAll'>
                                    <View className='detailone'>{item.goodsName}</View>
                                    <View className='detailTwo'>*{item.goodsCount}</View>
                                    <View className='detailThree'>￥{item.price}</View>
                              </View>
                            )
                          })
                    }
                  </ScrollView>
                </View>
                {/*
                <View className='orderdataYouHui'>优惠信息</View>
                <View className='orderdataAll'>
                  <View className='detailone'>指定饮品品尝券</View>
                  <View className='detailThree'>￥38</View>
                </View>
                */}

                <View className='orderdataYouHui'>总计</View>
                <View>
                  <View className='detailHeJi'>共计{info.orderGoodsList.length}件 合计金额<Text className='detailHeJiMoneydata'>￥{info.transAmt}</Text></View>
                </View>


                <View className='orderdatazhifuall'><View className='orderdatazhifu'>支付方式</View><View className='wechatall'><Image src={require('../../assets/images/wechatpay.png')} className='wechat'></Image><Text className='wechatText'>微信支付</Text></View></View>

              </View>


              <View className='underText'>
                <Text>订单编号：{info.orderNo}</Text>
                <Text>交易编号：{info.logSeq}</Text>
                <Text>下单时间：{info.orderDate}</Text>
                <Text>下单门店：{info.shopName}</Text>
              </View>

              <View className='twobtn'>
{/*              <View className='pinjbig'>评价</View>
                <View className='kaifap'>开发票</View>  */}
              </View>

            </View>



          </View>

        </View>
        }
      </View>
    )
  }
}
