import { useState, useEffect, useCallback } from 'react';
import { firewallStore } from '@extension/storage';
import { Button } from '@extension/ui';
import { t } from '@extension/i18n';

interface FirewallSettingsProps {
  isDarkMode: boolean;
}

export const FirewallSettings = ({ isDarkMode }: FirewallSettingsProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [allowList, setAllowList] = useState<string[]>([]);
  const [denyList, setDenyList] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [activeList, setActiveList] = useState<'allow' | 'deny'>('allow');

  const loadFirewallSettings = useCallback(async () => {
    const settings = await firewallStore.getFirewall();
    setIsEnabled(settings.enabled);
    setAllowList(settings.allowList);
    setDenyList(settings.denyList);
  }, []);

  useEffect(() => {
    loadFirewallSettings();
  }, [loadFirewallSettings]);

  const handleToggleFirewall = async () => {
    await firewallStore.updateFirewall({ enabled: !isEnabled });
    await loadFirewallSettings();
  };

  const handleAddUrl = async () => {
    // Remove http:// or https:// prefixes
    const cleanUrl = newUrl.trim().replace(/^https?:\/\//, '');
    if (!cleanUrl) return;

    if (activeList === 'allow') {
      await firewallStore.addToAllowList(cleanUrl);
    } else {
      await firewallStore.addToDenyList(cleanUrl);
    }
    await loadFirewallSettings();
    setNewUrl('');
  };

  const handleRemoveUrl = async (url: string, listType: 'allow' | 'deny') => {
    if (listType === 'allow') {
      await firewallStore.removeFromAllowList(url);
    } else {
      await firewallStore.removeFromDenyList(url);
    }
    await loadFirewallSettings();
  };

  return (
    <section className="space-y-8">
      <div className="glass-surface rounded-3xl p-8 animate-float">
        <h2 className="mb-8 text-2xl font-bold neon-text">{t('options_firewall_header')}</h2>

        <div className="space-y-8">
          <div className="glass-surface rounded-2xl p-6 animate-float" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-6">
                <label
                  htmlFor="toggle-firewall"
                  className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                  {t('options_firewall_enableToggle')}
                </label>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                  Control which websites the extension can access
                </p>
              </div>
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={handleToggleFirewall}
                  className="peer sr-only"
                  id="toggle-firewall"
                />
                <label
                  htmlFor="toggle-firewall"
                  className="peer h-6 w-11 rounded-full glass-surface transition-all duration-300 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 peer-checked:shadow-lg peer-checked:shadow-cyan-500/30 peer-checked:after:translate-x-5 peer-focus:outline-none hover:scale-105">
                  <span className="sr-only">{t('options_firewall_toggleFirewall_a11y')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 animate-float" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => setActiveList('allow')}
              className={`glass-button px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                activeList === 'allow'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                  : 'text-white/70 hover:text-white'
              }`}>
              {t('options_firewall_allowList_header')}
            </button>
            <button
              onClick={() => setActiveList('deny')}
              className={`glass-button px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                activeList === 'deny'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                  : 'text-white/70 hover:text-white'
              }`}>
              {t('options_firewall_denyList_header')}
            </button>
          </div>

          <div className="flex space-x-3 animate-float" style={{ animationDelay: '0.3s' }}>
            <input
              id="url-input"
              type="text"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAddUrl();
                }
              }}
              placeholder={t('options_firewall_placeholders_domainUrl')}
              className="flex-1 glass-surface rounded-xl px-4 py-3 text-sm text-white/90 placeholder-white/50 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
            />
            <button
              onClick={handleAddUrl}
              className="glass-button px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30">
              {t('options_firewall_btnAdd')}
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto animate-float" style={{ animationDelay: '0.4s' }}>
            {activeList === 'allow' ? (
              allowList.length > 0 ? (
                <ul className="space-y-3">
                  {allowList.map((url, index) => (
                    <li
                      key={url}
                      className="glass-surface flex items-center justify-between rounded-xl p-4 animate-float"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                        {url}
                      </span>
                      <button
                        onClick={() => handleRemoveUrl(url, 'allow')}
                        className="glass-button px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30">
                        {t('options_firewall_btnRemove')}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`text-center text-sm ${isDarkMode ? 'text-white/50' : 'text-slate-500'} py-8`}>
                  {t('options_firewall_allowList_empty')}
                </p>
              )
            ) : denyList.length > 0 ? (
              <ul className="space-y-3">
                {denyList.map((url, index) => (
                  <li
                    key={url}
                    className="glass-surface flex items-center justify-between rounded-xl p-4 animate-float"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                      {url}
                    </span>
                    <button
                      onClick={() => handleRemoveUrl(url, 'deny')}
                      className="glass-button px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-center text-sm ${isDarkMode ? 'text-white/50' : 'text-slate-500'} py-8`}>
                {t('options_firewall_denyList_empty')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-surface rounded-3xl p-8 animate-float" style={{ animationDelay: '0.6s' }}>
        <h2 className="mb-6 text-2xl font-bold neon-text">{t('options_firewall_howItWorks_header')}</h2>
        <ul className={`list-disc space-y-3 pl-6 text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
          {t('options_firewall_howItWorks')
            .split('\n')
            .map((rule, index) => (
              <li key={index} className="leading-relaxed">
                {rule}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};
