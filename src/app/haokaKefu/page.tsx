'use client';
import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Footer from '../components/Footer';
import LoadingDots from '../components/LoadingDots';
import ResizablePanel from '../components/ResizablePanel';

const zhishiku =
  'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/plugin/jksyfhq8pi9fbd8a/';
const chat =
  'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions';
const haoka =
  'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/plugin/pb1xvfb7n5rar004/';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState('联通号码，月租29元，流量多点。');
  const [generatedDescs, setGeneratedDescs] = useState<string>('');
  const [token, setToken] = useState('');
  const defultDesc = '比如：联通号码，月租29元，流量多点。';

  useEffect(() => {
    // if (!token) getToken();
  }, []);
  const getToken = async () => {
    const result = await fetch('/api/getAccessToken');
    const data = await result.json();
    setToken(data.access_token);
  };
  const generatedData = (e: any) => {
    e.preventDefault();
    setGeneratedDescs('');
    getInfo();
  };
  const haokaModel = async () => {
    setLoading(true);
    const response = await fetch(`${haoka}?access_token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: desc,
        plugins: ['uuid-zhishiku'],
        // stream: true,
      }),
    });

    const result = await response.json();
    setGeneratedDescs(result.result);
    setLoading(false);
  };
  const phoneCardModel = async () => {
    setLoading(true);
    const response = await fetch(`${zhishiku}?access_token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: desc,
        plugins: ['uuid-zhishiku'],
        // stream: true,
      }),
    });

    const result = await response.json();
    setGeneratedDescs(result.result);
    setLoading(false);
  };
  const publicModel = async () => {
    setLoading(true);
    const response = await fetch(`${chat}?access_token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: desc }],
        stream: true,
        system: '你是运营商的客服人员，帮助用户选择合适的手机号，并解答疑问。',
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    // const result = await response.json();
    // console.log("data", result);
    // setGeneratedDescs(result.result);
    // return;
    // This data is a ReadableStream
    const data = response.body;
    if (!data) return;
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      const resultObj = chunkValue.split(': ')[1];
      try {
        const resultText = JSON.parse(resultObj).result;
        setGeneratedDescs((prev) => prev + resultText);
      } catch (error) {
        console.error(error);
      }
    }

    setLoading(false);
  };
  const getInfo = async () => {
    setLoading(true);
    const response = await fetch(`/api/getOneHaoka`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: desc,
      }),
    });

    const result = await response.json();
    console.log('result', result);
    setGeneratedDescs(result.data);
    setLoading(false);
  };

  return (
    <div className='flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>AI 客服</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:mt-4'>
        <h1 className='sm:text-3xl text-2xl max-w-1xl font-bold text-slate-900'>
          一秒解决找到合适你的手机卡套餐
        </h1>
        {/* <p className="text-slate-500 mt-5">以帮助1254次.</p> */}
        <div className='max-w-xl w-full'>
          <div className='flex mt-4 items-center space-x-3 mb-3'>
            {/* <Image src="/1-black.png" width={30} height={30} alt="1 icon" /> */}
            <p className='text-left font-medium'>请输入你的需求：</p>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-2'
            placeholder={defultDesc}
          />

          {!loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-4 mt-3 hover:bg-black/80 w-full'
              onClick={(e) => generatedData(e)}
            >
              寻找套餐
            </button>
          )}
          {loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-4 mt-3 hover:bg-black/80 w-full'
              disabled
            >
              <LoadingDots color='white' style='large' />
            </button>
          )}
        </div>
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />

        <div className='space-y-10 my-4'>
          {generatedDescs && (
            <>
              {/* <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">Your generated email</h2>
                  </div> */}
              <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto  whitespace-pre-wrap'>
                <div className='bg-white rounded-xl shadow-md p-4 text-left '>
                  <div
                    dangerouslySetInnerHTML={{ __html: generatedDescs }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
