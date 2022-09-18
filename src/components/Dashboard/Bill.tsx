import billStyles from '../../styles/components/dashboard/Bill.module.scss';
import { IBill, IBillContext, IBillForm } from '../../interfaces';
import {
  useRef,
  useContext,
  useCallback,
  MouseEvent,
  useState,
  ChangeEvent,
} from 'react';
import Calendar from 'react-calendar';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import { BsTrash } from 'react-icons/bs';
import { billFormState } from '../../data/initialState';
import { BillContext } from '../../context/bill';
import { CalendarDate } from './ModalForm';
import ToggleBtn from './ToggleBtn';
interface IBillProps {
  bill: IBill;
}

const Bill = ({ bill }: IBillProps) => {
  console.log(bill);
  const {
    updateBillInput,
    toggleRunningBtn,
    deleteBill,
    handleBillChange,
    updateBillCalendar,
  } = useContext(BillContext) as IBillContext;
  const [trashOpen, setTrashOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [company, setCompany] = useState(bill.company);
  const [amount, setAmount] = useState<string | number>(bill.amount);
  const calendarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLParagraphElement>(null);

  const clickAway = useCallback((e: Event) => {
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

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteBill(bill.id);
    setTrashOpen(false);
  };

  const cancelDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setTrashOpen(false);
  };

  return (
    <div className={billStyles.pageWrapper}>
      <div className={billStyles.container}>
        {bill.contacts[0]?.file_url && <img src={bill.contacts[0]?.file_url} />}
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
      <div className={billStyles.options}>
        {trashOpen && (
          <div className={billStyles.modal}>
            <div className={billStyles.deleteContainer}>
              <div className={billStyles.warning}>
                <p>
                  Are you sure you want to delete this bill from{' '}
                  <span>{bill.company}</span> ?
                </p>
              </div>
              <div className={billStyles.btnContainer}>
                <button onClick={handleDelete}>Yes</button>
                <button onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div onClick={() => setTrashOpen(true)}>
          <BsTrash />
        </div>
        <ToggleBtn id={bill.id} is_toggled={bill.is_toggled} />
      </div>
    </div>
  );
};

export default Bill;
