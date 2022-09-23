import { BasicUserInfo, LoginButton } from '@/components/Auth';
import { useUser } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import unforkLogo from '../../public/unfork_logo.png';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex h-screen flex-col">
      <div className="h-100 flex flex-grow flex-col items-center justify-center p-4">
        <Head>
          <title>Octokit-lite</title>
          <meta
            name="description"
            content="App to help you perform handy operations on your GitHub repositories"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
          className={`flex shrink flex-col content-center justify-items-center gap-4 p-4 text-center`}
        >
          <h1 className={`text-5xl`}>Octokit-lite</h1>
          {!user && <LoginButton />}
        </div>
        <div className="flex flex-col items-center">
          <Link href={`/unfork`}>
            <button className="btn flex flex-row items-center justify-center gap-4 shadow">
              <div className="w-12">
                <Image layout="responsive" src={unforkLogo} alt={`Unfork`} />
              </div>
              <p>Unfork</p>
            </button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        {user && <BasicUserInfo user={user} />}
      </div>
    </div>
  );
}
