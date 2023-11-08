const { Valueindices } = require("../models/ValueIndices");
const FonteModel = require("../models/Fonte");

async function existsFonteWithId(fonteId) {
  try {
    const fonte = await FonteModel.findOne({ idSequencial: fonteId });  // Altere esta linha
    return !!fonte;
  } catch (error) {
    console.error("Erro ao verificar a existência de Fonte:", error);
    return false;
  }
}


const valueindiController = {
  create: async (req, res) => {
    try {
      if (!await existsFonteWithId(req.body.fonteId)) { 
        res.status(400).send({ error: "Fonte não encontrada!" });
        return;
    }  

      const valueindices = {
        fonteId: req.body.fonteId,      
        ano: req.body.ano,
        mes: req.body.mes,
        valor: req.body.valor,
        observações: req.body.observações,
      };
      
      await Valueindices.create(valueindices);

      res.status(201).json({ message: "Valor do índice adicionado com sucesso!" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao adicionar valor do índice" });
    }
  },

  getByFonteId: async (req, res) => {
    try {
        const fonteId = parseInt(req.params.fonteId);  // Convertendo para número inteiro
  
        if (!fonteId) {
            res.status(400).json({ error: "ID da fonte não fornecido" });
            return;
        }
  
        const values = await Valueindices.find({ fonteId: fonteId });
  
        res.json(values);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao obter valores de índice para a fonte" });
    }
},


getLatestByFonteId: async (req, res) => {
  try {
      // Agregação para agrupar por fonteId e pegar o registro mais recente de cada grupo
      const latestRecords = await Valueindices.aggregate([
          {
              $sort: { createdAt: -1 }  // Supondo que você tenha um campo createdAt. Se não, você pode usar updatedAt ou outro campo de data.
          },
          {
              $group: {
                  _id: "$fonteId",
                  latestRecord: { $first: "$$ROOT" }
              }
          },
          {
              $replaceRoot: { newRoot: "$latestRecord" } // Substituir o documento raiz pelo registro mais recente
          }
      ]);

      res.json(latestRecords);
  } catch (error) {
      console.error("Erro ao buscar os registros mais recentes por fonteId:", error);
      res.status(500).send("Erro ao buscar registros");
  }
},




  getAll: async (req, res) => {
    try {
      const valueindices = await Valueindices.find();
      res.json(valueindices);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao obter valores de índice" });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "ID não fornecido" });
        return;
      }

      const valueindices = await Valueindices.findById(id);

      if (!valueindices) {
        res.status(404).json({ msg: "Valor de índice não encontrado" });
        return;
      }

      res.json(valueindices);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao obter valor de índice" });
    }
  },

  getLastUpdated: async (req, res) => {
    try {
        const records = await Valueindices.find().sort({ updatedAt: -1 }).limit(40);
        res.json(records);
    } catch (error) {
        console.error("Erro ao buscar os registros atualizados:", error);
        res.status(500).send("Erro ao buscar registros");
    }
},

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "ID não fornecido" });
        return;
      }

      const valueindices = await Valueindices.findById(id);

      if (!valueindices) {
        res.status(404).json({ msg: "Valor não encontrado" });
        return;
      }
      const deletedValueindices = await Valueindices.findByIdAndDelete(id);

      res.status(200).json({ msg: "Valor deletado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar valor" });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const valueindices = {
      observações: req.body.observações,
      ano: req.body.ano,
      mes: req.body.mes,
      valor: req.body.valor,
    };

    const updatedValueindices = await Valueindices.findByIdAndUpdate(id, valueindices);
    if (!updatedValueindices) {
      res.status(404).json({ msg: "Valor não encontrado" });
      return;
    }

    res.status(200).json({ msg: "Valor atualizado com sucesso!" });
  },

  deleteAll: async (req, res) => {
    try {
      await Valueindices.deleteMany({});
      res.status(200).json({ msg: "Todos os valores do índice foram excluídos com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao excluir todos os valores do índice" });
    }
  },
};

console.log("getByFonteId:", typeof valueindiController.getByFonteId);
Valueindices.schema.index({ createdAt: -1 });


module.exports = valueindiController;
