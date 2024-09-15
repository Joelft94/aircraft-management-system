import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/flights">Flights</Link>
        </li>
        <li>
          <Link href="/add-flight">Add Flight</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;