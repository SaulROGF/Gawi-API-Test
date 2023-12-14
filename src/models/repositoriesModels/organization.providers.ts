import { Organization } from '../organization.entity';


export const organizationProviders = [
  {
    provide: 'OrganizationRepository',
    useValue: Organization,
  },
];
