import { createContext, useState } from 'react';
import supabase from '../config/supabaseClient';
import { IContact, IContactContext, IContactForm } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const ContactContext = createContext<IContactContext | null>(null);

const ContactContextProvider = ({ children }: IChildren) => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(2);
  const LIMIT = 3;

  const getContacts = async (user_id: string) => {
    const { data } = await supabase
      .from<IContact>('contacts')
      .select('user_id, company, bill_id, file_url, phone, notes, id')
      .order('id')
      .eq('user_id', user_id)
      .range(from, to);

    if (data) {
      setContacts(data);
      setFrom(data.length);
      setTo(data.length - 1 + LIMIT);
    }
  };

  const paginateContacts = async (user_id: string) => {
    const { data } = await supabase
      .from<IContact>('contacts')
      .select('user_id, company, bill_id, file_url, phone, notes, id')
      .order('id')
      .eq('user_id', user_id)
      .range(from, to);
    if (data) {
      setContacts((prevState) => [...prevState, ...data]);
      setFrom(contacts.length + LIMIT);
      setTo(contacts.length + data.length - 1 + LIMIT);
    }
  };

  const resetContacts = () => {
    setContacts([]);
    setFrom(0);
    setTo(2);
  };

  const removeContact = async (id: number) => {
    resetContacts();
    await supabase.from('contacts').delete().match({ id });
  };

  const insertWithoutFile = async (
    form: IContactForm,
    user_id: string,
    bill_id: string
  ) => {
    const { data, error } = await supabase.from('contacts').insert([
      {
        notes: form.notes.value,
        phone: form.phone.value,
        company: form.company.value,
        user_id,
        bill_id,
      },
    ]);
  };

  const uploadToStorage = async (file: File, file_name: string): Promise<void> => {
    await supabase.storage.from('contacts').upload(file_name, file, {
      cacheControl: '3600',
      upsert: false,
    });
  };

  const getPublicUrl = (fileName: string) => {
    const { publicURL } = supabase.storage.from('contacts').getPublicUrl(fileName);
    if (publicURL) {
      return publicURL;
    }
    return null;
  };

  const insertContact = async (
    form: IContactForm,
    file: File | null,
    user_id: string,
    bill_id: string
  ) => {
    if (!file) {
      await insertWithoutFile(form, user_id, bill_id);
      return;
    }
    const fileName = `${user_id}/${file.name}`;
    await uploadToStorage(file, fileName);
    const publicURL = getPublicUrl(fileName);
    await insertWithFile(form, user_id, bill_id, fileName, publicURL);
  };

  const insertWithFile = async (
    form: IContactForm,
    user_id: string,
    bill_id: string,
    file_name: string,
    file_url: string | null
  ) => {
    const { data, error } = await supabase.from('contacts').insert([
      {
        notes: form.notes.value,
        phone: form.phone.value,
        company: form.company.value,
        user_id,
        bill_id,
        file_name,
        file_url,
      },
    ]);
  };

  const value = { removeContact, paginateContacts, insertContact, getContacts, contacts };

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};

export default ContactContextProvider;
