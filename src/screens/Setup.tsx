import { useTheme } from '@/components/providers/ThemeProvider';
import AdditionalSettingsStep from '@/components/setup/AdditionalSettingsStep';
import LibraryStep from '@/components/setup/LibraryStep';
import ThemeStep from '@/components/setup/ThemeStep';
import WelcomeStep from '@/components/setup/WelcomeStep';
import { Config } from '@/types/config';
import { useState } from 'react';
import { exists, mkdir, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { useNavigate } from '@tanstack/react-router';

export default function Setup() {
  const { theme } = useTheme()
  const navigate = useNavigate({ from: '/setup'})

  const initialConfig : Config = {
    theme: (theme === 'system' ? (window.matchMedia("(prefers-color-scheme: dark)").matches? "dark": "light") : theme),
    accentColor: `bg-emerald-500`,
    libraries: [],
    discordRichPresence: false
  }

  const [config, setConfig] = useState<Config>(initialConfig);
  const [step, setStep] = useState(0);

  async function completeSetup() {
    console.log(`Setup complete!`, config)
    //Write the config to a file
    const appFolderExists = await exists('', {baseDir: BaseDirectory.AppLocalData});
    if(!appFolderExists) {
      await mkdir('', {baseDir: BaseDirectory.AppLocalData});
    }
    await writeTextFile('config.json', JSON.stringify(config), {baseDir: BaseDirectory.AppLocalData});
    navigate({ to: '/library'});
  }

  return (
    <div className={`m-auto w-full flex flex-col text-center`}>
      <img className={`w-40 h-40 mx-auto my-auto mb-6`} src='/tauri.svg' alt='logo' />
      {step === 0 && (
        <WelcomeStep setStep={setStep}/>
      )}
      { step === 1 && (
        <ThemeStep config={config} setConfig={setConfig} setStep={setStep}/>
      )}
      { step === 2 && (
        <LibraryStep config={config} setConfig={setConfig} setStep={setStep}/>
      )}
      { step === 3 && (
        <AdditionalSettingsStep config={config} setConfig={setConfig} setStep={setStep} completeSetup={completeSetup}/>
      )}
    </div>
  )
}