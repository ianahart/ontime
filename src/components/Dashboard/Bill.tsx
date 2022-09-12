import billStyles from '../../styles/components/dashboard/Bill.module.scss';
import { IBill, IBillContext, IBillForm } from '../../interfaces';
import { useRef, useContext, useCallback, useState, ChangeEvent } from 'react';
import Calendar from 'react-calendar';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import { billFormState } from '../../data/initialState';
import { BillContext } from '../../context/bill';
import { CalendarDate } from './ModalForm';
interface IBillProps {
  bill: IBill;
}

const Bill = ({ bill }: IBillProps) => {
  const { updateBillInput, handleBillChange, updateBillCalendar } = useContext(
    BillContext
  ) as IBillContext;
  const [showCalendar, setShowCalendar] = useState(false);
  const [company, setCompany] = useState(bill.company ?? '');
  const [amount, setAmount] = useState<string | number>(bill.amount ?? '');
  const calendarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLParagraphElement>(null);

  const clickAway = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const target = e.target as Element;
    if (calendarRef.current !== null && triggerRef.current !== null) {
      if (!calendarRef.current.contains(target) && target !== triggerRef.current) {
        setShowCalendar(false);
      }
    }
  }, []);

  useEffectOnce(() => {
    window.addEventListener('click', clickAway);
    return () => window.addEventListener('click', clickAway);
  });

  const handleCalendarChange = (value: CalendarDate) => {
    let date = value?.toString();
    date = dayjs(date).format('MM/DD/YYYY');
    updateBillCalendar(date, value as Date, bill.id);
  };

  const handleShowCalendar = () => {
    setShowCalendar((prevState) => !prevState);
  };

  const handleOnBlur = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    await updateBillInput(name, value, bill.id);
  };

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'company') {
      setCompany(value);
    } else if (name === 'amount') {
      setAmount(value);
    }
  };

  return (
    <div className={billStyles.pageWrapper}>
      <div className={billStyles.container}>
        <div className={billStyles.formGroup}>
          <label>Company</label>
          <input
            onChange={handleOnInputChange}
            value={company}
            name="company"
            onBlur={handleOnBlur}
          />
        </div>
        <div className={billStyles.calendarContainer}>
          <div>
            <label>Due Date</label>

            <input disabled value={bill.formatted_date} />
          </div>
          <p
            ref={triggerRef}
            className={billStyles.calendarBtn}
            onClick={handleShowCalendar}
            role="button"
          >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </p>
          {showCalendar && (
            <div ref={calendarRef} className={billStyles.calendar}>
              <Calendar onChange={handleCalendarChange} value={new Date(bill.due_date)} />
            </div>
          )}
        </div>
        <div className={billStyles.formGroup}>
          <label>Amount</label>
          <input
            onChange={handleOnInputChange}
            value={amount}
            name="amount"
            onBlur={handleOnBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default Bill;
