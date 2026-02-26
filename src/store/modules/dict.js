import { defineStore } from 'pinia'
import { ref } from 'vue'

const useDictStore = defineStore('dict', () => {
  const dict = ref(new Array())

  // 获取字典
  const getDict = (_key) => {
    if (_key == null && _key == "") {
      return null
    }
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key == _key) {
          return dict.value[i].value
        }
      }
    } catch (e) {
      return null
    }
  }

  // 设置字典
  const setDict = (_key, value) => {
    if (_key !== null && _key !== "") {
      dict.value.push({
        key: _key,
        value: value
      })
    }
  }

  // 删除字典
  const removeDict = (_key) => {
    var bln = false
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key == _key) {
          dict.value.splice(i, 1)
          return true
        }
      }
    } catch (e) {
      bln = false
    }
    return bln
  }

  // 清空字典
  const cleanDict = () => {
    dict.value = new Array()
  }

  // 初始字典
  const initDict = () => {
  }

  return {
    dict,
    getDict,
    setDict,
    removeDict,
    cleanDict,
    initDict
  }
})

export default useDictStore
