import { FaGear } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";
import Spinner from '../ui/spinner';

interface HeaderProps {
  syncStatus: number
}

export default function Header({syncStatus}: HeaderProps) {
  return (
    <>
      {syncStatus!==0 && (
        <div className={`w-full py-1 bg-blue-500 text-white text-center`}>
          <div className={`flex flex-row items-center justify-center gap-2`}>
            <Spinner className={`mt-2`} size={18}/>
            <span>
              Syncing Collection...
            </span>
          </div>
        </div>
      )}
      <header className={`w-full flex flex-row items-center p-2 px-4 border-b-2`}>
        <img src='/tauri.svg' alt='logo' className={`w-10 h-10`}/>
        <div className={`ml-auto flex flex-row items-center gap-6`}>
          <button title="Force Sync">
            <FaSyncAlt className={`w-6 h-6`}/>
          </button>
          <button title="Settings">
            <FaGear className={`w-6 h-6`}/>
          </button>
        </div>
      </header>
    </>
    
  )
}