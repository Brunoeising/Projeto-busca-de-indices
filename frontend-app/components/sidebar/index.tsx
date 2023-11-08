import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import Link from 'next/link';
import {InvalidCardIcon} from "./icons/InvalidCardIcon";
import {ShieldSecurityIcon} from "./icons/ShieldSecurityIcon";
import {MonitorMobileIcon} from "./icons/MonitorMobileIcon";



const Sidebar = () => {
  return (
    <div className="flex w-45">
      <style jsx>{`
        .sidebar-item {
          list-style-type: none;
          padding-left: 1.5em;
          position: relative;
        }
        .sidebar-item::before {
          content: "●";
          position: absolute;
          left: 0.5em;
          color: #333;
        }
        .sidebar-item a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
      <Accordion
      showDivider={false}
      isCompact
        variant="light"
        motionProps={{ /* ...props */ }}
      >
        <AccordionItem startContent={<ShieldSecurityIcon className="text-purple-300" />} key="1" aria-label="Gestão" title="Gestão" >
          <ul>
            <li className="sidebar-item"><Link href="/fontes">Fontes</Link></li>
            <li className="sidebar-item"><Link href="/indicadores">Indicadores</Link></li>
          </ul>
        </AccordionItem>
        <AccordionItem startContent={<ShieldSecurityIcon className="text-purple-300" />} key="4" aria-label="IA" title="IA" >
          <ul>
          {/*  <li className="sidebar-item">Calculadora</li>   */}
            <li className="sidebar-item"><Link href="/chat">Chat</Link></li>
          </ul>
        </AccordionItem>
        <AccordionItem startContent={<InvalidCardIcon className="text-purple-400" />} key="2" aria-label="Monitoramento" title="Monitoramento">
          <ul>
            <li className="sidebar-item"><Link href="/tarefas">Tarefas</Link></li>
            <li className="sidebar-item"><Link href="/movidesk">Movidesk</Link></li>
          </ul>
        </AccordionItem>
        <AccordionItem startContent={<MonitorMobileIcon className="text-purple-700" />} key="3" aria-label="Cadastros"title="Cadastros">
          <ul>
         {/*    <li className="sidebar-item">Empresas</li> */}
         {/*    <li className="sidebar-item">Perfis</li> */}
            <li className="sidebar-item"><Link href="/users">Usuários</Link></li>
          </ul>
        </AccordionItem>
      </Accordion>
      <Divider orientation="vertical" />
    </div>
  );
};

export default Sidebar;
