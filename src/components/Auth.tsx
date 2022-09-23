import { createClient } from '@supabase/supabase-js';
import { Auth, Button } from '@supabase/ui';
import { PropsWithChildren } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ``;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ``;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BasicUserInfo = () => {
  const { user } = Auth.useUser();

  if (user) {
    return (
      <>
        <p className="text-slate-600 text-sm">Signed in: {user.email}</p>
        <Button type="default" block onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  }
  return <></>;
};

export const LoginButton = () => (
  <Button
    onClick={() =>
      supabase.auth.signIn(
        { provider: `github` },
        { redirectTo: window.location.origin, scopes: `delete_repo, repo` },
      )
    }
  >
    Sign in with GitHub
  </Button>
);

const AuthContext = (props: PropsWithChildren) => {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      {props.children}
    </Auth.UserContextProvider>
  );
};

export default AuthContext;
