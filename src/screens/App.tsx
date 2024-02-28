import { useEffect } from "react";
import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import { useNavigate } from '@tanstack/react-router';

function App() {
  const navigate = useNavigate({ from: '/'})

  useEffect(() => {
    (async () => {
      const existsResult = await exists('config.json', {baseDir: BaseDirectory.AppLocalData});
      navigate({ to: (existsResult ? '/library' : '/setup')});
    })();
  }, []);

  return (
    <div className={`flex w-full`}>
      <img className={`animate-pulse w-40 h-40 mx-auto my-auto`} src='/tauri.svg' alt='logo' />
    </div>
      
  );
}

export default App;
