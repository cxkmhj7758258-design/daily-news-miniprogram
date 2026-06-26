// 云函数：每日推送
// 由云开发定时触发器调用，每天早上8点推送早报给用户

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const hour = now.getHours().toString().padStart(2, '0')

  console.log(`[每日推送] 开始执行: ${today} ${hour}:00`)

  try {
    // 1. 获取所有开启了推送的用户
    const userResult = await db.collection('users').where({
      enablePush: true
    }).get()

    const users = userResult.data || []
    console.log(`[每日推送] 找到 ${users.length} 个订阅用户`)

    if (users.length === 0) {
      return { code: 0, message: '没有需要推送的用户' }
    }

    // 2. 对每个用户发送订阅消息
    const pushResults = []
    for (const user of users) {
      const categories = user.categories || []
      
      if (categories.length < 3) {
        console.log(`[每日推送] 用户 ${user._id} 关注领域不足3个，跳过`)
        continue
      }

      // 获取该用户关注的新闻
      const newsResult = await db.collection('news').where({
        date: today,
        category: db.command.in(categories)
      }).get()

      const newsCount = newsResult.data ? newsResult.data.length : 0
      const topNews = newsResult.data && newsResult.data.length > 0 
        ? newsResult.data[0].title 
        : '今日新闻已更新'

      try {
        // 发送微信订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: user.openid,
          page: 'pages/index/index',
          data: {
            thing2: { value: `今日早报已送达，共${newsCount}条新闻` },
            thing3: { value: topNews },
            time4: { value: `${now.getMonth()+1}月${now.getDate()}日 ${hour}:00` }
          },
          templateId: 'your-subscribe-template-id' // 需要在小程序后台申请
        })
        pushResults.push({ userId: user._id, status: 'success' })
      } catch (pushErr) {
        console.error(`[每日推送] 用户 ${user._id} 推送失败:`, pushErr)
        pushResults.push({ userId: user._id, status: 'fail', error: pushErr.message })
      }
    }

    // 3. 记录推送日志
    await db.collection('pushLogs').add({
      data: {
        date: today,
        time: `${hour}:00`,
        totalUsers: users.length,
        successCount: pushResults.filter(r => r.status === 'success').length,
        failCount: pushResults.filter(r => r.status === 'fail').length,
        createdAt: db.serverDate()
      }
    })

    return {
      code: 0,
      message: `推送完成: 成功 ${pushResults.filter(r => r.status === 'success').length} / 总 ${users.length}`
    }
  } catch (err) {
    console.error('[每日推送] 执行失败:', err)
    return { code: -1, message: err.message }
  }
}
