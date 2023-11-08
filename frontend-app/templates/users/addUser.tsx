import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "./components/PlusIcon";

export function AddUser() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalPlacement, setModalPlacement] = React.useState("center");
  const backdrops = "blur";

  // Estado para controlar os valores dos campos do formulário
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
    city: "",
    profile: "",
    organization: "",
    department: "",
  });

  // Função para lidar com a alteração nos campos do formulário
  const handleChange = ({ }) => {
 //   const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
   //   [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = () => {
    // Lógica para salvar o novo usuário no backend (não implementada aqui)
    console.log("Novo usuário a ser cadastrado:", formData);
    // Fechar o modal após o envio
    onClose();
  };

  return (
    <div className="flex gap-3">
      <Button
         endContent={<PlusIcon width={undefined} height={undefined} />}
         size="sm"
         color="default"
         variant="flat"
        onClick={onOpen}
      >
        Novo usuário
      </Button>
      <Modal backdrop={backdrops} isOpen={isOpen} onClose={onClose} placement="top-center" >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Informações do usuário</ModalHeader>
          <ModalBody>
            <Input
            autoFocus
            label="Nome"
             placeholder="Nome"
             value={formData.name}
             onChange={handleChange}
             variant="bordered"
            size="sm"
            />
            <Input
         
             label="Email"
             placeholder="Enter your email"
             variant="bordered"
             value={formData.email}
             onChange={handleChange}
             size="sm"
           />
            <Input
              label="Endereço"
               placeholder="Endereço"
               value={formData.address}
               onChange={handleChange}
               variant="bordered"
               size="sm"
            />
            {/* Outros campos do formulário... */}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={onClose}>
              Cancelar
            </Button>
            <Button color="secondary" onClick={handleSubmit}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AddUser;
