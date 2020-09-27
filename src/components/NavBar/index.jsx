import Taro, { Component } from '@tarojs/taro'
import { Text, View, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

class NavBar extends Component {

  static defaultProps = {
    title: '',
    showBack: true,
    back: Function,
    background: '#fff',
    m_page:false
  };

  state = {
    statusBarHeight: 20,
    navBarHeight: 46
  };

  componentWillMount() {
    const info = Taro.getSystemInfoSync();
    const ios = info.system.indexOf('iOS') > -1;
    this.setState({
      statusBarHeight: info.statusBarHeight || 0,
      navBarHeight: ios ? 44 : 48
    })
    if(this.props.background=="#fff"){
      Taro.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#fff"
      })
    }
  }

  /**
   * 传递样式给引用的自定义组件
   * @see https://nervjs.github.io/taro/docs/component-style.html#%E5%A4%96%E9%83%A8%E6%A0%B7%E5%BC%8F%E7%B1%BB
   */
  static externalClasses = ['class-name'];

  /**
   * 使用外部class的样式，微信小程序基础库 2.2.3+
   * @see https://nervjs.github.io/taro/docs/component-style.html#%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F%E7%B1%BB
   */
  // static options = {addGlobalClass: true};

  render() {
    const { statusBarHeight, navBarHeight } = this.state;

    return (
      <View className='nav-bar-wrap' style={{ paddingTop: `${statusBarHeight}px`, background: this.props.background, color:this.props.color }}>

        <View className={`nav-bar class-name ${this.props.className || ''}`} style={{ height: `${navBarHeight}px`, lineHeight: `${navBarHeight}px` }}>
          {/* 导航栏左侧内容 */}
          {this.props.showBack ?
          <View className='nav-bar-left' onClick={this.props.back.bind(this)}>
            <View className={classNames('at-icon', 'at-icon-chevron-left', {white: this.props.background === '#000' || this.props.color === '#fff'})} />
          </View> :
          <View className='nav-bar-left'>
            { this.props.m_page?
                <View>{ this.props.showIndex?<Image onClick={this.props.back.bind(this)} className='nav-index' src={require('./images/back.png')} />:null}</View>
                :<Image className='nav-top' src={require('./images/top.png')} />
            }
          </View>
          }

          {/* 导航栏中间内容 */}
          <View className='nav-bar-title'>
            <Text className='title'>{this.props.title}</Text>
          </View>
        </View>

      </View>
    )
  }
}

export default NavBar
