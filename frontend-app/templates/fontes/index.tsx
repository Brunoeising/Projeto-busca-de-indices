import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Divider,
  useDisclosure,
  Tooltip,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer
} from "@nextui-org/react";
import {PlusIcon} from "./components/icons/PlusIcon";
import {VerticalDotsIcon} from "./components/VerticalDotsIcon";
import {ChevronDownIcon} from "./components/icons/ChevronDownIcon";
import {SearchIcon} from "./components/SearchIcon";
import {columns, statusOptions} from "./components/data";
import {capitalize} from "./components/utils";
import { useAsyncList } from "@react-stately/data";
import DefaultLayout from "@/layouts/default";
import AddFonteModal from "./AddFonteModal";
import {EyeIcon} from "@/templates/fontes/components/icons/EyeIcon"
import {EditIcon } from "@/templates/fontes/components/icons/EditIcon"
import {DeleteIcon } from "@/templates/fontes/components/icons/DeleteIcon"
import Link from "next/link";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const statusColorMap: Record<string, ChipProps["color"]> = {
  ativo: "success",
  inativo: "danger",
  vacation: "warning",
};

type Fonte = {
    id: number;
    fonte: string;
    sigla: string;
    tipo?: string;
    frequencia?: string;
    observações?: string;
    urlfonte?: string;
    status: string; 
   
  };

const INITIAL_VISIBLE_COLUMNS = ["fonte", "sigla", "status", "ações"];


