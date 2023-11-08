import React, { ReactNode, useEffect, useState } from "react";
import { Spacer, Progress, Accordion, AccordionItem } from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

export default function TarefaCron() {
    const [value, setValue] = useState(() => 0);
    const [updateRecords, setUpdateRecords] = useState<Array<{
        ano: ReactNode;
        mes: ReactNode;
        valor: ReactNode;
        updatedAt: ReactNode; 
        date: string; 
        updatedValues: number; 
        fonteId: string; 
    }>>([]);


    const fetchUpdatedRecords = async () => {
        try {
            const response = await fetch("https://backend-app-wheat.vercel.app/api/last-updated");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setUpdateRecords(data);
        } catch (error) {
            console.error("Problema encontrado ao realizar essa operação:");
        }
    };

    useEffect(() => {
        fetchUpdatedRecords();

        const interval = setInterval(() => {
            setValue((v) => {
                if (v >= 300) {
                    fetchUpdatedRecords();
                    localStorage.removeItem("progressValue"); // Clear the saved value in localStorage
                    return 0;
                }
                const newValue = v + 1;
                localStorage.setItem("progressValue", newValue.toString()); // Save the new progress value to localStorage
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const topContent = (
        <div className="max-w-md">
            <div className="space-y-1">
                <h4 className="text-medium font-medium">Monitoramento</h4>
                <Spacer x={1}  />
                <p className="text-small text-default-400">O Robô executa novas consultas a cada 5 minutos, os valores serão atualizados mediante disponibilidade das fontes.</p>
            </div>
            <Spacer y={2}  />
            <div className="flex h-5 items-center space-x-4 text-small">
                <div>Tarefas</div>
            </div>
        </div>
    );

    return (
        <DefaultLayout>
            {topContent}
            <Spacer y={8} />
            <Progress
                label={`Progresso de cada execução`}
                size="md"
                value={value}
                maxValue={300}  // 5 minutes * 60 seconds/minute
                color="warning"
                showValueLabel={true}
                className="max-w-screen-lg"
            />

            <Spacer y={8} />
            <Accordion>
                <AccordionItem key="1" aria-label="Teste" subtitle="Clique para expandir" title="Ultimas atualizações">
                    <Table hideHeader
                        aria-label="Example static collection table"
                        removeWrapper
                        isCompact
                        
                    >
                        <TableHeader>
                            <TableColumn>Fonte</TableColumn>
                            <TableColumn>Mes</TableColumn>
                            <TableColumn>Ano</TableColumn>
                            <TableColumn>Valor</TableColumn>
                            <TableColumn>Atualizado em</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {updateRecords.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell>{record.fonteId}</TableCell> 
                                    <TableCell>{record.mes}</TableCell>
                                    <TableCell>{record.ano}</TableCell>
                                    <TableCell>{record.valor}</TableCell>
                                    <TableCell>{record.updatedAt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionItem>
            </Accordion>
        </DefaultLayout>
    );
}
