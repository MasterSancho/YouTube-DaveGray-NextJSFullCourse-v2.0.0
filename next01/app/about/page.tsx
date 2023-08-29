import Link from 'next/link';

export default function About() {
 // throw new Error('Error in About Page');
 return (
  <>
   <h1>About Page</h1>
   <Link href='/'>Link to Home Page</Link>
  </>
 );
}
