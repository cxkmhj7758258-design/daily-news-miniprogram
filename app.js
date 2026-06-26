App({
  globalData: {
    categories: [
      { id: 'politics', name: '时政', icon: '🏛️' },
      { id: 'finance', name: '财经', icon: '📊' },
      { id: 'tech', name: '科技', icon: '📱' },
      { id: 'sports', name: '体育', icon: '⚽' },
      { id: 'entertainment', name: '娱乐', icon: '🎬' },
      { id: 'health', name: '健康', icon: '💪' },
      { id: 'local', name: '本地', icon: '📍' },
      { id: 'world', name: '国际', icon: '🌍' },
      { id: 'game', name: '游戏', icon: '🎮' }
    ],
    enableDailyPush: true,
    pushTime: '08:00'
  },
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-cloud-env-id',
        traceUser: true
      })
    }
  }
})
