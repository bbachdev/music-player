import { invoke } from "@tauri-apps/api/core"
import { DialogClose, DialogContent, DialogHeader } from '../ui/dialog';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import Spinner from '../ui/spinner';

import { ConnectionDetails, Library } from '@/types/config';

const connectSchema = z.object({
  name: z.string(),
  host: z.string().url(),
  port: z.number().optional(),
  username: z.string(),
  password: z.string(),
})

interface SubsonicConnectDialogProps {
  libraries: Library[],
  setLibraries: Dispatch<SetStateAction<Library[]>>,
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function SubsonicConnectDialog({ libraries, setLibraries, setOpen } : SubsonicConnectDialogProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const form = useForm<z.infer<typeof connectSchema>>({
    resolver: zodResolver(connectSchema),
    defaultValues: {

    },
  })

  async function onSubmit(values: z.infer<typeof connectSchema>) {
    //TODO: Add a check to see if the library already exists

    setIsConnecting(true)
    //Ping server and verify connection (don't need to send up name)
    const reqObject = {
      host: values.host,
      port: values.port,
      username: values.username,
      password: values.password,
    }
    const res: any = await invoke(`server_ping`, { 'details': reqObject})
    console.log('Response', res)

    if(res.md5_string) {
      console.log('Connection successful')
      let conn : ConnectionDetails = {
        host: values.host,
        port: values.port,
        username: values.username,
        md5: res.md5_string,
        salt: res.salt
      }

      let serverLibrary: Library = {
        id: values.name.toLowerCase().replace(/ /g, ''),
        name: values.name,
        type: 'remote',
        connectionDetails: conn
      }
      console.log('Server Library', serverLibrary)
      //Update library list
      setLibraries([...libraries, serverLibrary])
      setOpen(false)

    }else{
      console.log('Connection failed')
    }

    setIsConnecting(false)
  }

  return (
    <DialogContent>
      <DialogHeader>

      </DialogHeader>
      <Form {...form}>
        <form className={`flex flex-col gap-4`} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField control={form.control} name={`name`} render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription>Pick an identifiable name for this library</FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem> 
          )} />

          <FormField control={form.control} name={`host`} render={({ field }) => (
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormDescription>Enter the complete URL, IP, or hostname for your server</FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem> 
          )} />

          <FormField control={form.control} name={`port`} render={({ field }) => (
            <FormItem>
              <FormLabel>Port #</FormLabel>
              <FormDescription>{`Optional if using URL for host`}</FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem> 
          )} />

          <FormField control={form.control} name={`username`} render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem> 
          )} />

          <FormField control={form.control} name={`password`} render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem> 
          )} />

          <div className={`mt-4 flex flex-row gap-4 items-center`}>
            {isConnecting && (
              <div className={`flex flex-row`}><Spinner className={`mr-4`} size={24}/><span>Testing Connection...</span></div>
            )}
            <DialogClose asChild>
              <Button className={`ml-auto`} variant={`outline`}>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Connect</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}