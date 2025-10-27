import React, { useState, useEffect } from 'react';
import { analyticsSettingsStore } from '@extension/storage';

import type { AnalyticsSettingsConfig } from '@extension/storage';

interface AnalyticsSettingsProps {
  isDarkMode: boolean;
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({ isDarkMode }) => {
  const [settings, setSettings] = useState<AnalyticsSettingsConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentSettings = await analyticsSettingsStore.getSettings();
        setSettings(currentSettings);
      } catch (error) {
        console.error('Failed to load analytics settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    // Listen for storage changes
    const unsubscribe = analyticsSettingsStore.subscribe(loadSettings);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleAnalytics = async (enabled: boolean) => {
    if (!settings) return;

    try {
      await analyticsSettingsStore.updateSettings({ enabled });
      setSettings({ ...settings, enabled });
    } catch (error) {
      console.error('Failed to update analytics settings:', error);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="glass-surface rounded-3xl p-8 animate-float">
          <h2 className="mb-8 text-2xl font-bold neon-text">Analytics Settings</h2>
          <div className="animate-pulse">
            <div className="mb-4 h-4 w-3/4 rounded-lg glass-surface"></div>
            <div className="h-4 w-1/2 rounded-lg glass-surface"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!settings) {
    return (
      <section className="space-y-8">
        <div className="glass-surface rounded-3xl p-8 animate-float">
          <h2 className="mb-8 text-2xl font-bold neon-text">Analytics Settings</h2>
          <p className="text-red-400 font-medium">Failed to load analytics settings.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="glass-surface rounded-3xl p-8 animate-float">
        <h2 className="mb-8 text-2xl font-bold neon-text">Analytics Settings</h2>

        <div className="space-y-8">
          {/* Main toggle */}
          <div className="glass-surface rounded-2xl p-6 animate-float" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-6">
                <label
                  htmlFor="analytics-enabled"
                  className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                  Help improve Nexonbrowser
                </label>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                  Share anonymous usage data to help us improve the extension
                </p>
              </div>
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={e => handleToggleAnalytics(e.target.checked)}
                  className="peer sr-only"
                  id="analytics-enabled"
                />
                <label
                  htmlFor="analytics-enabled"
                  className="peer h-6 w-11 rounded-full glass-surface transition-all duration-300 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 peer-checked:shadow-lg peer-checked:shadow-cyan-500/30 peer-checked:after:translate-x-5 peer-focus:outline-none hover:scale-105">
                  <span className="sr-only">Toggle analytics</span>
                </label>
              </div>
            </div>
          </div>

          {/* Information about what we collect */}
          <div className="glass-surface rounded-2xl p-6 animate-float" style={{ animationDelay: '0.2s' }}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
              What we collect:
            </h3>
            <ul className={`list-disc space-y-2 pl-5 text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
              <li>Task execution metrics (start, completion, failure counts and duration)</li>
              <li>Domain names of websites visited (e.g., &quot;amazon.com&quot;, not full URLs)</li>
              <li>Error categories for failed tasks (no sensitive details)</li>
              <li>Anonymous usage statistics</li>
            </ul>

            <h3 className={`mb-4 mt-8 text-lg font-bold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
              What we DON&apos;T collect:
            </h3>
            <ul className={`list-disc space-y-2 pl-5 text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
              <li>Personal information or login credentials</li>
              <li>Full URLs or page content</li>
              <li>Task instructions or user prompts</li>
              <li>Screen recordings or screenshots</li>
              <li>Any sensitive or private data</li>
            </ul>
          </div>

          {/* Opt-out message */}
          {!settings.enabled && (
            <div
              className="glass-surface rounded-2xl p-4 border border-yellow-400/30 animate-float"
              style={{ animationDelay: '0.3s' }}>
              <p className="text-sm text-yellow-400 font-medium">
                Analytics disabled. You can re-enable it anytime to help improve Nexonbrowser.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
