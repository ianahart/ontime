import { useState } from 'react';
import contactStyles from '../../styles/components/dashboard/Contacts.module.scss';
import ContactForm from './ContactForm';
import ContactList from './ContactList';

const Contacts = () => {
  const [view, setView] = useState('list');

  const handleSetView = (view: string) => {
    setView(view);
  };

  return (
    <div className={contactStyles.container}>
      <div className={contactStyles.actions}>
        <div onClick={() => setView('form')}>
          <p className={view === 'form' ? contactStyles.activeView : ''}>Add Contact</p>
        </div>

        <div onClick={() => setView('list')}>
          <p className={view === 'list' ? contactStyles.activeView : ''}>Contacts</p>
        </div>
      </div>
      <div className={contactStyles.view}>
        {view === 'list' ? (
          <ContactList />
        ) : (
          <ContactForm handleSetView={handleSetView} />
        )}
      </div>
    </div>
  );
};

export default Contacts;
