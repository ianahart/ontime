import { Calendar as ReactBigCalendar, Views, momentLocalizer } from 'react-big-calendar';
import Calendar from 'react-calendar';
import moment from 'moment';
import supabase from '../../config/supabaseClient';
import { ChangeEvent, useEffect, MouseEvent, useContext, useState } from 'react';
import calendarStyles from '../../styles/components/dashboard/Calendar.module.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { IEvent, IUserContext } from '../../interfaces';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { UserContext } from '../../context/user';

const localizer = momentLocalizer(moment);

export type CalendarDate = Date | [Date | null, Date | null] | null | undefined;

const CalendarContainer = () => {
  const [datePicker, setDatePicker] = useState(false);
  const { profile } = useContext(UserContext) as IUserContext;
  const [eventDate, setEventDate] = useState<CalendarDate>(new Date());
  const [title, setTitle] = useState('');
  const [events, setEvents] = useState<IEvent[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from<IEvent>('events').select();
      if (data) {
        const events = transformEventDates(data);

        setEvents(events);
      }
    };
    fetchEvents();
  }, [profile?.id]);

  const transformEventDates = (data: IEvent[]) => {
    return data.map((date) => {
      date.start = moment(date.start).toDate();
      date.end = moment(date.end).toDate();
      return date;
    });
  };

  const handleCalendarChange = (value: CalendarDate) => {
    if (value) {
      setEventDate(value);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAddEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    setError('');
    if (title.trim().length === 0) {
      setError('Please add an event title');
      return;
    }
    const { data } = await supabase.from('events').insert({
      title,
      start: eventDate,
      end: eventDate,
      user_id: profile?.id,
    });
    if (data) {
      const events = transformEventDates(data);

      setEvents((prevState) => [...prevState, ...events]);
      setFormOpen(false);
    }
  };

  const handleEventSelection = async (e: IEvent) => {
    const { data, error } = await supabase.from('events').delete().match({ id: e.id });
    const filtered = events.filter((event) => event.id !== e.id);
    setEvents(filtered);
  };

  return (
    <div className={calendarStyles.container}>
      {formOpen && (
        <div className={calendarStyles.formModal}>
          <div className={calendarStyles.form}>
            <div onClick={() => setFormOpen(false)} className={calendarStyles.closeIcon}>
              <AiOutlineClose />
            </div>

            <div className={calendarStyles.formGroup}>
              <label>Event Title</label>
              <input onChange={handleInputChange} value={title} />
            </div>
            {error && <p className={calendarStyles.error}>{error}</p>}
            <div className={calendarStyles.calendarContainer}>
              <Calendar onChange={handleCalendarChange} value={eventDate} />
            </div>
            <div className={calendarStyles.btnContainer}>
              <button onClick={handleAddEvent}>Add Event</button>
            </div>
          </div>
        </div>
      )}
      <ReactBigCalendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        showMultiDayTimes
        onSelectEvent={handleEventSelection}
        step={60}
      />
      <div onClick={() => setFormOpen(true)} className={calendarStyles.trigger}>
        <AiOutlinePlus />
        <p>Add Event</p>
      </div>
    </div>
  );
};

export default CalendarContainer;
