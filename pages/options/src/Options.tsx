import { useState, useEffect } from 'react';
import '@src/Options.css';
import { Button } from '@extension/ui';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { t } from '@extension/i18n';
import { FiSettings, FiCpu, FiShield, FiTrendingUp, FiHelpCircle } from 'react-icons/fi';
import { GeneralSettings } from './components/GeneralSettings';
import { ModelSettings } from './components/ModelSettings';
import { FirewallSettings } from './components/FirewallSettings';
import { AnalyticsSettings } from './components/AnalyticsSettings';

type TabTypes = 'general' | 'models' | 'firewall' | 'analytics' | 'help';

const TABS: { id: TabTypes; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'general', icon: FiSettings, label: t('options_tabs_general') },
  { id: 'models', icon: FiCpu, label: t('options_tabs_models') },
  { id: 'firewall', icon: FiShield, label: t('options_tabs_firewall') },
  { id: 'analytics', icon: FiTrendingUp, label: 'Analytics' },
  { id: 'help', icon: FiHelpCircle, label: t('options_tabs_help') },
];

const Options = () => {
  const [activeTab, setActiveTab] = useState<TabTypes>('models');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleTabClick = (tabId: TabTypes) => {
    if (tabId === 'help') {
      window.open('https://nexon-ai.pennywish0101.workers.dev/', '_blank');
    } else {
      setActiveTab(tabId);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings isDarkMode={isDarkMode} />;
      case 'models':
        return <ModelSettings isDarkMode={isDarkMode} />;
      case 'firewall':
        return <FirewallSettings isDarkMode={isDarkMode} />;
      case 'analytics':
        return <AnalyticsSettings isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#1e1e1e] text-[#cccccc]' : 'bg-white text-[#24292e]'}`}>
      {/* Vertical Navigation Bar */}
      <nav
        className={`w-56 border-r ${isDarkMode ? 'border-[#3c3c3c] bg-[#252526]' : 'border-[#e1e4e8] bg-[#f8f8f8]'}`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <img src="/icon-128.png" alt="Extension Logo" className="w-6 h-6" />
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
              {t('options_nav_header')}
            </h1>
          </div>
          <ul className="space-y-1">
            {TABS.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-colors text-left ${
                    activeTab === item.id
                      ? isDarkMode
                        ? 'bg-[#007acc] text-white'
                        : 'bg-[#0366d6] text-white'
                      : isDarkMode
                        ? 'text-[#cccccc] hover:bg-[#3c3c3c]'
                        : 'text-[#24292e] hover:bg-[#e1e4e8]'
                  }`}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 p-6 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className="max-w-4xl">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);
