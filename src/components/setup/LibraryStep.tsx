import { Config } from '@/types/config'
import { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'

import { FaFolder } from "react-icons/fa";
import { FaCloud } from "react-icons/fa";
import { Dialog, DialogTrigger } from '../ui/dialog';
import SubsonicConnectDialog from '../dialogs/SubsonicConnectDialog';

interface LibraryStepProps {
  config: Config
  setConfig: Dispatch<SetStateAction<Config>>
  setStep: Dispatch<SetStateAction<number>>
}

export default function LibraryStep({ config, setConfig, setStep } : LibraryStepProps) {

  return (
    <>
      <h1 className={`font-semibold text-2xl mb-2`}>Add Your Music Library</h1>
      <p className={`mb-4`}>{`Choose the folder(s) where your music is located:`}</p>
      <div className={`flex flex-col gap-4`}>
        <button className={`flex flex-row items-center gap-2 p-4 hover:bg-slate-700/90 border-[1px] dark:border-white rounded-md`}>
          <FaFolder className={`text-2xl mr-2`}/>
          <div className={`flex flex-col text-left`}>
            <h2 className={`text-lg font-semibold`}>{`Add a local Library`}</h2>
            <p>{`Select a folder to add your music library`}</p>
          </div>
        </button>
        <Dialog>
          <DialogTrigger asChild>
            <button className={`flex flex-row items-center gap-2 p-4 hover:bg-slate-700/90 border-[1px] dark:border-white rounded-md`}>
              <FaCloud className={`text-2xl mr-2`}/>
              <div className={`flex flex-col text-left`}>
                <h2 className={`text-lg font-semibold`}>{`Add a server Library`}</h2>
                <p>{`Connect to a Subsonic-compatible library`}</p>
              </div>
            </button>
          </DialogTrigger>
          <SubsonicConnectDialog />
        </Dialog>
      </div>
      
      <Button className={`mt-8 text-lg`} onClick={() => setStep(3)}>Next</Button>
      <p className={`mt-2 cursor-pointer underline`} onClick={() => setStep(1)}>{`< Back`}</p>
    </>
  )
}