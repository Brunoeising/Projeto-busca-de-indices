import React from "react";
import {
  Button, Card, CardBody, CardFooter,
  Avatar, AvatarIcon, Input, Spacer
} from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import { useSession } from 'next-auth/react';

const ChatLayout = () => {
  const { data: session } = useSession();

  const topContent = (
    <div className="max-w-md">
        <div className="space-y-1">
            <h4 className="text-medium font-medium">Inteligência artificial</h4>
            <Spacer x={1} />
            <p className="text-small text-default-400">Você poderá esclarecer dúvidas, elaborar contratos, analisar dados e muito mais, com a inteligencia artificial Aquila.</p>
        </div>
        <Spacer y={2} />
        <div className="flex h-5 items-center space-x-4 text-small">
            <div>Chat</div>
        </div>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="flex flex-col h-screen">
        <div className="p-4">
          {topContent}
        </div>
        <Spacer y={2} />
        <Card isBlurred
          className="flex-grow border-none bg-background/60 dark:bg-default-100/50 shadow-lg"
        >
          {/* Corpo do chat */}
          <CardBody className="overflow-y-auto">
            {/* Mensagem recebida */}
            <div className="flex items-center mb-4 p-4">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" size="sm" />
              <span className="ml-2">Olá! Como posso ajudar você hoje?</span>
            </div>
            
            {/* Mensagem enviada */}
            <div className="flex items-center justify-end mb-4 p-4">
              <span className="mr-2">Estou tendo um problema com o meu pedido.</span>
              {session?.user ? (
                  <Avatar isBordered src={session?.user?.image ?? undefined} />
              ) : (
                <AvatarIcon />
              )}
            </div>
          </CardBody>

          {/* Rodapé do chat */}
          <CardFooter className="px-4 py-2 flex-shrink-0 flex items-center">
            <Input placeholder="Digite sua mensagem..." width="70%" className="ml-2 flex-grow" />
            <Button size="sm" variant="flat" color="default" className="ml-2">Enviar</Button>
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}

export default ChatLayout;
