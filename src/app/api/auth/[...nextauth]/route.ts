import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: 'Phone', type: 'number' },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectToDatabase();

                const loginIdentifier = credentials?.email || credentials?.phone;

                if (!loginIdentifier) throw new Error("Email or Phone is required");

                const user = await User.findOne({
                    $or: [
                        { email: loginIdentifier },
                        { phone: loginIdentifier }
                    ]
                });

                if (!user) throw new Error("No user found");

                const isValid = await bcrypt.compare(credentials!.password, user.password);
                if (!isValid) throw new Error("Incorrect password");

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    wallet: user.wallet
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) token.wallet = user.wallet;
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) session.user.wallet = token.wallet;
            return session;
        }
    },
    pages: { signIn: "/login" },
    secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };