import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

const useAppStore = defineStore('app', () => {
  const sidebar = ref({
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
    hide: false
  })
  const device = ref('desktop')
  const size = ref(Cookies.get('size') || 'default')

  const toggleSideBar = (withoutAnimation) => {
    if (sidebar.value.hide) {
      return false
    }
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = withoutAnimation
    if (sidebar.value.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  }

  const closeSideBar = ({ withoutAnimation }) => {
    Cookies.set('sidebarStatus', 0)
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  const toggleDevice = (nextDevice) => {
    device.value = nextDevice
  }

  const setSize = (nextSize) => {
    size.value = nextSize
    Cookies.set('size', nextSize)
  }

  const toggleSideBarHide = (status) => {
    sidebar.value.hide = status
  }

  return {
    sidebar,
    device,
    size,
    toggleSideBar,
    closeSideBar,
    toggleDevice,
    setSize,
    toggleSideBarHide
  }
})

export default useAppStore
