export type TCountry = {
  name: string;
  capital: string;
  continent: {
    name: string;
  };
  code: string;
  languages: {
    name: string;
  }[];
  currency: string;
  native: string;
  phone: string;
};
