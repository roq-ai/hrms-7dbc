import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createEmployee } from 'apiSdk/employees';
import { employeeValidationSchema } from 'validationSchema/employees';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { EmployeeInterface } from 'interfaces/employee';

function EmployeeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EmployeeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEmployee(values);
      resetForm();
      router.push('/employees');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EmployeeInterface>({
    initialValues: {
      onboarding_date: new Date(new Date().toDateString()),
      exit_date: new Date(new Date().toDateString()),
      leave_days: 0,
      attendance_days: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: employeeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Employees',
              link: '/employees',
            },
            {
              label: 'Create Employee',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Employee
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="onboarding_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Onboarding Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.onboarding_date ? new Date(formik.values?.onboarding_date) : null}
              onChange={(value: Date) => formik.setFieldValue('onboarding_date', value)}
            />
          </FormControl>
          <FormControl id="exit_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Exit Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.exit_date ? new Date(formik.values?.exit_date) : null}
              onChange={(value: Date) => formik.setFieldValue('exit_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Leave Days"
            formControlProps={{
              id: 'leave_days',
              isInvalid: !!formik.errors?.leave_days,
            }}
            name="leave_days"
            error={formik.errors?.leave_days}
            value={formik.values?.leave_days}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('leave_days', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Attendance Days"
            formControlProps={{
              id: 'attendance_days',
              isInvalid: !!formik.errors?.attendance_days,
            }}
            name="attendance_days"
            error={formik.errors?.attendance_days}
            value={formik.values?.attendance_days}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('attendance_days', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/employees')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'employee',
    operation: AccessOperationEnum.CREATE,
  }),
)(EmployeeCreatePage);
