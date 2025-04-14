const styles = {
  calendarContainer: 'calendar-container mx-auto w-full h-full p-4 bg-white shadow-md rounded-md flex flex-col',
  calendarNav: 'calendarnav flex justify-between items-center mb-4 h-10',
  calendarNavButton: 'calendar-nav-button text-gray-700 transition-transform hover:scale-105 hover:bg-gray-400 hover:text-gray-600 bg-gray-300 p-2 rounded-[4px] cursor-pointer',
  calendarNavTitle: 'calendar-nav-title text-xl font-bold',

  calendarWeek: 'grid grid-cols-7 mb-2 h-5',
  calendarWeekItem: 'flex flex-1 justify-center',

  calendarDaysContent: 'grid grid-cols-7 grid-rows-6 flex-1 border-r-[1px] border-b-[1px] border-gray-200 overflow-hidden',
  calendarDay: 'flex flex-1 flex-col p-2 h-full border-t-[1px] border-l-[1px] border-gray-200 cursor-pointer overflow-hidden',
  calendarDayGray: 'text-gray-400',
  calendarDayActive: 'bg-blue-200',

  calendarDayTop: 'flex justify-between',
  calendarDayTopLeft: 'flex items-center',
  calendarDayTopRight: 'flex items-center',
  calendarDayBottom: 'calendar-day-bottom flex-1 mt-1 overflow-hidden',

  calendarLunar: 'text-xs text-gray-500',
  calendarWorkday: 'text-sm',
  calendarWorkdayTrue: 'text-green-500',
  calendarWorkdayFalse: 'text-red-500',
  calendarSchedule: 'text-green-500',

  calendarDayNumber: 'font-bold',
  calendarScheduleItem: 'text-[10px] bg-green-500 text-white rounded-md px-[4px] m-[1px] cursor-pointer',
}

export default styles
