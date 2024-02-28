import { Config } from '@/types/config'
import { Dispatch, SetStateAction } from 'react'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

interface AdditionalSettingsStepProps {
  config: Config
  setConfig: Dispatch<SetStateAction<Config>>
  setStep: Dispatch<SetStateAction<number>>
  completeSetup: () => void
}

export default function AdditionalSettingsStep({ config, setConfig, setStep, completeSetup } : AdditionalSettingsStepProps) {
  return (
    <>
      <h1>Adjust Additional Settings</h1>
      <p className={`mb-8`}>{`Here are some other features you may wish to enable:`}</p>
      <div className={`flex flex-col gap-4`}>
        <div className={`flex flex-row items-center`}>
          <Switch id="discord" className={`mr-4`} onCheckedChange={(e) => setConfig({...config, discordRichPresence: e})}/>
          <Label htmlFor="discord">Enable Discord Rich Presence</Label>
        </div>
      </div>
      <Button className={`mt-12 text-lg`} onClick={completeSetup}>Finish</Button>
      <p className={`mt-2 cursor-pointer underline`} onClick={() => setStep(2)}>{`< Back`}</p>
    </>
  )
}