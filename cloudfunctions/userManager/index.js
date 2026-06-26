// 云函数：用户管理
// 管理用户偏好设置、收藏等

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, ...data } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  switch (action) {
    case 'updatePreferences':
      return await updatePreferences(openid, data)
    case 'getPreferences':
      return await getPreferences(openid)
    case 'recordRead':
      return await recordRead(openid, data)
    default:
      return { code: -1, message: '未知操作' }
  }
}

async function updatePreferences(openid, { categories, enablePush, pushTime }) {
  try {
    const userCollection = db.collection('users')
    const result = await userCollection.where({ openid }).get()

    const userData = {
      openid,
      categories: categories || [],
      enablePush: enablePush !== undefined ? enablePush : true,
      pushTime: pushTime || '08:00',
      updatedAt: db.serverDate()
    }

    if (result.data && result.data.length > 0) {
      await userCollection.doc(result.data[0]._id).update({ data: userData })
    } else {
      userData.createdAt = db.serverDate()
      await userCollection.add({ data: userData })
    }

    return { code: 0, message: '保存成功' }
  } catch (err) {
    console.error('updatePreferences error:', err)
    return { code: -1, message: err.message }
  }
}

async function getPreferences(openid) {
  try {
    const result = await db.collection('users').where({ openid }).get()
    if (result.data && result.data.length > 0) {
      const user = result.data[0]
      return {
        code: 0,
        data: {
          categories: user.categories || [],
          enablePush: user.enablePush,
          pushTime: user.pushTime
        }
      }
    }
    return { code: 0, data: null }
  } catch (err) {
    return { code: -1, message: err.message }
  }
}

async function recordRead(openid, { articleId }) {
  try {
    await db.collection('readLogs').add({
      data: {
        openid,
        articleId,
        readAt: db.serverDate()
      }
    })
    return { code: 0, message: '记录成功' }
  } catch (err) {
    return { code: -1, message: err.message }
  }
}
