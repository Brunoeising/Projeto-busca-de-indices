import React from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button,
  DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, Pagination, Selection,
  ChipProps, SortDescriptor, Divider, useDisclosure, Tooltip, Spinner, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Link, Spacer
} from "@nextui-org/react";
import { PlusIcon } from "../components/icons/PlusIcon";
import { columns } from "../indices/components/data";
import { useAsyncList } from "@react-stately/data";
import DefaultLayout from "@/layouts/default";
import * as XLSX from 'xlsx';
import AddIndiceModal from "./addValor";
import { EditIcon } from "@/templates/fontes/components/icons/EditIcon";
import { DeleteIcon } from "@/templates/fontes/components/icons/DeleteIcon";
import ChartIndices from "@/components/charts/chartInd";

const statusColorMap: Record<string, ChipProps["color"]> = {
  ativo: "success",
  inativo: "danger",
  vacation: "warning",
};

type IndValue = {
   _id: number;
    ano: any;
    mes: any;
    valor: any;
    observações?: string;
   
  };

const INITIAL_VISIBLE_COLUMNS = ["ano", "mes", "valor", "ações"];


export default function Valueindices({ fonteId }: { fonteId: string | string[] | undefined }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "ano",
    direction: "descending",
  });  
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen: isDeleteModalOpen, onClose: onCloseDeleteModal, onOpen: onOpenDeleteModal } = useDisclosure();
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null);
  const { isOpen: isSuccessModalOpen, onClose: onCloseSuccessModal, onOpen: onOpenSuccessModal } = useDisclosure();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const list = useAsyncList<IndValue>({
    async load({ signal, cursor }) {
      const url = fonteId ? `https://backend-app-wheat.vercel.app/api/valueindices/fonte/${fonteId}` : (cursor || "https://backend-app-wheat.vercel.app/api/valueindices");
      const res = await fetch(url, { signal });
      const data = await res.json();
  
      setIsLoading(false);
  
      return {
        items: data,
        cursor: data.nextCursor,
      };
    },
  });  

  const exportToExcel = () => {
    const dataToExport = list.items.map(item => ({
      Ano: item.ano,
      Mês: item.mes,
      Valor: item.valor,
      Observações: item.observações || '',
    }));
  
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');
    XLSX.writeFile(wb, 'dados.xlsx');
  };
  
  
  const handleCreateIndice = async (novoIndice: any) => {
    try {
      const indiceWithFonteId = { ...novoIndice, fonteId: Number(fonteId) };
      const response = await fetch("https://backend-app-wheat.vercel.app/api/valueindices", {
        cache: "default",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(indiceWithFonteId),
      });
  
      if (response.ok) {
        list.reload();
        onClose();
      } else {
        console.error("Erro ao criar a nova fonte.");
      }
    } catch (error) {
      console.error("Erro ao criar a nova fonte:", error);
    }
  };

  const handleDeleteItem = (itemId: number) => {
    setItemToDelete(itemId);
    onOpenDeleteModal();
  };

  const handleActualDelete = async (itemId: number) => {
    try {
      const response = await fetch(`https://backend-app-wheat.vercel.app/api/valueindices/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        list.reload();
        onOpenSuccessModal(); // Abre o modal de sucesso
      } else {
        alert("Erro ao deletar item.");
      }
    } catch (error) {
      alert("Erro ao deletar item:");
    }
  };
  

  const deleteConfirmationModal = (
    <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal} backdrop="blur">
      <ModalContent>
        <ModalHeader>Confirmação</ModalHeader>
        <ModalBody>Você tem certeza de que deseja excluir este item?</ModalBody>
        <ModalFooter className="flex justify-center">
          <Button color="danger" onClick={() => {
            if (itemToDelete !== null) {
              handleActualDelete(itemToDelete);
            }
            onCloseDeleteModal();
          }}>Excluir</Button>
          <Button color="default" onClick={onCloseDeleteModal}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const successConfirmationModal = (
    <Modal isOpen={isSuccessModalOpen} onClose={onCloseSuccessModal} backdrop="blur">
      <ModalContent>
        <ModalHeader>Concluído</ModalHeader>
        <ModalBody>Item deletado com sucesso!</ModalBody>
        <ModalFooter className="flex justify-center">
          <Button color="success" onClick={onCloseSuccessModal}>OK!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  

  const filteredItems = React.useMemo(() => {
    let filteredData = [...list.items];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.ano.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== length) {
      filteredData = filteredData.filter((item) =>
        Array.from(statusFilter).includes(item.ano),
      );
    }

    return filteredData;
  }, [list.items, filterValue, statusFilter]);

  const totalItens = filteredItems.length; // Armazenar o total de itens em uma variável
  const pages = Math.ceil(totalItens / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IndValue, b: IndValue) => {
      let first, second;
      if (sortDescriptor.column === 'ano') {
        first = Number(a[sortDescriptor.column as keyof IndValue]);
        second = Number(b[sortDescriptor.column as keyof IndValue]);
      } else {
        first = a[sortDescriptor.column as keyof IndValue] as string;
        second = b[sortDescriptor.column as keyof IndValue] as string;
      }
      const cmp = first < second ? -1 : first > second ? 1 : 0;
  
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  

  const renderCell = React.useCallback((item: IndValue, columnKey: any) => {
    const cellValue = item[columnKey as keyof IndValue];

    switch (columnKey) {
        case "ano":
          return (
              <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "mes":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "valor":
          return (
            <Chip className="capitalize" color={statusColorMap[item.ano]} size="sm" variant="flat">
              {cellValue}
            </Chip>
          );
          case "ações":
            return (
              <div className="relative flex items-center gap-2">
                <Tooltip color="danger" content="Deletar">
                  <span 
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                    onClick={() => handleDeleteItem(item._id)} // Adicione esta linha
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </div>
            );
          
        default:
          return cellValue;
      }
    }, []);
  
  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <><div className="max-w-md">
      <div className="space-y-1">
        <h4 className="text-medium font-medium">Gestão de fontes</h4>
        <Spacer y={1}  />
        <p className="text-small text-default-400">  A atualização dos valores ocorre mediante disponibilidade das fontes.</p>
      </div>
      <Spacer y={1}  />
      <div className="flex h-5 items-center space-x-4 text-small">
      <Link href="/fontes" color="foreground" underline="hover" size="sm" >Fontes</Link>
      <Spacer x={1}  />
        <Divider orientation="vertical" />
      <Spacer x={1}  />
      <Link href="#" color="foreground" underline="hover" size="sm">Detalhes</Link>
      </div>
    </div>      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Dropdown backdrop="blur">
              <DropdownTrigger className="hidden sm:flex">
              <Button
                color="default"
                variant="flat"

                size="sm"
                onClick={exportToExcel}
              >
                Exportar para Excel
              </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
        
              </DropdownMenu>
            </Dropdown>
            <Button
              color="default"
              variant="flat"
              size='sm'
              endContent={<PlusIcon width={undefined} height={undefined} />}
              onClick={onOpen}
            >
              Novo valor
            </Button>
          </div>
        </div>
        <div className="max-h-screen flex items-center justify-center">
          <ChartIndices />
      </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalItens} indices</span>
          <label className="flex items-center text-default-400 text-small">
            Resultados por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div></>
    );
  }, 
    [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, hasSearchFilter, items]);


    const bottomContent = React.useMemo(() => {
      return (
        <>
          <div className="py-2 px-2 flex justify-center items-center">
            <Pagination
              showControls
              showShadow
              variant="bordered"
              color="default"
              isDisabled={hasSearchFilter}
              page={page}
              total={pages} // Aqui você passa o número total de páginas, não o número total de itens
              onChange={setPage}
            />
            <span className="w-[30%] text-small text-default-400">
              {selectedKeys === "all"
                ? "Todos estão selecionados"
                : `${selectedKeys.size} de ${totalItens} selecionados`}
            </span>
            <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
          </div>
          <Divider className="my-4" />
        </>
      );
    }, [selectedKeys, totalItens, pages, hasSearchFilter, page]);

  
  return (
    <DefaultLayout>
    {deleteConfirmationModal}
    {successConfirmationModal}
     <AddIndiceModal
        fonteId={Number(fonteId)}
        isOpen={isOpen}
        onClose={onClose}
        onCreateIndice={handleCreateIndice}
      />
       
     <Table
        removeWrapper
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        color="secondary"
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          
          {(column) => (   
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={isLoading && !items.length}
        loadingContent={<Spinner color="secondary" />}emptyContent={"Nenhuma fonte encontrada"} items={sortedItems}>
          {(item) => (
             <TableRow key={item._id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
 </DefaultLayout>  
  );
}


