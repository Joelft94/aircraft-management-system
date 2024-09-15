'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav>
      <Link href="/">Home</Link>
      {session ? (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// const Navigation: React.FC = () => {
//   const { data: session } = useSession();
//   return (
//     <nav>
//       <ul>
//         <li>
//           <Link href="/">Home</Link>
//         </li>
//         <li>
//           <Link href="/dashboard">Dashboard</Link>
//         </li>
//         <li>
//           <Link href="/flights">Flights</Link>
//         </li>
//         <li>
//           <Link href="/add-flight">Add Flight</Link>
//         </li>
//       </ul>
//       <Link href="/api-docs">API Documentation</Link>
//       <button onClick={() => signOut()}>Sign out</button>
//     </nav>
//   );
// };

// export default Navigation;
