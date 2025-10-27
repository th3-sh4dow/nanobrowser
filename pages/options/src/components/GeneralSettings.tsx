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
    <section className="space-y-6">
      <div
        className={`rounded-md border p-6 ${isDarkMode ? 'border-[#3c3c3c] bg-[#252526]' : 'border-[#e1e4e8] bg-white'}`}>
        <h2 className={`mb-6 text-lg font-semibold ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
          {t('options_general_header')}
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_maxSteps')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
              className={`w-16 rounded border px-2 py-1 text-sm ${isDarkMode ? 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] focus:border-[#007acc]' : 'border-[#e1e4e8] bg-white text-[#24292e] focus:border-[#0366d6]'}`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_maxActions')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
              className={`w-16 rounded border px-2 py-1 text-sm ${isDarkMode ? 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] focus:border-[#007acc]' : 'border-[#e1e4e8] bg-white text-[#24292e] focus:border-[#0366d6]'}`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_maxFailures')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
              className={`w-16 rounded border px-2 py-1 text-sm ${isDarkMode ? 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] focus:border-[#007acc]' : 'border-[#e1e4e8] bg-white text-[#24292e] focus:border-[#0366d6]'}`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_enableVision')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
                className={`peer h-5 w-9 rounded-full transition-colors ${isDarkMode ? 'bg-[#3c3c3c]' : 'bg-[#e1e4e8]'} after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] ${isDarkMode ? 'peer-checked:bg-[#007acc]' : 'peer-checked:bg-[#0366d6]'} peer-checked:after:translate-x-4 peer-focus:outline-none`}>
                <span className="sr-only">{t('options_general_enableVision')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_displayHighlights')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
                className={`peer h-5 w-9 rounded-full transition-colors ${isDarkMode ? 'bg-[#3c3c3c]' : 'bg-[#e1e4e8]'} after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] ${isDarkMode ? 'peer-checked:bg-[#007acc]' : 'peer-checked:bg-[#0366d6]'} peer-checked:after:translate-x-4 peer-focus:outline-none`}>
                <span className="sr-only">{t('options_general_displayHighlights')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_planningInterval')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
              className={`w-16 rounded border px-2 py-1 text-sm ${isDarkMode ? 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] focus:border-[#007acc]' : 'border-[#e1e4e8] bg-white text-[#24292e] focus:border-[#0366d6]'}`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_minWaitPageLoad')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
              className={`w-20 rounded border px-2 py-1 text-sm ${isDarkMode ? 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] focus:border-[#007acc]' : 'border-[#e1e4e8] bg-white text-[#24292e] focus:border-[#0366d6]'}`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                {t('options_general_replayHistoricalTasks')}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
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
                className={`peer h-5 w-9 rounded-full transition-colors ${isDarkMode ? 'bg-[#3c3c3c]' : 'bg-[#e1e4e8]'} after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] ${isDarkMode ? 'peer-checked:bg-[#007acc]' : 'peer-checked:bg-[#0366d6]'} peer-checked:after:translate-x-4 peer-focus:outline-none`}>
                <span className="sr-only">{t('options_general_replayHistoricalTasks')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
