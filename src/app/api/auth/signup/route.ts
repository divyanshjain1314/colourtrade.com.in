import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { name, email, phone, password } = body;

        const userExists = await User.findOne({ phone });
        if (userExists) {
            return NextResponse.json({ error: "User already exists with this number" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            phone,
            password: hashedPassword,
        };

        const newUser = await User.create(userData);

        return NextResponse.json({
            message: 'User registered successfully',
            user: { id: newUser._id }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}