import { State } from '../state.entity';


export const stateProviders = [
  {
    provide: 'StateRepository',
    useValue: State,
  },
];
