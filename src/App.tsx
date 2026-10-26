import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { Workspace } from './components/workspace/Workspace';
import { TemplateLibrary } from './components/template-library/TemplateLibrary';
import { SettingsPage } from './components/settings/SettingsPage';
import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { ALL_CATEGORIES } from './data/categories';
import { STYLE_PRESETS } from './data/styles';

export default function App() {
  const setCategories = useAppStore(s => s.setCategories);
  const setStylePresets = useAppStore(s => s.setStylePresets);
  const loadSettings = useAppStore(s => s.loadSettings);
  const loadConversations = useAppStore(s => s.loadConversations);

  useEffect(() => {
    setCategories(ALL_CATEGORIES);
    setStylePresets(STYLE_PRESETS);
    loadSettings();
    loadConversations();
  }, [setCategories, setStylePresets, loadSettings, loadConversations]);

  return (
    // HashRouter：应用部署在 /app 子路径下，hash 路由不依赖服务端重写规则
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Workspace />} />
          <Route path="/templates" element={<TemplateLibrary />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
