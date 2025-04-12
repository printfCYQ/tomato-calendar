import dayjs from 'dayjs'
import { loadCSS, loadJS } from './utils'

class CalendarComponent {
  private currentDate: dayjs.Dayjs
  private container: HTMLElement
  private monthYearElement: HTMLElement | undefined
  private calendarBody: HTMLElement | undefined

  constructor(containerId: string) {
    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(`Container with id ${containerId} not found.`)
    }
    this.container = container
    this.currentDate = dayjs()
    this.load()
    this.createCalendarStructure()
    this.generateCalendar(this.currentDate.year(), this.currentDate.month())
  }

  load() {
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css')
    loadJS('https://cdn.tailwindcss.com')
  }

  private createCalendarStructure() {
    // 创建日历容器
    const calendarDiv = document.createElement('div')
    calendarDiv.className = 'mx-auto w-full h-full p-4 bg-white shadow-md rounded-md flex flex-col'

    // 创建导航栏
    const navDiv = document.createElement('div')
    navDiv.className = 'flex justify-between items-center mb-4 h-10'

    // 创建上一月按钮
    const prevButton = document.createElement('button')
    prevButton.id = 'prevMonth'
    prevButton.className = 'text-gray-700 hover:text-gray-900'
    prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>'
    prevButton.addEventListener('click', () => this.prevMonth())

    // 创建月份标题
    const monthYear = document.createElement('h2')
    monthYear.id = 'monthYear'
    monthYear.className = 'text-xl font-bold'

    // 创建下一月按钮
    const nextButton = document.createElement('button')
    nextButton.id = 'nextMonth'
    nextButton.className = 'text-gray-700 hover:text-gray-900'
    nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>'
    nextButton.addEventListener('click', () => this.nextMonth())

    navDiv.appendChild(prevButton)
    navDiv.appendChild(monthYear)
    navDiv.appendChild(nextButton)

    // 创建星期表头
    const headerDiv = document.createElement('div')
    headerDiv.className = 'grid grid-cols-7 mb-2 h-5'
    const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    headers.forEach((day) => {
      const headerCell = document.createElement('div')
      headerCell.className = 'flex flex-1 justify-center'
      headerCell.textContent = day
      headerDiv.appendChild(headerCell)
    })

    // 创建日历主体，使用 grid 布局
    const calendarBody = document.createElement('div')
    calendarBody.id = 'calendarBody'
    // 设置 grid 布局，7 列 6 行
    calendarBody.className = 'grid grid-cols-7 grid-rows-6 gap-1 flex-1'

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
    let prevMonthDate = prevMonthLastDate - firstDay + 1

    // 生成 7*6 = 42 个格子
    for (let i = 0; i < 42; i++) {
      const cellDiv = document.createElement('div')
      cellDiv.className = 'flex flex-1 h-full text-center items-center justify-center'
      if (i < firstDay) {
        cellDiv.textContent = prevMonthDate.toString()
        cellDiv.classList.add('text-gray-400')
        prevMonthDate++
      }
      else if (date > lastDate) {
        cellDiv.textContent = (date - lastDate).toString()
        cellDiv.classList.add('text-gray-400')
        date++
      }
      else {
        cellDiv.textContent = date.toString()
        if (dayjs().isSame(dayjs(`${year}-${month + 1}-${date}`), 'day')) {
          cellDiv.classList.add('bg-blue-200')
        }
        date++
      }
      this.calendarBody!.appendChild(cellDiv)
    }
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
