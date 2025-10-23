import { Navbar } from "@/components";

export default function EventOrganiserLayout({ children }) {
  return (
    <>
      <Navbar userType="eventOrganiser" />
      {children}
    </>
  );
}
