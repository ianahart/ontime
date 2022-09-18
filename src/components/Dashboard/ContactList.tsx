import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { getUser } from '../../data/helpers';
import { useContext } from 'react';
import { ContactContext } from '../../context/contact';
import { IContactContext } from '../../interfaces';
import contactListStyles from '../../styles/components/dashboard/ContactList.module.scss';
import Contact from './Contact';
const ContactList = () => {
  const { getContacts, contacts, paginateContacts } = useContext(
    ContactContext
  ) as IContactContext;

  useEffectOnce(() => {
    const fetchContacts = async () => {
      const userId = getUser();
      await getContacts(userId);
    };
    fetchContacts();
  });

  const loadMore = async () => {
    await paginateContacts(getUser());
  };

  return (
    <div className={contactListStyles.container}>
      <div className={contactListStyles.contactListContainer}>
        {contacts?.map((contact) => {
          return <Contact key={contact.id} contact={contact} />;
        })}
      </div>
      <div className={contactListStyles.loadMore}>
        <button onClick={loadMore}>More contacts</button>
      </div>
    </div>
  );
};

export default ContactList;
