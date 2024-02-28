import { FaGear } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";

export default function Header() {
  return (
    <header className={`w-full flex flex-row items-center p-2 px-4 border-b-2`}>
      <img src='/tauri.svg' alt='logo' className={`w-10 h-10`}/>
      <div className={`ml-auto flex flex-row items-center gap-8`}>
        <button title="Force Sync">
          <FaSyncAlt className={`w-8 h-8`}/>
        </button>
        <button title="Settings">
          <FaGear className={`w-8 h-8`}/>
        </button>
      </div>
    </header>
  )
}