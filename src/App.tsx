import { generateSampleDate } from './lib/randomizedQueue';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

const formSchema = z.object({
  maxSeats: z.coerce.number().int().min(1, { message: "1以上の数値を入力してください。" }),
  numberOfApplicants: z.coerce.number().int().min(1, { message: "1以上の数値を入力してください。" }),
  numberOfStacks: z.coerce.number().int().min(1, { message: "1以上の数値を入力してください。" }),
  maxRenban: z.coerce.number().int().min(1, { message: "1以上の数値を入力してください。" }),
  consecutiveTickets: z.coerce.number().int().min(1, { message: "1以上の数値を入力してください。" }),
})

type FormValues = z.infer<typeof formSchema>

function App() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxSeats: 15000,
      numberOfApplicants: 20000,
      numberOfStacks: 1,
      maxRenban: 2,
      consecutiveTickets: 2,
    },
  })

  const [yourSeats, setYourSeats] = useState<number[]>([]);
  const [inRuffle, setInRuffle] = useState<boolean>(false);
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setInRuffle(true);
    const [ raffleBox, entrys ] = generateSampleDate(data.numberOfApplicants, data.numberOfStacks, data.consecutiveTickets, data.maxRenban);
    let leftSeats = data.maxSeats;
    let results: string[] = Array.from({length: leftSeats});
    let winUsers = new Set<string>();
    let yourSeats: number[] = [];
    while(leftSeats > 0 && !raffleBox.isEmpty()) {
      const win = raffleBox.dequeue();
      if(!win) continue;
      if(win.users.length > leftSeats) continue;
      let ignore = false;
      for(const user of win.users) {
        if(winUsers.has(user)) {
          ignore = true;
          break;
        }
      }
      if(ignore) continue
      for(const user of win.users) {
        leftSeats -= 1;
        winUsers.add(user);
        results[leftSeats] = user;
      }
    }
    for(let i = 0; i < results.length; i++) {
      for(const you of entrys[0].users) {
        if(results[i] === you) {
          yourSeats.push(i);
        }
      }
    }
    setTimeout(() => {
      if(yourSeats.length > 0) {
        setYourSeats(yourSeats);
      } else {
        setYourSeats([]);
      }
      setInRuffle(false);
    }, 300)
    
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className='text-3xl font-bold mb-4 text-center'>厳正なる抽選シミュレーター</h1>
      <h2 className="text-xl font-bold mb-4">抽選設定</h2>
    <div className='p-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="maxSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>席数</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfApplicants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>全体申し込み数</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfStacks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>積み数</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxRenban"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最大連番人数</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consecutiveTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>申し込み人数</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" style={{border: "solid", fontWeight: 'bold', padding: '2px'}}>
            { 
              inRuffle ? 
                "抽選中..."
              :
                "抽選開始"
            }
          </button>
        </form>
      </Form>
      <div className='p-4'>
        <p>厳正なる抽選の結果...</p>
        <p>
          {
            yourSeats.length > 0 ? 
              "当選された座席番号は" + yourSeats.join(',') + "です。"
            :
              "ご用意されませんでした。"
          }
        </p>
      </div>
    </div>
    </div>
  )
}

export default App
