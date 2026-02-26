import { defineStore } from 'pinia'
import { ref } from 'vue'

const useTagsViewStore = defineStore('tags-view', () => {
  const visitedViews = ref([])
  const cachedViews = ref([])
  const iframeViews = ref([])

  const addView = (view) => {
    addVisitedView(view)
    addCachedView(view)
  }

  const addIframeView = (view) => {
    if (iframeViews.value.some(v => v.path === view.path)) return
    iframeViews.value.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  }

  const addVisitedView = (view) => {
    if (visitedViews.value.some(v => v.path === view.path)) return
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  }

  const addCachedView = (view) => {
    if (cachedViews.value.includes(view.name)) return
    if (!view.meta.noCache) {
      cachedViews.value.push(view.name)
    }
  }

  const delView = (view) => {
    return new Promise(resolve => {
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  const delVisitedView = (view) => {
    return new Promise(resolve => {
      for (const [i, v] of visitedViews.value.entries()) {
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1)
          break
        }
      }
      iframeViews.value = iframeViews.value.filter(item => item.path !== view.path)
      resolve([...visitedViews.value])
    })
  }

  const delIframeView = (view) => {
    return new Promise(resolve => {
      iframeViews.value = iframeViews.value.filter(item => item.path !== view.path)
      resolve([...iframeViews.value])
    })
  }

  const delCachedView = (view) => {
    return new Promise(resolve => {
      const index = cachedViews.value.indexOf(view.name)
      index > -1 && cachedViews.value.splice(index, 1)
      resolve([...cachedViews.value])
    })
  }

  const delOthersViews = (view) => {
    return new Promise(resolve => {
      delOthersVisitedViews(view)
      delOthersCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  const delOthersVisitedViews = (view) => {
    return new Promise(resolve => {
      visitedViews.value = visitedViews.value.filter(v => {
        return v.meta.affix || v.path === view.path
      })
      iframeViews.value = iframeViews.value.filter(item => item.path === view.path)
      resolve([...visitedViews.value])
    })
  }

  const delOthersCachedViews = (view) => {
    return new Promise(resolve => {
      const index = cachedViews.value.indexOf(view.name)
      if (index > -1) {
        cachedViews.value = cachedViews.value.slice(index, index + 1)
      } else {
        cachedViews.value = []
      }
      resolve([...cachedViews.value])
    })
  }

  const delAllViews = (view) => {
    return new Promise(resolve => {
      delAllVisitedViews(view)
      delAllCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  const delAllVisitedViews = (view) => {
    return new Promise(resolve => {
      const affixTags = visitedViews.value.filter(tag => tag.meta.affix)
      visitedViews.value = affixTags
      iframeViews.value = []
      resolve([...visitedViews.value])
    })
  }

  const delAllCachedViews = (view) => {
    return new Promise(resolve => {
      cachedViews.value = []
      resolve([...cachedViews.value])
    })
  }

  const updateVisitedView = (view) => {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }

  const delRightTags = (view) => {
    return new Promise(resolve => {
      const index = visitedViews.value.findIndex(v => v.path === view.path)
      if (index === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, idx) => {
        if (idx <= index || (item.meta && item.meta.affix)) {
          return true
        }
        const i = cachedViews.value.indexOf(item.name)
        if (i > -1) {
          cachedViews.value.splice(i, 1)
        }
        if(item.meta.link) {
          const fi = iframeViews.value.findIndex(v => v.path === item.path)
          iframeViews.value.splice(fi, 1)
        }
        return false
      })
      resolve([...visitedViews.value])
    })
  }

  const delLeftTags = (view) => {
    return new Promise(resolve => {
      const index = visitedViews.value.findIndex(v => v.path === view.path)
      if (index === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, idx) => {
        if (idx >= index || (item.meta && item.meta.affix)) {
          return true
        }
        const i = cachedViews.value.indexOf(item.name)
        if (i > -1) {
          cachedViews.value.splice(i, 1)
        }
        if(item.meta.link) {
          const fi = iframeViews.value.findIndex(v => v.path === item.path)
          iframeViews.value.splice(fi, 1)
        }
        return false
      })
      resolve([...visitedViews.value])
    })
  }

  return {
    visitedViews,
    cachedViews,
    iframeViews,
    addView,
    addIframeView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delIframeView,
    delCachedView,
    delOthersViews,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    updateVisitedView,
    delRightTags,
    delLeftTags
  }
})

export default useTagsViewStore
