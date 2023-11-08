import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";

interface Fonte {
  fonte: string;
  sigla: string;
  tipo?: string;
  frequencia?: string;
  observacoes?: string;
  urlfonte?: string;
  status: string;
}

type AddFonteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateFonte: (novaFonte: Fonte) => void;
  fonteToEdit?: Fonte | null | undefined;

};

const AddFonteModal: React.FC<AddFonteModalProps> = ({ isOpen, onClose, onCreateFonte, fonteToEdit }) => {
  const [fonteValue, setFonteValue] = useState("");
  const [siglaValue, setSiglaValue] = useState("");
  const [tipoValue, setTipoValue] = useState("");
  const [frequenciaValue, setFrequenciaValue] = useState("");
  const [observacoesValue, setObservacoesValue] = useState("");
  const [urlfonteValue, setUrlFonteValue] = useState("");
  const [invalidFields, setInvalidFields] = useState<{ fonte?: boolean, sigla?: boolean }>({});


  const handleCreateFonte = () => {
    let hasInvalidFields = false;
    const newInvalidFields: { fonte?: boolean, sigla?: boolean } = {};  // Indique o tipo aqui
  
    if (!fonteValue) {
      newInvalidFields.fonte = true;
      hasInvalidFields = true;
    }
  
    if (!siglaValue) {
      newInvalidFields.sigla = true;
      hasInvalidFields = true;
    }
  
      setInvalidFields(newInvalidFields);
  
      if (hasInvalidFields) {
        return;  // Se houver campos inválidos, não continue
      }
    const novaFonte: Fonte = {
      fonte: fonteValue,
      sigla: siglaValue,
      tipo: tipoValue,
      frequencia: frequenciaValue,
      urlfonte: urlfonteValue,
      status: "ativo",
    };
    onClose();
    setInvalidFields({});

    
    // Adicionando observacoes se tiver valor
    if (observacoesValue) {
      novaFonte.observacoes = observacoesValue;
    }
  
    onCreateFonte(novaFonte);
    // Limpar os campos após criar a fonte
    setFonteValue("");
    setSiglaValue("");
    setTipoValue("");
    setFrequenciaValue("");
    setObservacoesValue("");
    setUrlFonteValue("");
  };
  
  useEffect(() => {
    if (fonteToEdit) {
      setFonteValue(fonteToEdit.fonte || "");
      setSiglaValue(fonteToEdit.sigla || "");
      setTipoValue(fonteToEdit.tipo || "");
      setFrequenciaValue(fonteToEdit.frequencia || "");
      setObservacoesValue(fonteToEdit.observacoes || "");
      setUrlFonteValue(fonteToEdit.urlfonte || "");
    } else {
      setFonteValue("");
      setSiglaValue("");
      setTipoValue("");
      setFrequenciaValue("");
      setObservacoesValue("");
      setUrlFonteValue("");
    }
  }, [fonteToEdit]);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size='md' >
    <ModalContent>
      <ModalHeader>Criar Nova Fonte</ModalHeader>
      <ModalBody>
        <Input
         type="text"
         variant="flat"
          label="Fonte *"
          labelPlacement="inside"
          errorMessage={invalidFields.fonte}  // Destaque este campo em vermelho se for inválido
          startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">TJNome</span>
              </div>
            }
          size='sm'
          value={fonteValue}
          onChange={(e) => setFonteValue(e.target.value)}
        />
        <Input
          type="text"
          label="Sigla *"
          variant="flat"
          errorMessage={invalidFields.sigla}  // Destaque este campo em vermelho se for inválido
          labelPlacement="inside"
          startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">TJEX</span>
              </div>
            }
          size='sm'
          value={siglaValue}
          onChange={(e) => setSiglaValue(e.target.value)}
        />
          <Input
            type="text"
            label="Tipo"
            variant="flat"
            labelPlacement="inside"
            startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">Acumulado</span>
                </div>
              }
            size='sm'
            value={tipoValue}
            onChange={(e) => setTipoValue(e.target.value)}
          />
          <Input
            type="text"
            label="Frequência"
            variant="flat"
            labelPlacement="inside"
            startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">3x</span>
                </div>
              }
            size='sm'
            value={frequenciaValue}
            onChange={(e) => setFrequenciaValue(e.target.value)}
          />
           <Textarea
            isRequired
            label="Observações"
            labelPlacement="inside"
            placeholder="Digite uma observação"   
            variant="flat"
            value={observacoesValue}
                  onChange={(e) => setObservacoesValue(e.target.value)}
          />
         <Input
          type="url"
          label="Url fonte"
          placeholder="exemplo"
          labelPlacement="inside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">https://</span>
            </div>
          }
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">.com.br</span>
            </div>
          }
            value={urlfonteValue}
            onChange={(e) => setUrlFonteValue(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="light">Cancelar</Button>
          <Button color="default" onClick={handleCreateFonte} variant="shadow" >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFonteModal;
