import { NavbarComponent } from "@/components/Navbar";
export default function UserLayout({ children }) {
  return (
    <div>
      <NavbarComponent/>
      {children}
    </div>
  );
}