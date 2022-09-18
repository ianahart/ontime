import { MouseEvent, useState, useContext } from 'react';
import { AiOutlineClose, AiOutlinePhone } from 'react-icons/ai';
import { CgNotes } from 'react-icons/cg';
import { ContactContext } from '../../context/contact';
import { getUser } from '../../data/helpers';
import { IContact, IContactContext } from '../../interfaces';
import contactStyles from '../../styles/components/dashboard/Contact.module.scss';

interface IContactProps {
  contact: IContact;
}

const Contact = ({ contact }: IContactProps) => {
  const { removeContact, getContacts } = useContext(ContactContext) as IContactContext;
  const [modal, setModal] = useState(false);

  const closeModal = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setModal(false);
  };

  return (
    <div onClick={() => setModal(true)} className={contactStyles.container}>
      {modal && (
        <div className={contactStyles.modal}>
          <div onClick={closeModal} className={contactStyles.closeModal}>
            <AiOutlineClose />
          </div>
          <div className={contactStyles.contactContainer}>
            <div className={contactStyles.company}>
              <p>{contact.company}</p>
            </div>
            {contact?.file_url && (
              <div className={contactStyles.image}>
                <img src={contact?.file_url} alt={contact.company} />
              </div>
            )}
            <div className={contactStyles.phone}>
              <AiOutlinePhone />
              <p>{contact.phone}</p>
            </div>
            <div className={contactStyles.notes}>
              <CgNotes />
              <p>{contact.notes}</p>
            </div>
            <div className={contactStyles.delete}>
              <button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  removeContact(contact.id);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      <p>{contact.company}</p>
    </div>
  );
};

export default Contact;
