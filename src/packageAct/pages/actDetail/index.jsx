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
import QR from '../../../common/lib/qrcode.js'

const Env = Taro.getEnv();
const frameOptions = {
  userInfoCached:false,
  loadToAuthorize:true
}
let disableOnshow = false, isFirstShow = true, pageData, shopId;

@frameWork(frameOptions)
export default class Index extends Component {
  config = {
    disableScroll: true,
    navigationBarTitleText: '个人信息',
    navigationStyle: 'custom',
  }
  state = {
    isLoading: true,
    showRule: false,
    showTips: false,
    info:{
        currentSignDays:0,
        currentNumber:0,
        signDays:5,
        dateRange:'2020.10.22-11.22'
    }
  }

  componentDidShow(){
      if(isFirstShow) return;
      this.getXlAct();
  }

  componentDidHide(){
      isFirstShow = false;
  }

  userInfoReady() {
      this.getXlAct();
  }

  transDate(start,end){
      let startDate = new Date(start);
      let endDate = new Date(end);
      let str = startDate.getFullYear()+'.'+parseInt(startDate.getMonth()+1)+'.'+startDate.getDate();
      str = str + '-' +parseInt(endDate.getMonth()+1)+'.'+endDate.getDate();
      return str;
  }

  //蓄力有礼
  getXlAct(){
      Api.getXlAct().then(res=>{
          let info = res.data;
          info.dateRange = this.transDate(info.startTime,info.endTime)
          if(info.currentNumber==5){
              this.setState({info, isLoading:false,showTips:true});
          }else{
              this.setState({info, isLoading:false});
          }          
      }).catch(err=>{
          console.log(err);
          Taro.showModal({  content:err.msg,
                            showCancel:false,
                            success:()=>{
                                this.Return()
                            }
                         })
      });
  }
   
  actSign(xlId,e){
      e.stopPropagation();
      Api.actSign(xlId).then(res=>{
          Taro.navigateTo({
            url: '/packageAct/pages/actSign/index?xlId='+xlId
          })
      }).catch(err=>{
          console.log(err);
          Taro.showModal({  content:err.msg,
                            showCancel:false
                         })
      })
  }

  openSign(xlId){
      Taro.navigateTo({
        url: '/packageAct/pages/actSign/index?xlId='+xlId
      })
  }

  showRule() {
      this.setState({ showRule: true })
  }

  closeRule() {
      this.setState({ showRule: false })
  }

  closeTips(){
      this.setState({ showTips:false })
  }

