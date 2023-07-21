import * as yup from 'yup';

export const employeeValidationSchema = yup.object().shape({
  onboarding_date: yup.date(),
  exit_date: yup.date(),
  leave_days: yup.number().integer(),
  attendance_days: yup.number().integer(),
  user_id: yup.string().nullable(),
});
