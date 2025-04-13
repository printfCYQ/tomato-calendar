const styles = {
  calendarContainer: 'mx-auto w-full h-full p-4 bg-white shadow-md rounded-md flex flex-col',
  calendarNav: 'flex justify-between items-center mb-4 h-10',
  calendarNavButton: 'text-gray-700 hover:text-gray-900',
  calendarNavTitle: 'text-xl font-bold',

  calendarWeek: 'grid grid-cols-7 mb-2 h-5',
  calendarWeekItem: 'flex flex-1 justify-center',

  calendarDaysContent: 'grid grid-cols-7 grid-rows-6 flex-1 border-r-[1px] border-b-[1px] border-gray-200',
  calendarDay: 'flex flex-1 flex-col p-2 h-full border-t-[1px] border-l-[1px] border-gray-200',
  calendarDayGray: 'text-gray-400',
  calendarDayActive: 'bg-blue-200',

  calendarDayTop: 'flex justify-between',
  calendarDayTopLeft: 'flex items-center',
  calendarDayTopRight: 'flex items-center',
  calendarDayBottom: 'flex-1 mt-1',

  calendarLunar: 'text-xs text-gray-500',
  calendarWorkday: 'text-sm',
  calendarWorkdayTrue: 'text-green-500',
  calendarWorkdayFalse: 'text-red-500',
  calendarSchedule: 'text-green-500',

  calendarDayNumber: 'font-bold',
  calendarScheduleItem: 'text-[10px] bg-green-500 text-white rounded-md px-[4px] m-[1px] cursor-pointer',
}

export default styles
