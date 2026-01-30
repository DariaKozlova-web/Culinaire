export interface Chef {
  id: string;
  name: string;
  url?: string;
  description?: string;
  signature?: string;
  restaurant?: {
    name: string;
    addresse?: string;
    openingHours?: string[]
  };
  city: string;
  avatar: string;
}