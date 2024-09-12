export type User = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: 'обычный' | 'pro'
}