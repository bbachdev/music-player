import { Config, Library } from '@/types/config'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '../ui/button'

import { FaFolder } from "react-icons/fa";
import { FaCloud } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Dialog, DialogTrigger } from '../ui/dialog';
import SubsonicConnectDialog from '../dialogs/SubsonicConnectDialog';

interface LibraryStepProps {
  config: Config
  setConfig: Dispatch<SetStateAction<Config>>
  setStep: Dispatch<SetStateAction<number>>
}

export default function LibraryStep({ config, setConfig, setStep } : LibraryStepProps) {
  const [libraries, setLibraries] = useState<Library[]>(config.libraries)
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <h1 className={`font-semibold text-2xl mb-2`}>Add Your Music Library</h1>
      <p className={`mb-4`}>{`Choose the folder(s) where your music is located:`}</p>
      {libraries.length > 0 && <p className={`mb-4`}>{`Selected Libraries:`}</p>}
      {libraries.length > 0 && (
          <div className={`flex flex-col text-left mb-6`}>
          {libraries.map((library) => (
            <div key={library.id} className={`p-2 px-4 bg-slate-700 flex flex-row items-center`}>
              {library.type === `local` ? <FaFolder className={`text-2xl mr-4`}/> : <FaCloud className={`text-2xl mr-4`}/>}
              <div className={`flex flex-col`}>
                {library.type === `local` ? <>{library.path}</> : 
                  <>
                    <p className={`font-semibold text-lg`}>{library.name}</p>
                    <p className={`text-sm`}>{library.connectionDetails?.username}</p>
                  </>
                }
              </div>
              <button className={`ml-auto`} onClick={() => setLibraries(libraries.filter((lib) => lib.id !== library.id))}>
                <FaTrash className={`text-xl`}/>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <p className={`mb-4`}>{`Add a library:`}</p>
      <div className={`flex flex-col gap-4`}>
        <button className={`flex flex-row items-center gap-2 p-4 hover:bg-slate-700/90 border-[1px] dark:border-white rounded-md`}>
          <FaFolder className={`text-2xl mr-2`}/>
          <div className={`flex flex-col text-left`}>
            <h2 className={`text-lg font-semibold`}>{`Add a local Library`}</h2>
            <p>{`Select a folder to add your music library`}</p>
          </div>
        </button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className={`flex flex-row items-center gap-2 p-4 hover:bg-slate-700/90 border-[1px] dark:border-white rounded-md`}>
              <FaCloud className={`text-2xl mr-2`}/>
              <div className={`flex flex-col text-left`}>
                <h2 className={`text-lg font-semibold`}>{`Add a server Library`}</h2>
                <p>{`Connect to a Subsonic-compatible library`}</p>
              </div>
            </button>
          </DialogTrigger>
          <SubsonicConnectDialog libraries={libraries} setLibraries={setLibraries} setOpen={setDialogOpen}/>
        </Dialog>
      </div>
      
      <Button className={`mt-6 text-lg`} onClick={() => setStep(3)} disabled={libraries.length === 0}>Next</Button>
      <p className={`mt-2 cursor-pointer underline`} onClick={() => setStep(1)}>{`< Back`}</p>
    </>
  )
}