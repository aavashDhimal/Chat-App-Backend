import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../model/user-model";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
export const registerUser = async (
    name : string,
    email: string,
    password: string
): Promise<IUser> => {
    const exists = await UserModel.findOne({ email });
    if (exists) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserModel.create({ name,email, password: hashed });
    return user;
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ token: string; user: IUser }> => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { token, user };
};
