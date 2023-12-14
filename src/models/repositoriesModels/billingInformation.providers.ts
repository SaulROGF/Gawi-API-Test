import { BillingInformation } from '../billingInformation.entity';


export const billingInformationProviders = [
  {
    provide: 'BillingInformationRepository',
    useValue: BillingInformation,
  },
];
