import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            phone: number | string
            wallet: number;
        } & DefaultSession["user"];
    }

    interface User {
        wallet: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        wallet: number;
    }
}