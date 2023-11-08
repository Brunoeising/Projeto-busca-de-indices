const FonteModel = require("../models/Fonte");
const { Valueindices } = require("../models/ValueIndices");

let lastFonteId = 0;

const fonteController = {
  create: async (req, res) => {
    try {
      const fonte = {
        fonte: req.body.fonte,
        sigla: req.body.sigla,
        tipo: req.body.tipo,
        frequencia: req.body.frequencia,
        observações: req.body.observações,
        urlfonte: req.body.urlfonte,
        status: req.body.status,

      };

      const lastCreatedFonte = await FonteModel.findOne({}, {}, { sort: { id: -1 } });

      if (lastCreatedFonte) {
        // Extract the last ID and increment it
        lastFonteId = lastCreatedFonte.id;
      }

      // Generate the next sequential ID
      const nextId = lastFonteId + 1;

      // Update the ID in the fonte object
      fonte.id = nextId;

      const createdFonte = await FonteModel.create(fonte);

      res.status(201).json({ fonte: createdFonte, msg: "Fonte cadastrada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao adicionar fonte" });
    }
  },

  getAll: async (req, res) => {
    try {
      const fontes = await FonteModel.find();
      res.json(fontes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao obter fontes" });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "ID não fornecido" });
        return;
      }

      const fonte = await FonteModel.findById(id);

      if (!fonte) {
        res.status(404).json({ msg: "Fonte não encontrada" });
        return;
      }

      res.json(fonte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao obter fonte" });
    }
  },

  delete: async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ error: "ID fornecido não é válido" });
            return;
        }

        const fonte = await FonteModel.findOne({ id: id });

        if (!fonte) {
            res.status(404).json({ msg: "Fonte não encontrada" });
            return;
        }

        // Verifique se existem registros vinculados a esse fonteId em Valueindices
        const linkedValues = await Valueindices.find({ fonteId: id });

        if (linkedValues.length > 0) {
            res.status(400).json({ error: "Não é possível excluir essa fonte pois ela está vinculada a valores existentes." });
            return;
        }

        await FonteModel.deleteOne({ id: id });

        res.status(200).json({ msg: "Fonte deletada com sucesso" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao deletar fonte" });
    }
},

update: async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "ID fornecido não é válido" });
      return;
    }

    const fonte = await FonteModel.findOne({ id: id });

    if (!fonte) {
      res.status(404).json({ msg: "Fonte não encontrada" });
      return;
    }

    const updatedFonte = await FonteModel.findOneAndUpdate({ id: id }, req.body, { new: true });

    res.status(200).json({ fonte: updatedFonte, msg: "Fonte atualizada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao atualizar fonte" });
  }
},

};

module.exports = fonteController;
