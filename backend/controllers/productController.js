// backend/controllers/productController.js
const Product = require('../models/Product');
const { Op, Sequelize } = require('sequelize'); // Sequelize ainda é importado caso outras partes o usem

exports.createProduct = async (req, res) => {
  try {
    if (!req.userRole || req.userRole !== 'vendedor') {
      return res.status(403).json({ ok: false, message: 'Acesso negado. Somente vendedores podem cadastrar produtos.' });
    }

    const { name, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ ok: false, message: 'Nenhuma imagem foi enviada.' });
    }
    const imageFilename = req.file.filename;

    const product = await Product.create({
      name,
      description,
      price,
      image: imageFilename,
      userId: req.userId
    });

    res.status(201).json({ ok: true, message: 'Produto cadastrado com sucesso!', product });

  } catch (err) {
    console.error("Erro ao criar produto:", err);
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ ok: false, message: 'Dados inválidos.', errors: messages });
    }
    res.status(500).json({ ok: false, message: err.message || 'Erro interno ao cadastrar o produto.' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    // console.log("BACKEND - Termo de busca recebido:", searchTerm);

    let whereClause = {};

    if (searchTerm) {
      // Mantendo o Op.like direto conforme sua configuração
      const likeSearchTerm = `%${searchTerm}%`; // Usar o searchTerm como recebido para o LIKE,
                                                // ou searchTerm.toLowerCase() se seu banco/colação for sensível a maiúsculas
                                                // e você quiser que a busca não seja.
                                                // Se o SQLite estiver configurado para LIKE case-insensitive (padrão para ASCII),
                                                // %${searchTerm}% pode ser suficiente.
                                                // Para garantir que o frontend e backend comparam da mesma forma (ex: tudo minúsculo):
      // const lowerLikeSearchTerm = `%${searchTerm.toLowerCase()}%`;


      whereClause = {
        [Op.or]: [
          // Se sua configuração do SQLite já lida com case-insensitivity para LIKE,
          // ou se você trata isso de outra forma (ex: colação da tabela).
          { name: { [Op.like]: likeSearchTerm } },
          { description: { [Op.like]: likeSearchTerm } }
          // Se você quiser forçar a comparação em minúsculas no Op.like, e o searchTerm já está em minúsculas:
          // { name: { [Op.like]: lowerLikeSearchTerm } },
          // { description: { [Op.like]: lowerLikeSearchTerm } }
        ],
      };
    }

    const products = await Product.findAll({
      where: whereClause,
    });

    const updatedProducts = products.map(product => ({
      ...product.dataValues,
      image: product.image ? `http://localhost:3001/uploads/${product.image}` : null,
    }));

    res.json({ ok: true, products: updatedProducts });

  } catch (err) {
    console.error("Erro no backend ao buscar produtos:", err);
    res.status(500).json({ ok: false, message: "Erro ao buscar produtos" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      const productData = {
        ...product.dataValues,
        image: product.image ? `http://localhost:3001/uploads/${product.image}` : null,
      };
      res.json({ ok: true, product: productData });
    } else {
      res.status(404).json({ ok: false, message: 'Produto não encontrado' });
    }
  } catch (err) {
    console.error("Erro no backend ao buscar produto por ID:", err);
    res.status(500).json({ ok: false, message: err.message || "Erro ao buscar o produto." });
  }
};