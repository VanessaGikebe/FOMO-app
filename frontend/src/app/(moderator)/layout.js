import { Navbar } from "@/components";

export default function ModeratorLayout({ children }) {
  return (
    <>
      <Navbar userType="moderator" />
      {children}
    </>
  );
}
