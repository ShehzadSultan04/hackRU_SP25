import Layout from '@/components/layout'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'


export default function CalendarPage({events}) {
  return (
      <div className='calendar-container'>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin
          ]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          initialView='timeGridWeek'
          resources={[
            { id: 'a', title: 'Auditorium A'},
            { id: 'b', title: 'Auditorium B', eventColor: 'green' },
            { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
          ]}
          events={events}
          
        />
      </div>
  )
}