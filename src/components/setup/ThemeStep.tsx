import { useTheme } from "@/components/providers/ThemeProvider"
import { Config } from '@/types/config'
import { Dispatch, SetStateAction } from 'react'

import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { Button } from '../ui/button';

interface ThemeStepProps {
  config: Config
  setConfig: Dispatch<SetStateAction<Config>>
  setStep: Dispatch<SetStateAction<number>>
}

export default function ThemeStep({ config, setConfig, setStep } : ThemeStepProps) {
  const accentColorChoices = [
    `bg-sky-500`,
    `bg-emerald-500`,
    `bg-rose-500`,
    `bg-violet-500`,
    `bg-orange-500`,
    `bg-cyan-500`,
  ]
  const { setTheme } = useTheme()

  function toggleTheme(selectedTheme: string) {
    if(selectedTheme === `light`){
      setTheme(`light`)
      setConfig({...config, theme: `light`})
    }else{
      setTheme(`dark`)
      setConfig({...config, theme: `dark`})
    }
  }
  
  return (
    <>
      <h1 className={`font-semibold text-2xl mb-2`}>Select Your Theme</h1>
      <p className={`mb-4`}>Choose the theme you'd like to use for the app.</p>
      <div className={`flex flex-row mx-auto gap-4`}>
        <button className={`flex flex-col gap-2 border-2 p-8 rounded-md text-slate-800 bg-white hover:bg-slate-100/90 dark:border-slate-200`} onClick={() => toggleTheme(`light`)}>
          <FaSun className={`text-4xl`}/>
          <span>Light</span>
        </button>
        <button className={`flex flex-col gap-2 border-2 p-8 rounded-md bg-slate-800 hover:bg-slate-700/90 dark:border-slate-200 text-white`} onClick={() => toggleTheme(`dark`)}>
          <FaMoon className={`text-4xl`}/>
          <span>Dark</span>
        </button>
      </div>
      <p className={`mt-6`}>Choose an accent color:</p>
      <div className={`mt-4 flex flex-row gap-2 justify-center`}>
        {accentColorChoices.map((color) => (
          <button key={color} className={`w-8 h-8 rounded-full ${color} border-2 border-white`} onClick={() => setConfig({...config, accentColor: color})}>
            {config.accentColor === color && <FaCheck className={`w-4 h-4 mx-auto text-white`}></FaCheck>}
          </button>
        ))}
      </div>
      <Button className={`mt-8`} onClick={() => setStep(2)}>Next</Button>
    </>
  )
}