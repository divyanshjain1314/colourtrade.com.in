import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.API_key,
    api_secret: process.env.API_secret,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const name = formData.get('name') as string | null;
        await connectToDatabase();
        const user = await User.findById(session.user.id);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        let updatedData: any = {};

        if (name && name.trim() !== "") {
            updatedData.name = name.trim();
        }

        if (file && file.size > 0) {
            if (user.image) {
                try {
                    const filename = user.image.split('/').pop()?.split('.')[0];
                    if (filename) await cloudinary.uploader.destroy(`colourtrade/${filename}`);
                } catch (err) {
                    console.log("Old image delete failed, skipping...");
                }
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    resource_type: 'auto',
                    folder: 'colourtrade'
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(buffer);
            });

            updatedData.image = uploadResponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updatedData },
            { new: true }
        );

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                image: updatedUser.image
            }
        });

    } catch (error: any) {
        console.error("Update API Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}