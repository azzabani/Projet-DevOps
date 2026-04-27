import mongoose, { Schema, Document, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    }
  },
  { timestamps: true }
);

// Hash password avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default models.User || mongoose.model<IUser>("User", UserSchema);