import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import { TypeStyleSelector } from '../selector/TypeStyleSelector';

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-auto bg-[var(--color-bg)]">
          <Outlet />
        </main>
      </div>
      <StatusBar />
      <TypeStyleSelector />
    </div>
  );
}
