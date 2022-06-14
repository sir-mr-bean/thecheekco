export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  image: string;
  emailVerified: Date;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  streetAddress: string;
  streetNumber: string;
  apartmentOrUnit: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
}
