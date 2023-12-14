import { Role } from '../role.entity';


export const roleProviders = [
  {
    provide: 'RoleRepository',
    useValue: Role,
  },
];
