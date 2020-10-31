import './index.scss';
import classNames from 'classnames';
import {Text, View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';
import frameWork  from '../../common/decorator/frameWork';
import Api from '../../../common/api';
import Loading from '../../../components/Loading';
import NavBar from '../../../components/NavBar';
import TabBar from '../../../components/TabBar';
import Authorize from '../../../components/Authorize';
import Register from '../../../components/Register';

export default class Index extends Component {
  config = {
    disableScroll: true,
    navigationBarTitleText: '签到',
    navigationStyle: 'custom',
  }
  state = {
    isLoading: true,
    showRule: false,
    showTips: false,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: [],
    cur_year: 0,
    cur_month: 0
  }
  componentWillMount() {    
    let xlId = this.$router.params.xlId;
    Api.signInfo(xlId).then(res=>{
        let { signSet, xlEnd, xlStart} = res.data;
        let signDays = signSet.length||0;
        let dateRange = this.transDate(xlStart,xlEnd);
        
        let signDateArry = [];
        for(let i in signSet){
            signDateArry.push(signSet[i].substr(6,2));
        }
        this.setState({dateRange,signDays})
        this.calendarRender(signDateArry);
    }).catch(err=>{
        console.log(err);
    })
  }

  calendarRender(signDateArry){
    //获取当前年月  
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthDays = date.getDate();

    const firstDay = new Date(Date.UTC(year, month - 1, 1)).getDay();
    const endDay = new Date(Date.UTC(year, month - 1, monthDays)).getDay();
    let calendar = [];
    for (let i = 0; i < firstDay; i++) {
      let obj = { date: '',isSign: false}
      calendar.push(obj);
    }
    for (let i = 1; i <= monthDays; i++) {
      let obj = { date: i,isSign: false }
      for(let j = 0; j<signDateArry.length; j++){
          if(signDateArry[j]==i){
             obj.isSign = true;
          }
      }
      calendar.push(obj);
    }
    for (let i = 0; i < 6-endDay; i++) {
      let obj = { date:'',isSign: false }
      calendar.push(obj);
    }
    this.setState({calendar,isLoading:false});
  }

  transDate(start,end){
      let startDate = new Date(start);
      let endDate = new Date(end);
      let str = parseInt(startDate.getMonth()+1)+'.'+startDate.getDate();
      str = str + '-' +parseInt(endDate.getMonth()+1)+'.'+endDate.getDate();
      return str;
  }

  Return = () => { Taro.navigateBack(); }
  render() {
    const { isLoading, dateRange, signDays, date,  calendar } = this.state;
    console.log('calendar', calendar)
    return (
      <View className='page'>
        {isLoading ? <Loading /> :
          <View className='container'>
            <NavBar id="fixed" title="" background='rgba(0,0,0,0)' color="#fff" showBack={true} m_page={true} back={this.Return.bind(this)} />

            <View className='wrapper'>
              <Image className="membg" src={require('../../assets/images/vip.png')}>
              </Image>
              <View className='date'>{dateRange}</View>
              <View className='all-img'>
                <View className='date-tips'>您已累计签到 <Text className='date-num'>{signDays}</Text>天</View>
                <View className='date-sign-content'>
                  <View className='date-sign'>
                    <View>第7天</View>
                    <Image className='date-tips-img' src={require('../../assets/images/vip-date.png')}></Image>
                  </View>
                  <Image className='date-round' src={require('../../assets/images/vip-round.png')}></Image>
                  <View className='date-sign'>
                    <View>第14天</View>
                    <Image className='date-tips-img' src={require('../../assets/images/vip-date.png')}></Image>
                  </View>
                  <Image className='date-round' src={require('../../assets/images/vip-round.png')}></Image>
                  <View className='date-sign'>
                    <View>第21天</View>
                    <Image className='date-tips-img' src={require('../../assets/images/vip-date.png')}></Image>
                  </View>
                  <Image className='date-round' src={require('../../assets/images/vip-round.png')}></Image>
                  <View className='date-sign'>
                    <View>第28天</View>
                    <Image className='date-tips-img' src={require('../../assets/images/vip-date.png')}></Image>
                  </View>
                </View>
              </View>
              <View className='all-content'>
                <View className='content-title'>
                  <Image className='title-img' src={require('../../assets/images/round-left.png')}></Image>
                  <View className='polite'>我的签到</View>
                  <Image className='title-img' src={require('../../assets/images/round-right.png')}></Image>
                </View>
                <View className='registered-all'>
                  <View className='all-date'>
                    <View className='all-date-one'>
                      {
                        date.map((item, index) => {
                          return (
                            <View className='date1' key={item}>
                              {item}
                            </View>
                          )
                        })
                      }
                    </View>
                    <View className='all-date-two'>
                      {
                        calendar.map((item, index) => {
                          return (
                            <View className='date2' key={item}>
                              {item.isSign && <Image className='sign-img' src={require('../../assets/images/sign.png')}></Image> }
                              <View className='sign-date'>{item.date}</View>
                            </View>
                          )
                        })
                      }
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        }
      </View>
    );
  }

}
