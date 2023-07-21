interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['HR Manager'],
  customerRoles: ['Customer'],
  tenantRoles: ['IT Support', 'HR Assistant', 'Team Lead', 'Employee', 'HR Manager'],
  tenantName: 'Organization',
  applicationName: 'HRMS',
  addOns: ['chat', 'notifications', 'file'],
};
