import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

interface Indice {
  fonteId: number; // Adicionamos fonteId aqui
  ano: string;
  mes: string;
  valor: string;
  observacoes: string;
}

type AddIndiceModalProps = {
  fonteId: number; // Adicionamos fonteId aqui
  isOpen: boolean;
  onClose: () => void;
  onCreateIndice: (novoValor: Indice) => void;
};

const AddIndiceModal: React.FC<AddIndiceModalProps> = ({
  fonteId, // Desestruture o fonteId aqui
  isOpen,
  onClose,
  onCreateIndice,
}) => {
  const [anoValue, setAnoValue] = useState("");
  const [mesValue, setMesValue] = useState("");
  const [resValue, setValorValue] = useState("");
  const [observacoesValue, setObservacoesValue] = useState("");

  const handleCreateIndice = () => {
    const novoIndice: Indice = {
      fonteId: fonteId,
      ano: anoValue,
      mes: mesValue,
      valor: resValue,
      observacoes: observacoesValue,
    };

    onCreateIndice(novoIndice);
    setAnoValue("");
    setMesValue("");
    setValorValue("");
    setObservacoesValue("");
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size='sm'>
      <ModalContent>
        <ModalHeader>Criar Novo valor</ModalHeader>
        <ModalBody>
          <Input
             type="number"
            label="Ano *"
            labelPlacement="inside"
            startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">2023</span>
                </div>
              }
            size='sm'
            value={anoValue}
            onChange={(e) => setAnoValue(e.target.value)}
          />
          <Input
            type="number"
            label="Mês *"
            labelPlacement="inside"
            startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">12</span>
                </div>
              }
            size='sm'
            value={mesValue}
            onChange={(e) => setMesValue(e.target.value)}
          />
          <Input
            type="number"
            label="Valor *"
            labelPlacement="inside"
            startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">0.001</span>
                </div>
              }
            size='sm'
            value={resValue}
            onChange={(e) => setValorValue(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="light">Cancelar</Button>
          <Button color="default" onClick={handleCreateIndice} variant="shadow">
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddIndiceModal;
