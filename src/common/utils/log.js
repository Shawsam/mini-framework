var log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

module.exports = {
  debug() {
      console.log.apply(log,arguments)
      if (!log) return
      log.debug.apply(log, arguments)
  },
  info() {
      console.info.apply(log,arguments)
      if (!log) return
      log.info.apply(log, arguments)
  },
  warn() {
      console.warn.apply(log,arguments)
      if (!log) return
      log.warn.apply(log, arguments)
  },
  error() {
      console.error.apply(log,arguments)
      if (!log) return
      log.error.apply(log, arguments)
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
      if (!log || !log.setFilterMsg) return
      if (typeof msg !== 'string') return
      log.setFilterMsg(msg)
  },
  addFilterMsg(msg) { // 从基础库2.8.1开始支持
      if (!log || !log.addFilterMsg) return
      if (typeof msg !== 'string') return
      log.addFilterMsg(msg)
  }
}