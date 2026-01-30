declare global {
  type User = {
    name: string;
    email: string;
    roles?: string[];
  type Category = {
    _id: string;
    name: string;
    url: string;
    image: string;
  };
}
