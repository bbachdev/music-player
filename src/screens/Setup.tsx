import { useTheme } from '@/components/providers/ThemeProvider';
import { store } from '@/util/config';
import AdditionalSettingsStep from '@/components/setup/AdditionalSettingsStep';
import LibraryStep from '@/components/setup/LibraryStep';
import ThemeStep from '@/components/setup/ThemeStep';
import WelcomeStep from '@/components/setup/WelcomeStep';
import { Config } from '@/types/config';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { appLocalDataDir } from '@tauri-apps/api/path';

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

    //Write the config to Store
    Object.entries(config)
    .forEach(async ([key, value]) => await store.set(key, value))

    //Get cover art path
    let path = await appLocalDataDir() + '/cover_art'
    await store.set('coverArtPath', path)
   
    //Save store
    await store.save()
    navigate({ to: '/library'});
  }

  return (
    <div className={`m-auto flex flex-col text-center`}>
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