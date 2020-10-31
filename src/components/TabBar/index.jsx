import './index.scss'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'

export default class TabBar extends Taro.Component {
    // 默认参数配置
    static defaultProps = {
        background:'#911414',
        selected: 0,
        color: "rgba(255,255,255,0.5)",
        selectedColor: "#fff",
        list: [
          {
            "pagePath": "/pages/index/index",
            "iconPath": require("./images/tab1.png"),
            "selectedIconPath": require("./images/tab1_active.png"),
            "text": "首页",
            "pageName": "首页"
          },
          {
            "pagePath": "/pages/store/index",
            "iconPath": require("./images/tab2.png"),
            "selectedIconPath": require("./images/tab2_active.png"),
            "text": "门店",
            "pageName": "门店页"
          },
          {
            "pagePath": "/pages/mine/index",
            "iconPath": require("./images/tab3.png"),
            "selectedIconPath": require("./images/tab3_active.png"),
            "text": "我的",
            "pageName": "个人中心页"
          }]
    }

    constructor(props) {
        super(props)
        this.state = {
            selected: props.selected
        }
    }

    switchTab(item,index) {
      const url = item.pagePath;
      Taro.switchTab({url});
    }

    render() {
        const { color, selectedColor, background, list } = this.props
        const { selected } = this.state
        return (
            <View className="tab-bar" style={{background:background}}>
                <View className="tab-bar-border"></View>
                    {list.map((item, index) => (
                        <View className={ `tab-bar-item ${index==1?'center':''}` } key={index} onClick={this.switchTab.bind(this, item, index)}>
                            <Image className="icon" src={selected == index?item.selectedIconPath:item.iconPath} />
                            <Text className="text" style={{color: selected == index ? selectedColor : color}}>{item.text}</Text>
                        </View>
                    ))}

            </View>
        );
    }
}