export default function FontesList() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const { isOpen: isDeleteModalOpen, onClose: onCloseDeleteModal, onOpen: onOpenDeleteModal } = useDisclosure();
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null);
  const { isOpen: isSuccessModalOpen, onClose: onCloseSuccessModal, onOpen: onOpenSuccessModal } = useDisclosure();
  const { isOpen: isWarningModalOpen, onClose: onCloseWarningModal, onOpen: onOpenWarningModal } = useDisclosure();
  const [fonteToEdit, setFonteToEdit] = React.useState<Fonte | null>(null);

  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);


  const list = useAsyncList<Fonte>({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || "https://backend-app-wheat.vercel.app/api/fontes", { signal });
      const data = await res.json();
  
      (data.totalCount);
      setIsLoading(false);
  
      return {
        items: data,
        cursor: data.nextCursor,
      };
    },
  });

  async function exportToExcel() {
    try {
      // 1. Fetch data from API
      const response = await fetch('https://backend-app-wheat.vercel.app/api/valueindices/latest');
      const data = await response.json();
  
      // 2. Convert data to Excel format
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      // 3. Export the file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(blob, 'data.xlsx');
  
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
    }
  };

  const handleModalClose = () => {
    setFonteToEdit(null);  // Limpe o estado fonteToEdit ao fechar o modal
    onClose();
  };


  const handleSaveFonte = async (novaFonte: any) => {
    try {
      // Validar campos obrigatórios
      if (!novaFonte.fonte || !novaFonte.sigla) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
  
      let url = "https://backend-app-wheat.vercel.app/api/fontes";
      let method = "POST";
  
      if (fonteToEdit) {
        url = `${url}/${fonteToEdit.id}`;
        method = "PUT";
      }    
  
      const response = await fetch(url, {
        cache: "default",
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaFonte),
      });
  
      if (response.ok) {
        list.reload();
        onClose();
        setFonteToEdit(null);
        if (method === "PUT") {
          onOpenSuccessModal();
        }
      } else {
        console.error("Erro ao salvar a fonte.");
      }
    } catch (error) {
      console.error("Erro ao salvar a fonte:", error);
    }
  };
  


  const handleDeleteItem = (itemId: number) => {
    setItemToDelete(itemId);
    onOpenDeleteModal();
  };

  const handleActualDelete = async (itemId: number) => {
    try {
      const response = await fetch(`https://backend-app-wheat.vercel.app/api/fontes/${itemId}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        list.reload();
        onOpenSuccessModal();
      } else {
        if (data.error && data.error.includes("vinculada a valores existentes.")) {
          onOpenWarningModal();
        } else {
          alert("Erro ao deletar item.");
        }
      }
    } catch (error) {
      alert("Erro ao deletar item:");
    }
  };
  
  const handleEditItem = (item: Fonte) => {
    setFonteToEdit(item);
    onOpen();
  };
  
  
  const deleteConfirmationModal = (
    <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}backdrop="blur">
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
    <Modal isOpen={isSuccessModalOpen} onClose={onCloseSuccessModal}backdrop="blur">
      <ModalContent>
        <ModalHeader>Concluído</ModalHeader>
        <ModalBody>Item deletado com sucesso!</ModalBody>
        <ModalFooter className="flex justify-center">
          <Button color="success" onClick={onCloseSuccessModal}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const successUpdateModal = (
    <Modal isOpen={isSuccessModalOpen} onClose={onCloseSuccessModal}backdrop="blur">
      <ModalContent>
        <ModalHeader>Concluído</ModalHeader>
        <ModalBody>Fonte atualizada com sucesso!</ModalBody>
        <ModalFooter className="flex justify-center">
          <Button color="success" onClick={onCloseSuccessModal}>OK!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  

  const warningModal = (
    <Modal isOpen={isWarningModalOpen} onClose={onCloseWarningModal} backdrop="blur">
      <ModalContent>
        <ModalHeader>Aviso</ModalHeader>
        <ModalBody>Não é possível excluir essa fonte pois ela está vinculada a valores existentes.</ModalBody>
        <ModalFooter className="flex justify-center">
         <Button color="warning" variant="shadow"   onClick={onCloseWarningModal}>Entendi</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  

  const filteredItems = React.useMemo(() => {
    let filteredData = [...list.items];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.fonte.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredData = filteredData.filter((item) =>
        Array.from(statusFilter).includes(item.status),
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
    return [...items].sort((a: Fonte, b: Fonte) => {
      const first = a[sortDescriptor.column as keyof Fonte] as number;
      const second = b[sortDescriptor.column as keyof Fonte] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
  
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  

  const renderCell = React.useCallback((item: Fonte, columnKey: any) => {
    const cellValue = item[columnKey as keyof Fonte];

    switch (columnKey) {
        case "name":
          return (
              <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "sigla":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "status":
          return (
            <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
              {cellValue}
            </Chip>
          );
        case "ações":
          return (
            <div className="relative flex items-center gap-2">
               <Tooltip content="Ver detalhes">
            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <Link href={`/detalhes/${item.id}`}>
                <EyeIcon />
              </Link>
            </span>
          </Tooltip>
          <Tooltip content="Editar">
            <span 
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => handleEditItem(item)} 
            >
              <EditIcon />
            </span>
          </Tooltip>
            <Tooltip color="danger" content="Deletar">
                  <span 
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                    onClick={() => handleDeleteItem(item.id)} // Adicione esta linha
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
            <div>Fontes </div>
          </div>
        </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            size='sm'
            variant="underlined"
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar fontes..."
            startContent={<SearchIcon variant='shadiw' />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange} />
          <div className="flex gap-3">
            <Dropdown backdrop="blur">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="bordered"
                  color="default"
                >
                  Status
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
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown backdrop="blur">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="bordered"
                  color="default"
                >
                  Colunas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="default" size="sm" variant="flat" onClick={exportToExcel}>
              Exportar
            </Button>
            <Button
              color="default"
              variant="flat"
              size='sm'
              endContent={<PlusIcon width={undefined} height={undefined} />}
              onClick={onOpen}
            >
              Nova fonte
            </Button>
            
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalItens} fontes</span>
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
          total={pages}
          onChange={setPage} // Use 'setPage' function here for pagination
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
    {warningModal} 
    {successUpdateModal} 
    <AddFonteModal
      isOpen={isOpen}
      onClose={handleModalClose}  // Atualizado para usar handleModalClose
      onCreateFonte={handleSaveFonte}
      fonteToEdit={fonteToEdit}
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
             <TableRow key={item.fonte}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
 </DefaultLayout>  
  );
}