  render() {
    const { isLoading, showRule, showTips, info } = this.state;
    return (
      <View className='page'>
        { isLoading ? <Loading /> :
          <View className='container'>
            <NavBar id="fixed" title="" background='rgba(0,0,0,0)' color="#fff" showBack={true} m_page={true} back={this.Return.bind(this)} />

            <View className='wrapper'>
              <Image className="membg" src={require('../../assets/images/polite.png')}>
              </Image>
              <View className='all-img'>
                  {
                    [1,2,3,4,5].map((item,index) => {
                      return (
                          index<info.currentNumber?<Image className='membg-img img-right' src={require('../../assets/images/polite1.png')}></Image>
                          :<Image className='membg-img img-right' src={require('../../assets/images/polite2.png')}></Image>
                      )
                    })
                  }
              </View>
              <View className='all-content'>
                <View className='content-title'>
                  <Image className='title-img' src={require('../../assets/images/round-left.png')}></Image>
                  <View className='polite'>蓄力任务</View>
                  <Image className='title-img' src={require('../../assets/images/round-right.png')}></Image>
                </View>
                <View className="date"><Image className='icon' src={require('../../assets/images/date.png')} />{info.dateRange}</View>
                { info.registerMark && 
                <View className='registered-all'>
                  <View className='registered'>
                    <Image className='registered-left' src={require('../../assets/images/polite-go.png')}></Image>
                    <View className='registered-right'>
                      <View className='registered-title'>注册成为拳击猫会员</View>
                      <View className='registered-title-bottom'>
                        注册成功即可得
                      <Image className='polite-right-img' src={require('../../assets/images/polite-much.png')}></Image>
                        <Text className='add'>+1</Text>
                      </View>
                    </View>
                  </View>
                  <View className='registered-btn disabled'>已完成</View>
                </View>
                }
                <View className='registered-all'  onClick={this.openSign.bind(this,info.xlId)}>
                  <View className='registered'>
                    <Image className='registered-left' src={require('../../assets/images/polite-date.png')}></Image>
                    <View className='registered-right'>
                      <View className='registered-title'>累计签到（{info.currentSignDays}/{info.signDays}）</View>
                      <View className='registered-title-bottom'>
                        累计签到{info.signDays}天即可得
                      <Image className='polite-right-img' src={require('../../assets/images/polite-much.png')}></Image>
                        <Text className='add'>+1</Text>
                      </View>
                    </View>
                  </View>
                  { info.todaySign?<View className='registered-btn disabled'>已完成</View>
                    :<View className='registered-btn' onClick={this.actSign.bind(this,info.xlId)}>去完成</View>
                  }
                  
                </View>
                <View className='registered-all'>
                  <View className='registered'>
                    <Image className='registered-left' src={require('../../assets/images/polite-buy.png')}></Image>
                    <View className='registered-right'>
                      <View className='registered-title'>到店消费</View>
                      <View className='registered-title-bottom'>
                        线下实体店消费一次即可得
                      <Image className='polite-right-img' src={require('../../assets/images/polite-much.png')}></Image>
                        <Text className='add'>+1</Text>
                      </View>
                    </View>
                  </View>
                  { info.orderMark?<View className='registered-btn disabled'>已完成</View>
                    :<View className='registered-btn'>去完成</View>
                  }
                </View>
                <View className='registered-bottom'>
                  {/*  <View className='my-task flex'>我的任务</View>  */}
                  <View className='rule flex' onClick={this.showRule.bind(this)}>活动规则</View>
                </View>
              </View>
            </View>
            {
              showRule ?
                <View class="panel panelShare">
                  <View className="shadow"></View>
                  <View className="panelContent" catchtouchmove="ture">
                    <View className='content'>
                      <View className="title">蓄力有礼活动规则</View>
                      <View className="instruct">
                        <View className="txt">1. 用户注册之日起每30个自然日一个循环；</View>
                        <View className="txt">2.循环内积满5个杯子，即可获得奖励，活动不会自动进入进的一轮（即用户10月1日注册，10月15日完成5个杯子的蓄力，那么下次活动是10月31日开始，杯子从0开始计算）；</View>
                        <View className="txt">3. 蓄力方式 ：</View>
                        <View className="txt">a. 注册送1杯（第二个轮次开始无此福利）</View>
                        <View className="txt">b. 累计签到7天送1杯（单活动周期内循环，即一个活动周期内上限通过签到获取4杯的蓄力）</View>
                        <View className="txt">c. 产生订单，这点明确目前CRM只能获取到门店POS发起的订单，商城/外卖的无法获取</View>
                      </View>
                    </View>
                    <Image className="closeBtn2" onClick={this.closeRule.bind(this)} src={require('../../assets/images/close.png')} />
                  </View>
                </View>
                : ''

            }  
            {
              showTips ?
              <View class="panel panelShare">
              <View className="shadow"></View>
              <View className="panelContent" catchtouchmove="ture">
                <Image className='cat' src={require('../../assets/images/cat.png')}></Image>
                <View className='content'>
                  <View className="title">恭喜您！已完成蓄力！</View>
                  <View className="title">活动奖励已发放到您的券包</View>
                </View>
                <Image className="closeBtn2" onClick={this.closeTips.bind(this)} src={require('../../assets/images/close.png')} />
              </View>
            </View>
            : ''

            }
           


          </View>
        }
      <Authorize showCancel={false} authorizeSuccess={this.fetchUserInfoById.bind(this)} />
      <Register showCancel={false} registerSuccess={this.fetchUserInfoById.bind(this)} />
      </View>
    );
  }

}
