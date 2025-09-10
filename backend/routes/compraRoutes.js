// backend/routes/compraRoutes.js
const express = require('express');
const router = express.Router();
const Compra = require('../models/Compra');
const User = require('../models/User'); // Para adicionar pontos

// ROTA POST /compras - Criar uma nova compra
// authMiddleware será aplicado a esta rota no index.js
router.post('/', async (req, res) => {
  try {
    // userId agora vem de req.userId, que é definido pelo authMiddleware
    const userId = req.userId;
    const { produtos, total, endereco, pagamento } = req.body;

    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Usuário não autenticado.' });
    }
    if (!produtos || produtos.length === 0 || !total || !endereco || !pagamento) {
        return res.status(400).json({ ok: false, message: 'Todos os campos são obrigatórios e o carrinho não pode estar vazio.' });
    }

    // Criação da compra - o setter no modelo Compra cuidará do JSON.stringify(produtos)
    const novaCompra = await Compra.create({
      userId,
      produtos, // Envie o array de produtos diretamente
      total,
      endereco,
      pagamento,
      status: 'Em processamento' // Status inicial
    });

    // Adicionar pontos ao usuário (exemplo: 1 ponto por real gasto)
    const user = await User.findByPk(userId);
    if (user) {
      user.pontos = (user.pontos || 0) + Math.floor(total);
      await user.save();
    }

    res.status(201).json({ ok: true, message: 'Compra finalizada com sucesso!', compra: novaCompra });
  } catch (err) {
    console.error('Erro ao finalizar compra:', err);
    res.status(500).json({ ok: false, message: 'Erro ao finalizar compra.', error: err.message });
  }
});

// ROTA GET /compras/user - Buscar os pedidos do usuário logado
// authMiddleware será aplicado a esta rota no index.js
router.get('/user', async (req, res) => {
  try {
    const userId = req.userId; // Obtido do authMiddleware
    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Usuário não autenticado.' });
    }

    const compras = await Compra.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']] // Pedidos mais recentes primeiro
    });

    // O getter no modelo Compra já desserializa o campo 'produtos'
    res.json({ ok: true, compras });

  } catch (err) {
    console.error('Erro ao buscar pedidos do usuário:', err);
    res.status(500).json({ ok: false, message: 'Erro ao buscar pedidos.', error: err.message });
  }
});

// (Opcional para o futuro) Rota PUT para confirmar entrega
router.put('/:compraId/confirmar-entrega', async (req, res) => {
    try {
        const userId = req.userId;
        const { compraId } = req.params;

        const compra = await Compra.findOne({ where: { id: compraId, userId: userId } });

        if (!compra) {
            return res.status(404).json({ ok: false, message: 'Compra não encontrada ou não pertence a este usuário.' });
        }

        compra.status = 'Entregue'; // Ou 'Finalizado'
        await compra.save();

        res.json({ ok: true, message: 'Status da compra atualizado para Entregue!', compra });
    } catch (err) {
        console.error('Erro ao confirmar entrega:', err);
        res.status(500).json({ ok: false, message: 'Erro ao confirmar entrega.', error: err.message });
    }
});


module.exports = router;
