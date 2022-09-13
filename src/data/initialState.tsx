export const registerState = {
  full_name: { name: 'full_name', value: '', error: '', type: 'text' },
  email: { name: 'email', value: '', error: '', type: 'email' },
  password: { name: 'password', value: '', error: '', type: 'password' },
};

export const billFormState = {
  company: { name: 'company', value: '', error: '' },
  due_date: { name: 'due_date', value: new Date(), error: '' },
  amount: { name: 'amount', value: '', error: '' },
};

export const backgroundState = {
  background_file_name: '',
  background_url: '',
  created_at: '',
  id: null,
  user_id: '',
};
