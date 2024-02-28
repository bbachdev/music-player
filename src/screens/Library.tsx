import AlbumSection from '@/components/library/AlbumSection';
import ArtistSection from '@/components/library/ArtistSection';
import Header from '@/components/library/Header';
import NowPlaying from '@/components/library/NowPlaying';
import SongSection from '@/components/library/SongSection';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function Library() {
  return (
    <div className={`flex flex-col max-h-dvh w-full h-full`}>
      <Header/>
      <ResizablePanelGroup direction="horizontal">

        <ResizablePanel minSize={20}>
          <ArtistSection />
        </ResizablePanel>

        <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

        <ResizablePanel minSize={20}>
          <AlbumSection />
        </ResizablePanel>

        <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

        <ResizablePanel minSize={20}>
          <SongSection />
        </ResizablePanel>

      </ResizablePanelGroup>
      <NowPlaying/>
    </div>
  )
}