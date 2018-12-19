import Vue from 'vue'
import {parseTime} from '@/utils/index'

Vue.filter('formatTime', (time) => {
  if (time === null || time === 'undefined' || time === undefined || time === null || time === 'null') {
    return null
  } else {
    let datetime = parseTime(time, '{y}-{m}-{d}')
    return datetime
  }
})
