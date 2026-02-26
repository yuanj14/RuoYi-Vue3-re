import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { login as loginApi, logout as logoutApi, getInfo as getInfoApi } from '@/api/login' // 重命名避免和store内部方法冲突
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore('user', () => {
  // === State ===
  const token = ref(getToken())
  const id = ref('')
  const name = ref('')
  const nickName = ref('')
  const avatar = ref('')
  const roles = ref([])
  const permissions = ref([])

  // === Actions ===
  
  // 登录
  const login = async (userInfo) => {
    const username = userInfo.username.trim()
    const password = userInfo.password
    const code = userInfo.code
    const uuid = userInfo.uuid

    try {
      const res = await loginApi(username, password, code, uuid)
      setToken(res.token)
      token.value = res.token
      return res
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  const getInfo = async () => {
    try {
      const res = await getInfoApi()
      const user = res.user
      let userAvatar = user.avatar || ""
      
      if (!isHttp(userAvatar)) {
        userAvatar = (isEmpty(userAvatar)) ? defAva : import.meta.env.VITE_APP_BASE_API + userAvatar
      }

      if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        roles.value = res.roles
        permissions.value = res.permissions
      } else {
        roles.value = ['ROLE_DEFAULT']
      }
      
      id.value = user.userId
      name.value = user.userName
      nickName.value = user.nickName
      avatar.value = userAvatar

      /* 初始密码提示 */
      if(res.isDefaultModifyPwd) {
        ElMessageBox.confirm('您的密码还是初始密码，请修改密码！', '安全提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } })
        }).catch(() => {})
      }
      
      /* 过期密码提示 */
      if(!res.isDefaultModifyPwd && res.isPasswordExpired) {
        ElMessageBox.confirm('您的密码已过期，请尽快修改密码！', '安全提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } })
        }).catch(() => {})
      }
      
      return res
    } catch (error) {
      throw error
    }
  }

  // 退出系统
  const logOut = async () => {
    try {
      await logoutApi(token.value)
      token.value = ''
      roles.value = []
      permissions.value = []
      removeToken()
    } catch (error) {
      throw error
    }
  }

  return {
    token,
    id,
    name,
    nickName,
    avatar,
    roles,
    permissions,
    login,
    getInfo,
    logOut
  }
})

export default useUserStore
