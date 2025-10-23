import { Navbar } from "@/components";

export default function EventGoerLayout({ children }) {
  return (
    <>
      <Navbar userType="eventGoer" />
      {children}
    </>
  );
}
