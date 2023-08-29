import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Home Page',
 description: 'Created by Alex Maltsev',
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <html lang='en'>
   {/* <head /> will contain the components returned by the nearest parent head.tsx.
   Find out more at
   https://beta.nextjs.org/docs/api-reference/file-conventions/head */}
   <head />
   <body>
    <nav>My Navbar</nav>
    {children}
   </body>
  </html>
 );
}
