import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import './index.scss'
import NavBar from '../../../components/NavBar'

export default class Index extends Component {
  config = {
    disableScroll: true,
    navigationBarTitleText: '签到',
    navigationStyle: 'custom',
  }
  state = {
    isLoading: false,
    showRule: false,
    showTips: false,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    cur_year: 0,
    cur_month: 0,
    day7: 7,
  }
  componentWillMount() {
    //获取当前年月  
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
  }
  componentDidShow() {

  }
  // 获取当月共多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate()
  }
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  }
  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids(year, month) {
    var that = this;
    //计算每个月时要清零
    that.setState({ days: [] });
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: ' ',
          isSign: false
        }
        that.state.days.push(obj);
      }
      this.setState({
        days: that.state.days
      });
      //清空
    } else {
      this.setState({
        days: []
      });
    }
  }
  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays(year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false
      }
      that.state.days.push(obj);
    }
    this.setState({
      days: that.state.days
    });
  }

  Return = () => { Taro.navigateBack(); }
  render() {
    const { isLoading, days,day7 } = this.state;
    console.log('days', days)
    return (
      <View className='page'>
        {isLoading ? <Loading /> :
          <View className='container'>
            <NavBar id="fixed" title="" background='rgba(0,0,0,0)' color="#fff" showBack={true} m_page={true} back={this.Return.bind(this)} />

            <View className='wrapper'>
              <Image className="membg" src={require('../../assets/images/vip.png')}>
              </Image>
              <View className='date'>10.21-11.19</View>
              <View className='all-img'>
                <View className='date-tips'>您已累计签到 <Text className='date-num'>0</Text>天</View>
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
                        this.state.date.map((item, index) => {
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
                        this.state.days.map((item, index) => {
                          return (
                            <View className='date2' key={item}>
                              {/* <Image className='sign-img' src={require('../../assets/images/sign.png')}></Image> */}
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
