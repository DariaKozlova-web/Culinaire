export interface Chef {
  _id: string;
  name: string;
  url: string;
  image: string;
  city: string;
  cuisine: string;
  description: string;
  story: string[];
  signature: string;
  restaurant: {
    name: string;
    address: string;
    openingHours: string;
    closed: string;
  };
}
