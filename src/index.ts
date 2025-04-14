import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import LunarCalendar from 'lunar-calendar'
import styles from './styles'
import { bindEvent, createCustomEvent, createElement, isWeekday, loadCSS, loadJS } from './utils'

class CalendarComponent {
  /** 当前显示的日期 */
  private currentDate: Dayjs
  /** 日历容器元素 */
  private container: HTMLElement
  /** 显示月份和年份的元素 */
  private monthYearElement: HTMLElement | undefined
  /** 日历主体元素 */
  private calendarBody: HTMLElement | undefined
  /** 日程安排，键为日期，值为日程列表 */
  private schedules: { [date: string]: string[] }

  /**
   * 构造函数，初始化日历组件。
   * @param containerId 日历容器的 ID
   * @param schedules 日程安排，默认为空对象
   */
  constructor(containerId: string, schedules: { [date: string]: string[] } = {}) {
    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(`Container with id ${containerId} not found.`)
    }
    this.container = container
    this.currentDate = dayjs()
    this.schedules = schedules
    this.load()
    this.createCalendarStructure()
    this.generateCalendar(this.currentDate.year(), this.currentDate.month())
  }

  load() {
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css')
    loadJS('https://cdn.tailwindcss.com')
  }

  // 添加更新日程的方法
  updateSchedules(newSchedules: { [key: string]: string[] }) {
    this.schedules = newSchedules
    this.generateCalendar(this.currentDate.year(), this.currentDate.month())
  }

  private createCalendarStructure() {
    // 创建日历容器
    const calendarDiv = createElement('div', styles.calendarContainer)

    // 创建导航栏
    const navDiv = createElement('div', styles.calendarNav)

    // 创建上一月按钮
    const prevButton = createElement('button', styles.calendarNavButton)
    prevButton.id = 'prevMonth'
    prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>'
    prevButton.addEventListener('click', () => this.prevMonth())

    // 创建月份标题
    const monthYear = createElement('h2', styles.calendarNavTitle)
    monthYear.id = 'monthYear'

    // 创建下一月按钮
    const nextButton = createElement('button', styles.calendarNavButton)
    nextButton.id = 'nextMonth'
    nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>'
    nextButton.addEventListener('click', () => this.nextMonth())

    navDiv.appendChild(prevButton)
    navDiv.appendChild(monthYear)
    navDiv.appendChild(nextButton)

    // 创建星期表头
    const headerDiv = createElement('div', styles.calendarWeek)
    const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    headers.forEach((day) => {
      const headerCell = createElement('div', styles.calendarWeekItem, day)
      headerDiv.appendChild(headerCell)
    })

    // 创建日历主体，使用 grid 布局 设置 grid 布局，7 列 6 行
    const calendarBody = createElement('div', styles.calendarDaysContent)
    calendarBody.id = 'calendarBody'

    calendarDiv.appendChild(navDiv)
    calendarDiv.appendChild(headerDiv)
    calendarDiv.appendChild(calendarBody)
    this.container.appendChild(calendarDiv)

    this.monthYearElement = monthYear
    this.calendarBody = calendarBody
  }

  private generateCalendar(year: number, month: number) {
    const currentMonthStart = dayjs(`${year}-${month + 1}-01`)
    const firstDay = currentMonthStart.day()
    const lastDate = currentMonthStart.endOf('month').date()
    const prevMonthLastDate = currentMonthStart.subtract(1, 'month').endOf('month').date()

    this.monthYearElement!.textContent = currentMonthStart.format('MMMM YYYY')

    // innerHTML = '' 会导致浏览器重新解析和渲染整个表格，性能较低。可以使用 while 循环逐个移除子节点。
    while (this.calendarBody!.firstChild) {
      this.calendarBody!.removeChild(this.calendarBody!.firstChild)
    }

    let date = 1
    let prevMonthDate = prevMonthLastDate - firstDay + 1 // 上个月的最后一天

    // 生成 7*6 = 42 个格子
    for (let i = 0; i < 42; i++) {
      const cellDiv = createElement('div', styles.calendarDay)

      bindEvent(cellDiv, 'click', () => {
        const event = new CustomEvent('dayclick')
        this.container.dispatchEvent(event)
      })

      let currentYear = year
      let currentMonth = month
      let currentDate = date

      // 如果当前索引小于本月第一天是星期几的数值，说明当前格子应显示上个月的日期
      if (i < firstDay) {
        currentDate = prevMonthDate
        currentMonth = month - 1
        // 如果月份减到小于 0，说明跨年了，需要调整年份和月份
        if (currentMonth < 0) {
          currentMonth = 11
          currentYear--
        }
        // 给显示上个月日期的格子添加灰色样式
        cellDiv.classList.add(styles.calendarDayGray)
        prevMonthDate++
      }
      // 如果当前日期已经超过本月的最后一天，说明当前格子应显示下个月的日期
      else if (date > lastDate) {
        currentDate = date - lastDate
        currentMonth = month + 1
        // 如果月份加到大于 11，说明跨年了，需要调整年份和月份
        if (currentMonth > 11) {
          currentMonth = 0
          currentYear++
        }
        // 给显示下个月日期的格子添加灰色样式
        cellDiv.classList.add(styles.calendarDayGray)
        date++
      }
      // 当前格子显示本月的日期
      else {
        currentDate = date
        // 如果当前日期是今天，给格子添加激活样式
        if (dayjs().isSame(dayjs(`${year}-${month + 1}-${date}`), 'day')) {
          cellDiv.classList.add(styles.calendarDayActive)
        }
        date++
      }

      // 获取农历信息
      const lunar = LunarCalendar.solarToLunar(currentYear, currentMonth + 1, currentDate)

      // 获取日程信息
      const scheduleKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDate.toString().padStart(2, '0')}`
      const scheduleList = this.schedules[scheduleKey] || []

      // 判断是否为工作日
      const isWorkday = isWeekday(dayjs(scheduleKey))

      // 创建上方容器，用于左右布局
      const topContainer = createElement('div', styles.calendarDayTop)

      // 创建左侧容器，用于存放日期数字和农历信息
      const leftContainer = createElement('div', styles.calendarDayTopLeft)

      // 创建日期数字元素
      const dateElement = createElement('div', styles.calendarDayNumber, currentDate.toString())

      // 创建农历信息元素
      const lunarElement = createElement('div', styles.calendarLunar, lunar.lunarDayName)

      leftContainer.appendChild(dateElement)
      leftContainer.appendChild(lunarElement)

      // 创建右侧容器，用于存放工作日信息
      const rightContainer = createElement('div', styles.calendarDayTopRight)

      // 创建工作日信息元素
      const workdayElement = createElement('div', styles.calendarWorkday, isWorkday ? '班' : '休')
      workdayElement.classList.add(isWorkday ? styles.calendarWorkdayTrue : styles.calendarWorkdayFalse)
      rightContainer.appendChild(workdayElement)

      topContainer.appendChild(leftContainer)
      topContainer.appendChild(rightContainer)

      // 创建下方容器，用于存放日程信息
      const bottomContainer = createElement('div', styles.calendarDayBottom)

      // 创建日程信息元素
      scheduleList.forEach((schedule) => {
        const scheduleItem = createElement('div', styles.calendarScheduleItem, schedule)
        bottomContainer.appendChild(scheduleItem)
      })

      cellDiv.appendChild(topContainer)
      cellDiv.appendChild(bottomContainer)
      cellDiv.setAttribute('data-date', scheduleKey)
      this.calendarBody!.appendChild(cellDiv)
    }

    // 派发月份变更事件
    createCustomEvent('monthchange', this.container, { year, month })

    // this.generateSchedule()
  }

  generateSchedule() {
    const itemHeight = 15
    const calendarBody = this.container.querySelector('#calendarBody')
    calendarBody?.childNodes.forEach((item: ChildNode) => {
      if (item.nodeType === Node.ELEMENT_NODE) {
        const element = item as HTMLElement
        // 获取 data-date 属性的值
        const date = element.getAttribute('data-date')
        if (date) {
          const scheduleList = this.schedules[date] || []

          // 可以在这里将日程信息添加到对应的 cellDiv 中
          const bottomContainer = element.querySelector(`.calendar-day-bottom`) as HTMLElement | null
          requestAnimationFrame(() => {
            const offsetHeight = bottomContainer?.offsetHeight
            if (bottomContainer && offsetHeight) {
              const maxSchedules = Math.floor(offsetHeight / itemHeight)

              // 清空原有的日程信息
              while (bottomContainer.firstChild) {
                bottomContainer.removeChild(bottomContainer.firstChild)
              }

              // 创建日程信息元素
              if (scheduleList.length > maxSchedules) {
                // 显示前 maxSchedules - 1 个日程
                scheduleList.slice(0, maxSchedules - 1).forEach((schedule) => {
                  const scheduleItem = createElement('div', styles.calendarScheduleItem, schedule)
                  bindEvent(scheduleItem, 'click', (e) => {
                    e.stopPropagation()
                    const data = { schedule, date }
                    createCustomEvent('scheduleclick', this.container, data)
                  })
                  bottomContainer.appendChild(scheduleItem)
                })

                // 显示 ... 元素
                const ellipsisItem = createElement('div', styles.calendarScheduleItem, '...')
                bindEvent(ellipsisItem, 'click', (e) => {
                  e.stopPropagation()
                  const data = { schedule: '...', date }
                  createCustomEvent('scheduleclick', this.container, data)
                })
                bottomContainer.appendChild(ellipsisItem)
              }
              else {
                scheduleList.forEach((schedule) => {
                  const scheduleItem = createElement('div', styles.calendarScheduleItem, schedule)
                  bindEvent(scheduleItem, 'click', (e) => {
                    e.stopPropagation()
                    const data = { schedule, date }
                    createCustomEvent('scheduleclick', this.container, data)
                  })
                  bottomContainer.appendChild(scheduleItem)
                })
              }
            }
          })
        }
      }
    })
  }

  private changeMonth(step: number) {
    this.currentDate = this.currentDate.add(step, 'month')
    this.generateCalendar(this.currentDate.year(), this.currentDate.month())
  }

  private prevMonth() {
    this.changeMonth(-1)
  }

  private nextMonth() {
    this.changeMonth(1)
  }
}

export default CalendarComponent
