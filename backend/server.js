const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
// Define a porta do servidor a partir da variável de ambiente ou padrão 3000
const PORT = process.env.PORT || 3000;

// Middleware para interpretar requisições com corpo JSON
app.use(express.json());

// Middleware para permitir requisições Cross-Origin (CORS)
app.use(cors());

// Rota para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        // Cria usuário no banco usando dados enviados no corpo da requisição
        await prisma.user.create({
            data: {
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            }
        });

        // Responde com status 201 (Criado) e retorna os dados enviados
        res.status(201).json(req.body);
    } catch (error) {
        // Em caso de erro, loga no console e responde com status 500 (Erro interno)
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Rota para listar todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
        // Busca todos os usuários no banco
        const users = await prisma.user.findMany();

        // Responde com status 200 (OK) e lista de usuários
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Rota para atualizar um usuário pelo ID
app.put('/usuarios/:id', async (req, res) => {
    try {
        // Atualiza usuário no banco com o ID da URL e dados do corpo da requisição
        await prisma.user.update({
            where: {
                id: req.params.id // Importante: id como string conforme schema do Prisma
            },
            data: {
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            }
        });

        // Responde com status 201 (Criado/Atualizado) e dados enviados
        res.status(201).json(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// Rota para deletar um usuário pelo ID
app.delete('/usuarios/:id', async (req, res) => {
    try {
        // Deleta usuário no banco pelo ID da URL
        await prisma.user.delete({
            where: {
                id: req.params.id // id como string
            }
        });

        // Responde com status 201 e mensagem de sucesso
        res.status(201).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

// Inicializa o servidor na porta configurada
app.listen(PORT, (err) => {
    if (err) {
        console.log(`Erro ao iniciar servidor na porta ${PORT}...`);
    } else {
        console.log(`Servidor rodando na porta ${PORT}...`);
    }
});