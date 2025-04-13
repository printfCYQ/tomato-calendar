import dayjs from 'dayjs'
import LunarCalendar from 'lunar-calendar'
import styles from './styles'
import { createElement, isWeekday, loadCSS, loadJS } from './utils'

class CalendarComponent {
  private currentDate: dayjs.Dayjs
  private container: HTMLElement
  private monthYearElement: HTMLElement | undefined
  private calendarBody: HTMLElement | undefined
  private schedules: { [date: string]: string[] }

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
    const firstDay = dayjs(`${year}-${month + 1}-01`).day()
    const lastDate = dayjs(`${year}-${month + 1}-01`).endOf('month').date()
    const prevMonthLastDate = dayjs(`${year}-${month}-01`).endOf('month').date()

    this.monthYearElement!.textContent = dayjs(`${year}-${month + 1}-01`).format('MMMM YYYY')

    this.calendarBody!.innerHTML = ''

    let date = 1
    let prevMonthDate = prevMonthLastDate - firstDay + 1 // 上个月的最后一天

    // 生成 7*6 = 42 个格子
    for (let i = 0; i < 42; i++) {
      const cellDiv = createElement('div', styles.calendarDay)

      let currentYear = year
      let currentMonth = month
      let currentDate = date

      let viewDayNumber = ''

      if (i < firstDay) {
        currentDate = prevMonthDate
        currentMonth = month - 1
        if (currentMonth < 0) {
          currentMonth = 11
          currentYear--
        }
        viewDayNumber = prevMonthDate.toString()
        cellDiv.classList.add(styles.calendarDayGray)
        prevMonthDate++
      }
      else if (date > lastDate) {
        currentDate = date - lastDate
        currentMonth = month + 1
        if (currentMonth > 11) {
          currentMonth = 0
          currentYear++
        }
        viewDayNumber = (date - lastDate).toString()
        cellDiv.classList.add(styles.calendarDayGray)
        date++
      }
      else {
        currentDate = date
        viewDayNumber = date.toString()
        if (dayjs().isSame(dayjs(`${year}-${month + 1}-${date}`), 'day')) {
          cellDiv.classList.add(styles.calendarDayActive)
        }
        date++
      }

      // 获取农历信息
      const lunar = LunarCalendar.solarToLunar(currentYear, currentMonth + 1, currentDate)

      // 判断是否为工作日
      const isWorkday = isWeekday(dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDate.toString().padStart(2, '0')}`))

      // 获取日程信息
      const scheduleKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDate.toString().padStart(2, '0')}`
      const scheduleList = this.schedules[scheduleKey] || []

      // 创建上方容器，用于左右布局
      const topContainer = createElement('div', styles.calendarDayTop)

      // 创建左侧容器，用于存放日期数字和农历信息
      const leftContainer = createElement('div', styles.calendarDayTopLeft)

      // 创建日期数字元素
      const dateElement = createElement('div', styles.calendarDayNumber, viewDayNumber)

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

      this.calendarBody!.appendChild(cellDiv)
    }

    // 派发月份变更事件
    const event = new CustomEvent('monthchange', {
      detail: { year, month },
    })
    this.container.dispatchEvent(event)
  }

  private prevMonth() {
    this.currentDate = this.currentDate.subtract(1, 'month')
    this.generateCalendar(this.currentDate.year(), this.currentDate.month())
  }

  private nextMonth() {
    this.currentDate = this.currentDate.add(1, 'month')
    this.generateCalendar(this.currentDate.year(), this.currentDate.month())
  }
}

export default CalendarComponent
