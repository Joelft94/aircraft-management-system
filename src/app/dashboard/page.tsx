import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import Aircraft from "@/components/Aircraft";
import FlightList from "@/components/FlightList";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
      <Aircraft />
      <FlightList />
      {/* Add your aircraft list and management components here */}
    </div>
  );
}