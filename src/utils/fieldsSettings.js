// form fields settings what can be overwritten by passing prop @TODO implement this
const fieldsSettings = {
  date: {
    dateMinYear: 1920,
    dateMaxYear: new Date().getFullYear() + 1,
    firstDay: 1, // Monday
  },
};

export default fieldsSettings;
