import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import {connectToDB} from '@/utils/database.js';
import User from '@/models/user.js';

console.log({
  clientId: process.env.GOOGLE_ID_CLIENT,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID_CLIENT,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  // quando si lavora con gli handler di NextAuth oltre ai providers abbiamo anche callback che è un oggetto che wrappa tutte le logiche di sessione, connesione e utente.
  callbacks: {
    async session({session}) {
      const sessionUser = await User.findOne({email: session.user.email});
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({profile}) {
      try {
        // ricorda che ogni Next.JS route è una serverLess route, è quindi un Lambda function che viene eseguita solo quando chiamata
        await connectToDB();
        
        // check if the user already exists
        const userExists = await User.findOne({email: profile.email});  
  
        //if not create new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "").toLowerCase(),
            image: profile.picture
          })
        }
  
        return true;
      } catch(error) {
        console.log(error);
        return false;
      }
    }
  }
})

export {handler as GET, handler as POST}