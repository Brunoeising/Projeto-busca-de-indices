import React from "react";
import { Input, Button, Checkbox, Link } from "@nextui-org/react";
import { MailIcon } from './components/MailIcon.jsx';
import { LockIcon } from './components/LockIcon.jsx';
import { getSession, signIn, signOut } from 'next-auth/react';
import { GetServerSideProps } from "next";
import { Google } from '../../components/icons';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
};

export default function SignIn() {
  function handleSignIn() {
    signIn('google');
  }

  const theme = 'dark';
  
  const background = theme === 'dark' 
    ? "url('/bg-desktop.jpg')" 
    : "url('/bg-desktop.jpg')";


          return (     
      <div className="flex flex-col items-center justify-center min-h-screen w-full" 
          style={{ backgroundImage: background, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
           <div className="flex flex-col gap-4 items-center">
              <Input
                autoFocus
                endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                label="Email"
                placeholder="Digite seu e-mail"
                variant="bordered"
              />
              <Input
                endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                label="Senha"
                placeholder="Digite sua senha"
                type="password"
                variant="bordered"
              />
              <div className="flex py-2 px-1 justify-between">
                <Checkbox
                  classNames={{
                    label: "text-small",
                  }}
                  color="secondary"
                >
                  Lembre me
                </Checkbox>
                <Link color="secondary" href="#" size="sm">
                  Esqueceu a senha?
                </Link>
              </div>
                    <Button
                      fullWidth
                      color="default"
                      variant="bordered"
                      onClick={() => handleSignIn()}
                    >
                      Login
                    </Button>
                    <Button
                      fullWidth
                      variant='light'
                      onClick={() => signIn('google')}
                    >
                      <Google size={24} />
                      Acessar com o Google
                    </Button>
            </div>
          </div>
  );
};
