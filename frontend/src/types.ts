declare global {
  type Category = {
    _id: string;
    name: string;
    url: string;
    image: string;
  };
  type Chef = {
    _id: string;
    name: string;
    url: string;
    image: string;
    description: string;
    signature: string;
    restaurant: {
      name: string;
      address: string;
      openingHours: string[];
    };
  };
}
