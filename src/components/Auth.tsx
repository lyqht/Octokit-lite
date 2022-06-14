import { createClient } from '@supabase/supabase-js';
import { Auth, Button, Typography } from '@supabase/ui';
import { PropsWithChildren } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ``;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ``;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BasicUserInfo = () => {
  const { user } = Auth.useUser();

  if (user) {
    return (
      <>
        <Typography.Text>Signed in: {user.email}</Typography.Text>
        <Button block onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  }
  return <></>;
};

export const LoginButton = () => (
  <Auth
    onlyThirdPartyProviders={true}
    supabaseClient={supabase}
    providers={[`github`]}
  />
);

const AuthContext = (props: PropsWithChildren) => {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      {props.children}
    </Auth.UserContextProvider>
  );
};

export default AuthContext;
