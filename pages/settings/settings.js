Page({
  data: { cats: [], cnt: 0, push: true, ptime: '08:00' },

  onLoad() { this.loadCats(); this.loadPush() },

  loadCats() {
    const sel = wx.getStorageSync('selectedCategories') || []
    const app = getApp()
    const cats = app.globalData.categories.map(c => ({ ...c, sel: sel.includes(c.id) }))
    this.setData({ cats, cnt: cats.filter(c => c.sel).length })
  },

  loadPush() {
    const push = wx.getStorageSync('enablePush')
    const ptime = wx.getStorageSync('pushTime')
    this.setData({ push: push !== '' ? push : true, ptime: ptime || '08:00' })
  },

  tog(e) {
    const id = e.currentTarget.dataset.id
    const cats = this.data.cats.map(c => c.id === id ? { ...c, sel: !c.sel } : c)
    const cnt = cats.filter(c => c.sel).length
    if (cnt < 3 && !cats.find(c => c.id === id).sel) {
      wx.showToast({ title: '至少选3个领域', icon: 'none' })
      return
    }
    this.setData({ cats, cnt })
  },

  save() {
    const sel = this.data.cats.filter(c => c.sel).map(c => c.id)
    if (sel.length < 3) { wx.showToast({ title: '至少选3个领域', icon: 'none' }); return }
    wx.setStorageSync('selectedCategories', sel)
    wx.setStorageSync('enablePush', this.data.push)
    wx.setStorageSync('pushTime', this.data.ptime)
    wx.showToast({ title: '保存成功', icon: 'success' })
    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'userManager',
        data: { action: 'updatePreferences', categories: sel, enablePush: this.data.push, pushTime: this.data.ptime }
      }).catch(() => {})
    }
  },

  togPush(e) { this.setData({ push: e.detail.value }) },
  onTime(e) { this.setData({ ptime: e.detail.value }) }
})
