import { Component } from '@tarojs/taro'
import { View, Image, Text} from '@tarojs/components'
import './index.scss'

export default class Loading extends Component {
  render() {
    return (
      <View className="loading">
          <View className="main">
              <Image className="loadingImg" src={require('./images/loading.gif')} />
              <View>加载中...</View>
          </View>
      </View>
    )
  }
}
