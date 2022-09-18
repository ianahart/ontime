import { ChangeEvent, MouseEvent, useContext, useState } from 'react';
import contactFormStyles from '../../styles/components/dashboard/ContactForm.module.scss';
import {
  IBillContext,
  IContactContext,
  IContactForm,
  IUserContext,
} from '../../interfaces';
import { contactFormState } from '../../data/initialState';
import ContactFormInput from './ContactFormInput';
import { AiOutlinePlus } from 'react-icons/ai';
import { UserContext } from '../../context/user';
import { ContactContext } from '../../context/contact';
import { BillContext } from '../../context/bill';

interface IContactFormProps {
  handleSetView: (view: string) => void;
}

const ContactForm = ({ handleSetView }: IContactFormProps) => {
  const [form, setForm] = useState<IContactForm>(contactFormState);
  const { profile } = useContext(UserContext) as IUserContext;
  const { resetBills, getCompanyOrFail } = useContext(BillContext) as IBillContext;
  const { insertContact } = useContext(ContactContext) as IContactContext;
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IContactForm], [prop]: value },
    }));
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file: File = e.target.files[0];
    setFile(file);
  };

  const handleOnClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setError('');
    if (validateFields()) {
      return;
    }

    if (validateEmptyFields()) {
      setError('Please fill out all fields.');
      return;
    }
    if (profile) {
      const billId = await getCompanyOrFail(form.company.value, profile?.id);
      if (!billId) {
        setError('That company does not exist in your bills.');
        return;
      }
      await insertContact(form, file, profile?.id, billId);
      resetBills();
      handleSetView('list');
    }
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
      if (field?.error?.length) {
        errors = true;
      }
    }
    return errors;
  };

  return (
    <div className={contactFormStyles.container}>
      <div className={contactFormStyles.header}>
        <h3>Add a Contact</h3>
        {error && <p className={contactFormStyles.error}>{error}</p>}
      </div>
      <ContactFormInput
        name={form.company.name}
        error={form.company.error}
        value={form.company.value}
        label="Company"
        updateForm={updateForm}
      />
      <ContactFormInput
        name={form.phone.name}
        error={form.phone.error}
        value={form.phone.value}
        label="Phone"
        updateForm={updateForm}
      />
      <div className={contactFormStyles.notes}>
        <label className={contactFormStyles.notes}>Notes</label>
      </div>
      <textarea
        name="notes"
        onChange={handleTextAreaChange}
        value={form.notes.value}
      ></textarea>

      <div className={contactFormStyles.fileInput}>
        <AiOutlinePlus />
        <p>Add Photo</p>
        <input onChange={handleFileChange} type="file" accept="image/*" />
      </div>
      <div className={contactFormStyles.btnContainer}>
        <button onClick={handleOnClick}>Submit</button>
      </div>
    </div>
  );
};

export default ContactForm;
