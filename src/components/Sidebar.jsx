import Logo from './Logo';
import SidebarList from './SidebarList';
import { menu, library, general } from '../sidebarData';

export default function Sidebar() {
  return (
    <nav className="navigation">
      <Logo />
      <SidebarList data={menu} header="Menu" />
      <SidebarList data={library} header="Library" />
      <SidebarList data={general} header="General" />
    </nav>
  );
}
