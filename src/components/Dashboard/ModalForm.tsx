import { useEffect, FormEvent, MouseEvent, useState, useContext } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import { billFormState } from '../../data/initialState';
import { IBillForm, IUserContext } from '../../interfaces';
import modalFormStyles from '../../styles/components/dashboard/ModalForm.module.scss';
import BillFormInput from './BillFormInput';
import supabase from '../../config/supabaseClient';
import { UserContext } from '../../context/user';

interface IModalFormProps {
  handleCloseModalForm: () => void;
}

export type CalendarDate = Date | [Date | null, Date | null] | null | undefined;

const ModalForm = ({ handleCloseModalForm }: IModalFormProps) => {
  const { session } = useContext(UserContext) as IUserContext;
  const [form, setForm] = useState<IBillForm>(billFormState);
  const [error, setError] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const closeModalForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleCloseModalForm();
  };

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IBillForm], [prop]: value },
    }));
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (validateFields()) {
      return;
    }

    if (validateEmptyFields()) {
      setError('Please fill out all fields.');
      return;
    }
    await insertBill();
    handleCloseModalForm();
  };

  const insertBill = async () => {
    const { data, error } = await supabase.from('bills').insert([
      {
        user_id: session?.user?.id,
        amount: parseInt(form.amount.value),
        company: form.company.value,
        date: form.due_date.value,
        formatted_date: formattedDate,
      },
    ]);
  };

  const validateEmptyFields = () => {
    let empty = false;
    for (const [_, field] of Object.entries(form)) {
      if (typeof field.value === 'string' && field.value.trim().length === 0) {
        empty = true;
      }
    }
    return empty;
  };

  const validateFields = () => {
    let errors = false;
    for (const [_, field] of Object.entries(form)) {
      if (field.error.length) {
        errors = true;
      }
    }
    return errors;
  };

  const handleCalendarChange = (value: CalendarDate) => {
    if (value) {
      setForm((prevState) => ({
        ...prevState,
        due_date: { ...prevState['due_date'], value },
      }));
    }
  };

  useEffect(() => {
    let date = form.due_date.value?.toString();
    date = dayjs(date).format('MM/DD/YYYY');
    setFormattedDate(date);
  }, [form.due_date.value]);

  return (
    <div className={modalFormStyles.container}>
      <form onSubmit={handleOnSubmit}>
        <h3>Add a Bill</h3>
        {error && <p className={modalFormStyles.error}>{error}</p>}
        <BillFormInput
          direction="column"
          updateForm={updateForm}
          label="Company"
          value={form.company.value}
          error={form.company.error}
          name={form.company.name}
        />
        <div className={modalFormStyles.date}>
          <p>Due Date</p>
          <div className={modalFormStyles.dateInput}>
            {form.due_date.value && <p>{formattedDate}</p>}
          </div>
        </div>
        <div className={modalFormStyles.calendar}>
          <Calendar onChange={handleCalendarChange} value={form.due_date.value} />
        </div>
        <BillFormInput
          direction="column"
          updateForm={updateForm}
          label="Amount"
          value={form.amount.value}
          error={form.amount.error}
          name={form.amount.name}
        />
        <div className={modalFormStyles.btnContainer}>
          <button type="submit">Add</button>
          <button onClick={closeModalForm} type="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalForm;
