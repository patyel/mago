import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import OpenAI from "openai";

// Configuração
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Inicializa OpenAI apenas quando necessário
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// Funções auxiliares
const loadUsers = () => {
  try {
    const data = readFileSync(join(__dirname, "users.json"), "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao carregar users.json:", error);
    return { users: {} };
  }
};

const saveUsers = (data) => {
  try {
    writeFileSync(
      join(__dirname, "users.json"),
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Erro ao salvar users.json:", error);
  }
};

const verificarCodigo = (codigo, deviceId) => {
  const data = loadUsers();
  const user = data.users[codigo];

  if (!user) {
    return { valido: false, motivo: "Código não encontrado" };
  }

  if (!user.ativo) {
    return { valido: false, motivo: "Código desativado" };
  }

  const agora = new Date();
  const expira = new Date(user.expiraEm);

  if (agora > expira) {
    return { valido: false, motivo: "Código expirado" };
  }

  // Verifica deviceId
  if (user.deviceId === null) {
    // Primeira vez usando - vincula ao dispositivo
    user.deviceId = deviceId;
    data.users[codigo] = user;
    saveUsers(data);
  } else if (user.deviceId !== deviceId) {
    // Tentando usar em outro dispositivo
    return {
      valido: false,
      motivo: "Este código já está em uso em outro dispositivo",
    };
  }

  const diasRestantes = Math.ceil((expira - agora) / (1000 * 60 * 60 * 24));

  return {
    valido: true,
    user: {
      nome: user.nome,
      expiraEm: user.expiraEm,
      diasRestantes,
      totalAnalises: user.totalAnalises,
    },
  };
};

// Rotas

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    version: "1.0.0",
    message: "Backend do App do Mago está funcionando! 🎩✨",
  });
});

// Verificar código de acesso
app.post("/api/verificar-codigo", (req, res) => {
  try {
    const { codigo, deviceId } = req.body;

    if (!codigo) {
      return res.status(400).json({ erro: "Código não fornecido" });
    }

    if (!deviceId) {
      return res.status(400).json({ erro: "Device ID não fornecido" });
    }

    const resultado = verificarCodigo(codigo, deviceId);

    if (!resultado.valido) {
      return res.status(401).json({ erro: resultado.motivo });
    }

    res.json({
      sucesso: true,
      usuario: resultado.user,
    });
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Analisar imagem de roleta
app.post("/api/analisar", async (req, res) => {
  try {
    const { codigo, imagemBase64 } = req.body;

    // Validações
    if (!codigo) {
      return res.status(400).json({ erro: "Código não fornecido" });
    }

    if (!imagemBase64) {
      return res.status(400).json({ erro: "Imagem não fornecida" });
    }

    // Verifica código
    const verificacao = verificarCodigo(codigo);
    if (!verificacao.valido) {
      return res.status(401).json({ erro: verificacao.motivo });
    }

    // Chama OpenAI para analisar a imagem
    const openai = getOpenAI();
    const prompt = `Você é um especialista em analisar painéis de roleta. Analise esta imagem e extraia os números do painel EXATAMENTE da ESQUERDA para DIREITA (ou de CIMA para BAIXO).

⚠️ SUPER IMPORTANTE - ORDEM DOS NÚMEROS:
- Leia os números da ESQUERDA → DIREITA (igual ler um livro)
- Se o painel for vertical, leia de CIMA → BAIXO
- O PRIMEIRO número que você vê (mais à esquerda/topo) = MAIS ANTIGO
- O ÚLTIMO número que você vê (mais à direita/embaixo) = MAIS RECENTE (última entrada)
- Retorne os números NESSA ORDEM EXATA

FORMATO DA RESPOSTA:
- Apenas números separados por vírgula
- Números devem estar entre 0 e 36
- Sem texto adicional

EXEMPLO VISUAL:
Painel mostra: [5] [12] [23] [8] [19] [3] [27]
              ↑                           ↑
           ANTIGO                    MAIS RECENTE

Sua resposta deve ser: 5,12,23,8,19,3,27

Se não conseguir identificar claramente, responda: "ERRO: Não foi possível identificar os números"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imagemBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const numbersText = response.choices[0].message.content.trim();

    if (numbersText.includes("ERRO")) {
      return res.status(400).json({
        erro: "Não foi possível identificar os números da roleta na imagem",
      });
    }

    // Parse dos números
    const numbers = numbersText
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 36);

    if (numbers.length < 4) {
      return res.status(400).json({
        erro: "Poucos números detectados. Tire uma foto mais clara do painel com pelo menos 8 números visíveis",
      });
    }

    // Atualiza contadores do usuário
    const data = loadUsers();
    data.users[codigo].totalAnalises += 1;
    data.users[codigo].ultimaAnalise = new Date().toISOString();
    saveUsers(data);

    // Retorna números detectados
    res.json({
      sucesso: true,
      numeros: numbers,
      totalAnalises: data.users[codigo].totalAnalises,
    });
  } catch (error) {
    console.error("Erro ao analisar imagem:", error);

    if (error.code === "insufficient_quota") {
      return res.status(402).json({
        erro: "Limite de créditos da API excedido. Entre em contato com o suporte.",
      });
    }

    res.status(500).json({
      erro: "Erro ao processar análise. Tente novamente.",
    });
  }
});

// Estatísticas (opcional - para você ver)
app.get("/api/stats", (req, res) => {
  try {
    const data = loadUsers();
    const users = Object.values(data.users);

    const stats = {
      totalUsuarios: users.length,
      usuariosAtivos: users.filter((u) => u.ativo).length,
      totalAnalises: users.reduce((sum, u) => sum + u.totalAnalises, 0),
      analisesPorUsuario: users.map((u) => ({
        nome: u.nome,
        totalAnalises: u.totalAnalises,
        ativo: u.ativo,
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error("Erro ao gerar estatísticas:", error);
    res.status(500).json({ erro: "Erro ao gerar estatísticas" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🎩 Backend do App do Mago rodando na porta ${PORT}`);
  console.log(`✨ Acesse: http://localhost:${PORT}`);
});
