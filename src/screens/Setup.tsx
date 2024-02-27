import { useTheme } from '@/components/providers/ThemeProvider';
import ThemeStep from '@/components/setup/ThemeStep';
import WelcomeStep from '@/components/setup/WelcomeStep';
import { Config } from '@/types/config';
import { useState } from 'react';

export default function Setup() {
  const { theme } = useTheme()

  const initialConfig : Config = {
    theme: (theme === 'system' ? (window.matchMedia("(prefers-color-scheme: dark)").matches? "dark": "light") : theme),
    accentColor: `bg-emerald-500`,
    libraries: []
  }

  const [config, setConfig] = useState<Config>(initialConfig);
  const [step, setStep] = useState(0);

  return (
    <div className={`m-auto flex flex-col text-center`}>
      <img className={`w-40 h-40 mx-auto my-auto mb-6`} src='/tauri.svg' alt='logo' />
      {step === 0 && (
        <WelcomeStep setStep={setStep}/>
      )}
      { step === 1 && (
        <ThemeStep config={config} setConfig={setConfig} setStep={setStep}/>
      )}
    </div>
  )
}