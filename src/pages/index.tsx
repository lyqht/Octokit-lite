import { BasicUserInfo, LoginButton } from '@/components/Auth';
import Footer from '@/components/Footer';
import { useUser } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import unforkLogo from '../../public/unfork_logo.png';
import octokitLogo from '../../public/logo.png';

export default function Home() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Head>
        <title>Octokit-lite</title>
        <meta
          name="description"
          content="App to help you perform handy operations on your GitHub repositories"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-100 flex flex-grow flex-col items-center justify-center p-4">
        <div
          className={`flex shrink flex-col content-center items-center gap-4 p-4 text-center`}
        >
          <div className="w-32">
            <Image
              layout="responsive"
              src={octokitLogo}
              alt={`Octokit-lite logo`}
            />
          </div>
          <h1 className={`mb-12 text-2xl`}>Octokit-lite</h1>
          {!user && <LoginButton />}
        </div>
        <div className="flex flex-col items-center">
          <Link href={`/unfork`}>
            <button
              className={`btn flex flex-row items-center justify-center gap-4 shadow ${
                loading ? `loading` : ``
              }`}
              onClick={() => setLoading(true)}
            >
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
      <Footer />
    </div>
  );
}
