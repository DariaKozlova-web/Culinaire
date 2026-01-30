declare global {
  type User = {
    name: string;
    email: string;
    roles?: string[];
  };
}
