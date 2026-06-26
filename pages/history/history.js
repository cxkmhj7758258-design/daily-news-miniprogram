Page({
  data: {
    initials: '早',
    selectedCount: 0,
    todayCount: 0,
    readCount: 0
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const selected = wx.getStorageSync('selectedCategories') || []
    const readCount = wx.getStorageSync('readCount') || 0
    this.setData({
      selectedCount: selected.length,
      todayCount: selected.length * 2,
      readCount: readCount
    })
  },

  goSettings() {
    wx.switchTab({ url: '/pages/settings/settings' })
  },

  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '清除缓存不会影响你的关注设置',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('readCount', 0)
          this.setData({ readCount: 0 })
          wx.showToast({ title: '已清除', icon: 'success' })
        }
      }
    })
  },

  feedback() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  about() {
    wx.showModal({
      title: '关于每日早报',
      content: '每日早报 v1.0\n\n每天为你推送精选新闻\n关注你感兴趣的领域\n让阅读更高效',
      showCancel: false
    })
  }
})
