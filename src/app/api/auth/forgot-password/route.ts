import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { identifier } = await request.json();

        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        if (!user.email) {
            return NextResponse.json({ error: "No email linked to this account" }, { status: 400 });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
        const expiryDate = new Date(Date.now() + 3600000);

        await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    resetPasswordToken: resetTokenHash,
                    resetPasswordExpires: expiryDate
                }
            },
            {
                strict: false,
                upsert: true
            }
        );

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        console.log("--- RESET LINK GENERATED ---");
        console.log(resetUrl);
        const { error: mailError } = await resend.emails.send({
            from: 'Auth <onboarding@resend.dev>',
            to: user.email,
            subject: 'Reset Your Password',
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333; line-height: 1.6; border: 1px solid #f0f0f0; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #06b6d4; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; font-style: italic;">
                            Your<span style="color: #333;">Brand</span>
                        </h1>
                    </div>

                    <div style="background-color: #ffffff; padding: 20px;">
                        <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 700; margin-bottom: 20px;">Password Reset Request</h2>
                        
                        <p style="margin-bottom: 20px;">Hello <strong>${user.name || 'User'}</strong>,</p>
                        
                        <p style="margin-bottom: 25px;">We received a request to reset the password for your account. To proceed, please click the button below to set a new password:</p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${resetUrl}" style="background-color: #06b6d4; color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);">
                                Reset Password
                            </a>
                        </div>

                        <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                            <strong>Note:</strong> This link is valid for <strong>60 minutes</strong> only.
                        </p>
                        
                        <p style="font-size: 14px; color: #888; border-top: 1px solid #eee; pt: 20px; margin-top: 30px;">
                            If you did not request this change, you can safely ignore this email. Your password will remain unchanged.
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
                        <p>&copy; 2026 YourBrand. All rights reserved.</p>
                    </div>
                </div>
            `
        });

        if (mailError) {
            console.error("Resend Error:", mailError);
            return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
        }

        return NextResponse.json({
            message: "Reset instructions sent to your registered email.",
            email: user.email
        }, { status: 200 });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}