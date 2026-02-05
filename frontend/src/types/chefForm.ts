export type ChefCreateForm = {
  name: string;
  url: string;
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
  imageFile?: File | null;
};
