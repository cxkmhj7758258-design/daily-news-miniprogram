Page({
  data: {
    categories: [],
    selectedCount: 0,
    enablePush: true,
    pushTime: '08:00',
    showSuccess: false
  },

  onLoad() {
    this.loadCategories()
    this.loadPushSettings()
  },

  loadCategories() {
    const app = getApp()
    const selected = wx.getStorageSync('selectedCategories') || []
    const categories = app.globalData.categories.map(c => ({
      ...c,
      selected: selected.includes(c.id)
    }))
    this.setData({
      categories,
      selectedCount: categories.filter(c => c.selected).length
    })
  },

  loadPushSettings() {
    const enablePush = wx.getStorageSync('enablePush')
    const pushTime = wx.getStorageSync('pushTime')
    this.setData({
      enablePush: enablePush !== '' ? enablePush : true,
      pushTime: pushTime || '08:00'
    })
  },

  toggleCategory(e) {
    const id = e.currentTarget.dataset.id
    const categories = this.data.categories.map(c => {
      if (c.id === id) {
        return { ...c, selected: !c.selected }
      }
      return c
    })
    const selectedCount = categories.filter(c => c.selected).length
    this.setData({ categories, selectedCount })
  },

  saveSettings() {
    const selected = this.data.categories.filter(c => c.selected).map(c => c.id)
    wx.setStorageSync('selectedCategories', selected)
    wx.setStorageSync('enablePush', this.data.enablePush)
    wx.setStorageSync('pushTime', this.data.pushTime)

    this.setData({ showSuccess: true })
    setTimeout(() => {
      this.setData({ showSuccess: false })
    }, 2500)

    // 如果有云开发，同步到云数据库
    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'updatePreferences',
          categories: selected,
          enablePush: this.data.enablePush,
          pushTime: this.data.pushTime
        }
      }).catch(() => {})
    }

    wx.vibrateShort({ type: 'light' })
  },

  togglePush(e) {
    this.setData({ enablePush: e.detail.value })
  },

  onTimeChange(e) {
    this.setData({ pushTime: e.detail.value })
  }
})
