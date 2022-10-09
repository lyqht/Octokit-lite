import { BasicUserInfo, signInGitHub } from '@/components/Auth';
import Footer from '@/components/Footer';
import { useUser } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import unforkLogo from '../../public/unfork_logo.png';
import topicspaceLogo from '../../public/topicspace_logo.svg';
import octokitLogo from '../../public/logo.png';

export default function Home() {
  const { user } = useUser();
  const [loading, setLoading] = useState<null | number>(null);

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
          {!user && (
            <button
              className={`btn btn-primary shadow ${
                loading === 99 ? `loading before:order-2 before:ml-2` : ``
              }`}
              onClick={async () => {
                setLoading(99);
                await signInGitHub();
              }}
            >
              Sign in with GitHub
            </button>
          )}
        </div>
        <div className="flex flex-col items-center gap-8">
          <Link href={`/unfork`}>
            <button
              className={`btn tooltip tooltip-right tooltip-info flex flex-row items-center justify-center gap-4 shadow ${
                user ? `` : `btn-disabled`
              } ${loading === 0 ? `loading before:order-2 before:ml-2` : ``}`}
              data-tip="Delete your forks and repos"
              onClick={() => setLoading(0)}
            >
              <div className="w-12">
                <Image
                  layout="responsive"
                  src={unforkLogo}
                  alt={`Unfork`}
                  className={`${user ? `` : `opacity-60`}`}
                />
              </div>
              <p>Unfork</p>
            </button>
          </Link>
          <Link href={`/topicspace`}>
            <button
              className={`btn tooltip tooltip-right tooltip-info flex flex-row items-center justify-center gap-4 shadow ${
                user ? `` : `btn-disabled`
              } ${loading === 1 ? `loading before:order-2 before:ml-2` : ``}`}
              data-tip="Add topics to repos"
              onClick={() => setLoading(1)}
            >
              <div className="w-12">
                <Image
                  layout="responsive"
                  src={topicspaceLogo}
                  className={`${user ? `` : `opacity-60`}`}
                  alt={`topicspace logo`}
                />
              </div>
              <p>TopicSpace</p>
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
