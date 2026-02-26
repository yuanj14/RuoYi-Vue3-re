import { defineStore } from 'pinia'
import { ref } from 'vue'
import defaultSettings from '@/settings'
import { useDark, useToggle } from '@vueuse/core'
import { useDynamicTitle } from '@/utils/dynamicTitle'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { sideTheme, showSettings, navType, tagsView, tagsIcon, fixedHeader, sidebarLogo, dynamicTitle, footerVisible, footerContent } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const useSettingsStore = defineStore('settings', () => {
  const title = ref('')
  const theme = ref(storageSetting.theme || '#409EFF')
  const sideThemeRef = ref(storageSetting.sideTheme || sideTheme)
  const showSettingsRef = ref(showSettings)
  const navTypeRef = ref(storageSetting.navType === undefined ? navType : storageSetting.navType)
  const tagsViewRef = ref(storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView)
  const tagsIconRef = ref(storageSetting.tagsIcon === undefined ? tagsIcon : storageSetting.tagsIcon)
  const fixedHeaderRef = ref(storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader)
  const sidebarLogoRef = ref(storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo)
  const dynamicTitleRef = ref(storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle)
  const footerVisibleRef = ref(storageSetting.footerVisible === undefined ? footerVisible : storageSetting.footerVisible)
  const footerContentRef = ref(footerContent)

  const stateMap = {
    title,
    theme,
    sideTheme: sideThemeRef,
    showSettings: showSettingsRef,
    navType: navTypeRef,
    tagsView: tagsViewRef,
    tagsIcon: tagsIconRef,
    fixedHeader: fixedHeaderRef,
    sidebarLogo: sidebarLogoRef,
    dynamicTitle: dynamicTitleRef,
    footerVisible: footerVisibleRef,
    footerContent: footerContentRef,
    isDark
  }

  // 修改布局设置
  const changeSetting = (data) => {
    const { key, value } = data
    const targetRef = stateMap[key]
    if (targetRef) {
      targetRef.value = value
    }
  }

  // 设置网页标题
  const setTitle = (nextTitle) => {
    title.value = nextTitle
    useDynamicTitle()
  }

  // 切换暗黑模式
  const toggleTheme = () => {
    toggleDark()
  }

  return {
    title,
    theme,
    sideTheme: sideThemeRef,
    showSettings: showSettingsRef,
    navType: navTypeRef,
    tagsView: tagsViewRef,
    tagsIcon: tagsIconRef,
    fixedHeader: fixedHeaderRef,
    sidebarLogo: sidebarLogoRef,
    dynamicTitle: dynamicTitleRef,
    footerVisible: footerVisibleRef,
    footerContent: footerContentRef,
    isDark,
    changeSetting,
    setTitle,
    toggleTheme
  }
})

export default useSettingsStore
