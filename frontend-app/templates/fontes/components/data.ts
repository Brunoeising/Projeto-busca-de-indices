import React from "react";
const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "FONTE", uid: "fonte", sortable: true},
  {name: "SIGLA", uid: "sigla", sortable: true},
  {name: "TIPO", uid: "tipo", sortable: true},
  {name: "ORSERVAÇÕES", uid: "observações"},
  {name: "URL", uid: "urlfonte"},
  {name: "FREQUENCIA", uid: "frequencia"},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "AÇÕES", uid: "ações"},
];

const statusOptions = [
  {name: "ativo", uid: "ativo"},
  {name: "inativo", uid: "inativo"},
];

export {columns, statusOptions};
