import { BarChartIcon, HomeIcon, ReaderIcon } from '@radix-ui/react-icons';
import NavLink from './NavLink';

export default function NavMainMenu() {
  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      <NavLink href="/">
        <HomeIcon className="h-4 w-4" />
        Dashboard
      </NavLink>
      <NavLink href="/trades">
        <BarChartIcon className="h-4 w-4" />
        Operações
      </NavLink>
      <NavLink href="/registers">
        <ReaderIcon className="h-4 w-4" />
        Cadastros
      </NavLink>
    </nav>
  );
}
