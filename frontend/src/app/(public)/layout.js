import { Navbar } from "@/components";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar userType="public" />
      {children}
    </>
  );
}
