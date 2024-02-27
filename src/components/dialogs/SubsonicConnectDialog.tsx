import { DialogContent, DialogHeader } from '../ui/dialog';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const connectSchema = z.object({
  name: z.string(),
  host: z.string().url(),
  port: z.number().optional(),
  username: z.string(),
  password: z.string(),
})

export default function SubsonicConnectDialog() {

  const form = useForm<z.infer<typeof connectSchema>>({
    resolver: zodResolver(connectSchema),
    defaultValues: {
      name: "",
      host: "",
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof connectSchema>) {
    //TODO: Ping server and verify connection
    console.log(values)
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

        </form>
      </Form>
      <div className={`mt-4 flex flex-row gap-4`}>
        <Button className={`ml-auto`} variant={`outline`}>Cancel</Button>
        <Button type='submit'>Connect</Button>
      </div>
    </DialogContent>
  )
}