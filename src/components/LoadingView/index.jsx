import { Component } from '@tarojs/taro'
import { View, Image, Text} from '@tarojs/components'
import './index.scss'

export default class LoadingView extends Component {
  render() {
    return (
      <View className="loadingView"><Image className="loadingImg" src={require('./images/loading.gif')} />加载中...</View>
    )
  }
}
