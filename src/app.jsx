import './app.scss'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import { base } from './config'
import Index from './pages/index'
import log from './common/utils/log'
import * as app from './common/utils/app'
import userStore from './common/store/user'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
const Env = Taro.getEnv();
const store = {
  userStore
};

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/order/index',
      'pages/mine/index',
      'pages/coupon/index',
      'pages/couponDetail/index',
      'pages/couponFetch/index',
      'pages/couponInvalid/index',
      'pages/webview/index',
      'pages/example/index',
    ],
    window: {
      backgroundTextStyle:'light',
      navigationBarBackgroundColor: '#911414',
      navigationBarTitleText: '拳击猫',
      navigationBarTextStyle: 'white',
    },
    "networkTimeout": {
      "request": 7000,
      "downloadFile": 10000
    },
    "tabBar": {
      "custom": true,
      "list": [
        {
          "pagePath": "pages/index/index"
        },
        {
          "pagePath": "pages/order/index"
        },
        {
          "pagePath": "pages/mine/index"
        }
      ]
    },
    permission: {
      "scope.userLocation": {
        "desc": "您的位置信息将用于获取附近的餐厅信息。"
      }
    }
  };

  componentDidMount() { }

  componentDidHide() { }
  
  componentDidShow() {
      base.isForceUpdate && app.versionUpdate();
  }

  componentDidCatchError(err) {
      log.error(err);
  }

  // App 类中的 render() 函数没有实际作用, 请勿修改此函数!!!
  render() {
    return (
        <Provider store={store}>
            <Index />
        </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
