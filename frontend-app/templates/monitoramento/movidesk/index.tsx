import React, { ReactNode } from "react";
import { Spacer, Accordion, AccordionItem, Code, Spinner, Progress } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";


type Ticket = {
    category: String;
    id: string;
    urgency: string;
    status: string;
    slaResponseDate: string;
    owner: { businessName: string };   
};


export default function MovideskTickets() {
    const [newTickets, setNewTickets] = React.useState([]);
    const [openTickets, setOpenTickets] = React.useState([]);
    const [loading, setLoading] = React.useState(true); 
    const [progressValue, setProgressValue] = React.useState(0);

    React.useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgressValue(prevValue => {
                    if (prevValue >= 100) {
                        clearInterval(interval); // Limpe o intervalo se o valor for 100 ou mais
                        return 100;
                    }
                    return prevValue + 5; // Incrementa o valor de 5 a cada intervalo
                });
            }, 5000); // Incrementa o valor a cada 5000ms

            // Certifique-se de limpar o intervalo quando o componente for desmontado
            return () => clearInterval(interval);
        }
    }, [loading]);

    const fetchMovideskTickets = async () => {
        try {
            const response = await fetch("https://backend-app-wheat.vercel.app/api/movidesk/tickets");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
    
            // Filtrar tickets baseado na equipe e data de criação
            const currentTime = new Date().getTime();
            const newTicketsFiltered = data.data.filter((ticket: { createdDate: string | number | Date; ownerTeam: string; }) => {
                const ticketCreatedTime = new Date(ticket.createdDate).getTime();
                const diffTime = Math.abs(currentTime - ticketCreatedTime);
                const diffHours = diffTime / (1000 * 60 * 60);
                return ticket.ownerTeam === "Suporte" && diffHours <= 24;
            });
    
            const openTicketsFiltered = data.data.filter((ticket: { createdDate: string | number | Date; ownerTeam: string; status: string; }) => {
                const ticketCreatedTime = new Date(ticket.createdDate).getTime();
                const diffTime = Math.abs(currentTime - ticketCreatedTime);
                const diffHours = diffTime / (1000 * 60 * 60);
                return ticket.ownerTeam === "Suporte" && diffHours > 24 && ticket.status !== "Fechado";
            });
    
            console.log("Tickets novos:", newTicketsFiltered);
            console.log("Tickets abertos:", openTicketsFiltered);
    
            setNewTickets(newTicketsFiltered);
            setOpenTickets(openTicketsFiltered);
            
        } catch (error) {
            console.error("Erro ao buscar tickets da Movidesk:", error);
        } finally {
            setLoading(false);
            setProgressValue(100); // Defina o progresso como 100% quando terminar
        }
    };
        
    const topContent = (
        <div className="max-w-md">
            <div className="space-y-1">
                <h4 className="text-medium font-medium">Monitoramento</h4>
                <Spacer x={1}  />
                <p className="text-small text-default-400">Monitoramento dos tickets novos e abertos da plataforma movidesk.</p>
                </div>
                <Spacer y={2}  />
                <div className="flex h-5 items-center space-x-4 text-small">
                <div>Movidesk</div>
            </div>
        </div>
    );

    React.useEffect(() => {
        fetchMovideskTickets();
    }, []);

    return (
        <DefaultLayout>
        {topContent}
        <Spacer y={4} />
        {loading ? ( // Verifique se está carregando
            <Progress
                size="md"
                radius="sm"
                color="danger"
                classNames={{
                    base: "max-w-screen-lg",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                }}
                label="Buscando informações atualizadas na Movidesk..."
                value={progressValue} // Atualize este valor para ser dinâmico
                showValueLabel={true}
            />
        ) : (
            <Accordion isCompact>
                <AccordionItem 
                    key="1" 
                    subtitle="Clique para expandir" 
                    title={<><Code color="warning">Tickets novos ({newTickets.length})</Code></>}
                >
                    <TicketsTable tickets={newTickets} />
                </AccordionItem>
                <AccordionItem 
                    key="2" 
                    subtitle="Clique para expandir" 
                    title={<><Code color="danger">Tickets abertos ({openTickets.length})</Code></>}
                >
                    <TicketsTable tickets={openTickets} />
                </AccordionItem>
            </Accordion>
        )}
    </DefaultLayout>
    );
    
}

const TicketsTable: React.FC<{ tickets: Ticket[] }> = ({ tickets }) => (
    <Table 
        removeWrapper
        isCompact
        isHeaderSticky
    >
        <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Categoria</TableColumn>
            <TableColumn>Urgência</TableColumn>
            <TableColumn>Responsável</TableColumn>
        </TableHeader>
        <TableBody>
            {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{ticket.urgency}</TableCell>
                    <TableCell>{ticket.owner ? ticket.owner.businessName : '-'}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
