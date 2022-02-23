import { VueConstructor } from 'vue'
import moment from 'moment'

const filters = function install(Vue: VueConstructor) {
    function format(v: string) {
        return v.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }

    // 将数字转换为千分位显示
    Vue.filter('number', (v: number, fixed?: number, prefix?: string) => {
        if (fixed) {
            const s = format((+v).toFixed(fixed).toString())
            if (prefix) {
                return prefix + s
            }
            return s
        }
        return format((v || '').toString())
    })

    Vue.filter('currency', (v: number, fixed = 2, prefix = '￥') => {
        if (fixed) {
            const s = format((+v).toFixed(fixed).toString())
            if (prefix) {
                return prefix + s
            }
            return s
        }
        return format((v || '').toString())
    })

    const k = 1024
    const m = 1024 * k
    const g = 1024 * m
    const t = 1024 * g

    Vue.filter('formatSize', function formatSize(size: number) {
        if (size === undefined || size === null) {
            return ''
        }
        if (size < k) {
            return size + ' B'
        }
        if (size < m) {
            return Number((size / k).toFixed(2)) + ' KB'
        }
        if (size < g) {
            return Number((size / m).toFixed(2)) + ' MB'
        }
        if (size < t) {
            return Number((size / g).toFixed(2)) + ' GB'
        }
        return Number((size / t).toFixed(2)) + ' TB'
    })

    Vue.filter('time2YYYYMMDD', function (time: string | number, separator?: string) {
        if (!time) {
            return ''
        }
        if (separator) {
            return moment(time).format(`YYYY${separator}MM${separator}DD`)
        }
        return moment(time).format('YYYY-MM-DD')
    })

    Vue.filter('time2YYYYMM', function (time: string | number, separator?: string) {
        if (!time) {
            return ''
        }
        if (separator) {
            return moment(time).format(`YYYY${separator}MM`)
        }
        return moment(time).format('YYYY年MM月')
    })

    Vue.filter('time2String', function (time: string | number) {
        if (!time) {
            return ''
        }
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
    })

    Vue.filter('time2MiniString', function (time: string | number) {
        if (!time) {
            return ''
        }
        return moment(time).format('YYYY-MM-DD HH:mm')
    })

    Vue.filter('time2YYYYMMDDCN', function (time: string | number) {
        if (!time) {
            return ''
        }
        return moment(time).format('YYYY年MM月DD日')
    })

    Vue.filter('beautifyTime', function (v?: string | number) {
        if (!v) {
            return ''
        }
        const time = moment(v)
        if (!time.isValid()) {
            return v
        }
        let str = time.format('YYYY-MM-DD')
        const hour = time.hour()
        const minute = time.minute()
        if (!hour && !minute) {
            return str
        }
        if (hour) {
            str += ` ${time.format('Ah点')}`
        }
        if (minute) {
            str += ` ${time.format('m分')}`
        }
        return str
    })

    const today = moment()

    function isToday(time: moment.Moment) {
        return time.year() === today.year() && time.month() === today.month() && time.date() === today.date()
    }

    function isThisYear(time: moment.Moment) {
        return time.year() === today.year()
    }

    function isThisHour(time: moment.Moment) {
        return time.hour() === today.hour()
    }

    function getSomeMinuteAgo(time: moment.Moment) {
        return today.minute() - time.minute()
    }

    Vue.filter('time2Relative', function (time: string | number) {
        if (!time) {
            return ''
        }
        const v = moment(time)

        if (isThisHour(v)) {
            const n = getSomeMinuteAgo(v)
            return n <= 2 ? '刚刚' : `${n}分钟前`
        }

        if (isToday(v)) {
            return moment(time).format('HH:mm')
        }

        if (isThisYear(v)) {
            return moment(time).format('MM-DD A HH:mm')
        }

        return moment(time).format('YYYY-MM-DD HH:mm')
    })

    Vue.filter('leftFixedZero', function (val: string | number, len?: number) {
        len = len || 2
        val = ('' + val).trim()
        return (Array(len).join('0') + val).slice(-len)
    })

    function formatSalary(v: number, type?: 'Y' | 'K') {
        if (type === 'K') {
            return {
                v: parseFloat((v / 1000).toFixed(2)),
                unit: 'K',
            }
        }
        if (+v < 1000) {
            return {
                v,
                unit: '',
            }
        } else {
            return {
                v: parseFloat((v / 1000).toFixed(2)),
                unit: 'K',
            }
        }
    }

    Vue.filter('salaryRange', function (min: number, max: number) {
        if (!max && !min) {
            return '面议'
        }
        if (+min >= +max) {
            const v = formatSalary(min)
            return `${v.v}${v.unit}`
        }
        const formatMin = formatSalary(min)
        const formatMax = formatSalary(max)
        if (formatMin.unit === formatMax.unit) {
            return `${formatMin.v}-${formatMax.v} ${formatMax.unit}`
        } else {
            const formatMin = formatSalary(min, 'K')
            const formatMax = formatSalary(max, 'K')
            return `${formatMin.v}-${formatMax.v} K`
        }
    })
}

export { filters }
