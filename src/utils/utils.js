let bodyEl = document.body
let top = 0

// 弹窗不能滚动
export function stopBodyScroll(isFixed) {
  if (isFixed) {
    top = window.scrollY

    bodyEl.style.position = 'fixed'
    bodyEl.style.top = -top + 'px'
  } else {
    bodyEl.style.position = ''
    bodyEl.style.top = ''

    window.scrollTo(0, top) // 回到原先的top
  }
}


// 抽奖函数
export function randomProbability(arr1, arr2) {
  let sum = 0
  let factor = 0
  let random = Math.random()
  for (let i = arr2.length - 1; i >= 0; i--) {
    sum += arr2[i] // 统计概率总和
  }
  random *= sum // 生成概率随机数
  for (let i = arr2.length - 1; i >= 0; i--) {
    factor += arr2[i]
    if (random <= factor) return arr1[i]
  }
  return null
}