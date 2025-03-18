import mongoose from 'mongoose';

export const ADMIN_ROLE = 'SUPER_ADMIN';
export const USER_ROLE = 'NORMAL_USER';

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    apiPath: string;
    module: string;
  }[];
}
