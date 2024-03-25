import { useEffect } from "react";
import { store } from "@/util/config";
import { useNavigate } from '@tanstack/react-router';

function App() {
  const navigate = useNavigate({ from: '/'})

  useEffect(() => {
    (async () => {
      navigate({ to: (await store.length() > 0 ? '/library' : '/setup')});
    })();
  }, []);

  return (
    <div className={`flex w-full`}>
      <img className={`animate-pulse w-40 h-40 mx-auto my-auto`} src='/tauri.svg' alt='logo' />
    </div>
      
  );
}

export default App;
