import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: 'Phone', type: 'text' },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectToDatabase();
                const loginIdentifier = credentials?.email || credentials?.phone;

                const user = await User.findOne({
                    $or: [{ email: loginIdentifier }, { phone: loginIdentifier }]
                });

                if (!user) throw new Error("No user found");

                const isValid = await bcrypt.compare(credentials!.password, user.password);
                if (!isValid) throw new Error("Incorrect password");

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone, // Phone add kiya
                    wallet: user.wallet,
                    image: user.image || null,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.wallet = user.wallet;
                token.image = user.image;
                token.phone = user.phone;
            }
            if (trigger === "update" && session) {
                token.name = session.name;
                token.image = session.image;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.wallet = token.wallet;
                session.user.image = token.image;
                session.user.phone = token.phone;
            }
            return session;
        }
    },
    pages: { signIn: "/login" },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };