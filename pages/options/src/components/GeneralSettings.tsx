import { useState, useEffect } from 'react';
import { type GeneralSettingsConfig, generalSettingsStore, DEFAULT_GENERAL_SETTINGS } from '@extension/storage';
import { t } from '@extension/i18n';

interface GeneralSettingsProps {
  isDarkMode?: boolean;
}

export const GeneralSettings = ({ isDarkMode = false }: GeneralSettingsProps) => {
  const [settings, setSettings] = useState<GeneralSettingsConfig>(DEFAULT_GENERAL_SETTINGS);

  useEffect(() => {
    // Load initial settings
    generalSettingsStore.getSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof GeneralSettingsConfig>(key: K, value: GeneralSettingsConfig[K]) => {
    // Optimistically update the local state for responsiveness
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));

    // Call the store to update the setting
    await generalSettingsStore.updateSettings({ [key]: value } as Partial<GeneralSettingsConfig>);

    // After the store update (which might have side effects, e.g., useVision affecting displayHighlights),
    // fetch the latest settings from the store and update the local state again to ensure UI consistency.
    const latestSettings = await generalSettingsStore.getSettings();
    setSettings(latestSettings);
  };

  return (
    <section className="space-y-8">
      <div className="glass-surface rounded-3xl p-8 animate-float">
        <h2 className="mb-8 text-2xl font-bold neon-text">{t('options_general_header')}</h2>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_maxSteps')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_maxSteps_desc')}
              </p>
            </div>
            <label htmlFor="maxSteps" className="sr-only">
              {t('options_general_maxSteps')}
            </label>
            <input
              id="maxSteps"
              type="number"
              min={1}
              max={50}
              value={settings.maxSteps}
              onChange={e => updateSetting('maxSteps', Number.parseInt(e.target.value, 10))}
              className="glass-surface w-20 rounded-xl px-3 py-2 text-sm text-white/90 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_maxActions')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_maxActions_desc')}
              </p>
            </div>
            <label htmlFor="maxActionsPerStep" className="sr-only">
              {t('options_general_maxActions')}
            </label>
            <input
              id="maxActionsPerStep"
              type="number"
              min={1}
              max={50}
              value={settings.maxActionsPerStep}
              onChange={e => updateSetting('maxActionsPerStep', Number.parseInt(e.target.value, 10))}
              className="glass-surface w-20 rounded-xl px-3 py-2 text-sm text-white/90 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_maxFailures')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_maxFailures_desc')}
              </p>
            </div>
            <label htmlFor="maxFailures" className="sr-only">
              {t('options_general_maxFailures')}
            </label>
            <input
              id="maxFailures"
              type="number"
              min={1}
              max={10}
              value={settings.maxFailures}
              onChange={e => updateSetting('maxFailures', Number.parseInt(e.target.value, 10))}
              className="glass-surface w-20 rounded-xl px-3 py-2 text-sm text-white/90 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_enableVision')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_enableVision_desc')}
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="useVision"
                type="checkbox"
                checked={settings.useVision}
                onChange={e => updateSetting('useVision', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="useVision"
                className="peer h-6 w-11 rounded-full glass-surface transition-all duration-300 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 peer-checked:shadow-lg peer-checked:shadow-cyan-500/30 peer-checked:after:translate-x-5 peer-focus:outline-none hover:scale-105">
                <span className="sr-only">{t('options_general_enableVision')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_displayHighlights')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_displayHighlights_desc')}
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="displayHighlights"
                type="checkbox"
                checked={settings.displayHighlights}
                onChange={e => updateSetting('displayHighlights', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="displayHighlights"
                className="peer h-6 w-11 rounded-full glass-surface transition-all duration-300 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 peer-checked:shadow-lg peer-checked:shadow-cyan-500/30 peer-checked:after:translate-x-5 peer-focus:outline-none hover:scale-105">
                <span className="sr-only">{t('options_general_displayHighlights')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_planningInterval')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_planningInterval_desc')}
              </p>
            </div>
            <label htmlFor="planningInterval" className="sr-only">
              {t('options_general_planningInterval')}
            </label>
            <input
              id="planningInterval"
              type="number"
              min={1}
              max={20}
              value={settings.planningInterval}
              onChange={e => updateSetting('planningInterval', Number.parseInt(e.target.value, 10))}
              className="glass-surface w-20 rounded-xl px-3 py-2 text-sm text-white/90 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_minWaitPageLoad')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_minWaitPageLoad_desc')}
              </p>
            </div>
            <label htmlFor="minWaitPageLoad" className="sr-only">
              {t('options_general_minWaitPageLoad')}
            </label>
            <input
              id="minWaitPageLoad"
              type="number"
              min={250}
              max={5000}
              step={50}
              value={settings.minWaitPageLoad}
              onChange={e => updateSetting('minWaitPageLoad', Number.parseInt(e.target.value, 10))}
              className="glass-surface w-24 rounded-xl px-3 py-2 text-sm text-white/90 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                {t('options_general_replayHistoricalTasks')}
              </h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {t('options_general_replayHistoricalTasks_desc')}
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="replayHistoricalTasks"
                type="checkbox"
                checked={settings.replayHistoricalTasks}
                onChange={e => updateSetting('replayHistoricalTasks', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="replayHistoricalTasks"
                className="peer h-6 w-11 rounded-full glass-surface transition-all duration-300 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 peer-checked:shadow-lg peer-checked:shadow-cyan-500/30 peer-checked:after:translate-x-5 peer-focus:outline-none hover:scale-105">
                <span className="sr-only">{t('options_general_replayHistoricalTasks')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
