import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: mongoose.Schema.Types.ObjectId;
}
