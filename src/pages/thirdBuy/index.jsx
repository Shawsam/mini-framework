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
    isLoading: false,
    userInfos: {},
    userInfo: {},
    sex: 1,
    thisname: '',
    mobiles: ''
  }
  componentWillMount() {

  }
  componentDidShow() {

  }
  updateUserInfo() {

  }
  touchend() {

  }
  birthChoose(e) {
    let userInfos = this.state.userInfos;
    userInfos.birth = e.detail.value
    this.setState({ userInfos })
  }
  formatTime() {

  }
  touchend() {

  }
  onInput() {

  }
  onInput1() {

  }
  sexCho(type) {
    this.setState({ sex: type });
  }

  Return = () => { Taro.navigateBack(); }
  render() {
    const { isLoading, mobiles, sex, username, userInfos, thisname, userInfo } = this.state;
    return (
      <View className='page'>
        {isLoading ? <Loading /> :
          <View className='container'>
            <NavBar id="fixed" title="" background='rgba(0,0,0,0)' color="#fff" showBack={true} m_page={true} back={this.Return.bind(this)} />

            <View className='wrapper'>
              <View className="membg">

              </View>
              <View className='all-content'>
                <View className='content-left'>
                  <Image className='content-left-img' src={require('../../assets/img/go-buy-img.png')}></Image>
                </View>
                <View className='all-content-right'>
                  <View className='all-content-name'>拳击猫(Boxing cat)芒翻
                  了 芒果味浑浊IPA啤酒
                  500ml*6听</View>
                  <View className='information'> 
                    <View className='information-content'>中国大陆</View>
                    <View className='information-content'>精酿</View>
                    <View className='information-content'>13.4°p</View>
                  </View>
                  <View>
                    <Text className='pirce'>￥</Text>
                    <Text className='pirce-content'>159</Text>
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
