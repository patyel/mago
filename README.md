# App do Mago 🎩✨ - A IA que Trabalha pra Você

## 📱 Sobre o App

**App do Mago** é um aplicativo mobile que usa Inteligência Artificial para analisar mesas de roleta e identificar padrões de sequência automaticamente. Não sabe analisar padrões? Relaxa! O Mago analisa tudo pra você. Envie uma foto e deixe a magia da IA trabalhar.

## 💰 Sistema de Monetização

Este app agora possui um **sistema completo de backend com códigos de acesso** para você monetizar vendendo assinaturas mensais (ex: R$30/mês).

**Benefícios:**
- ✅ Suas chaves da OpenAI ficam protegidas no backend
- ✅ Você controla quem tem acesso através de códigos únicos
- ✅ Hospedagem gratuita no Railway (até 50k requisições/mês)
- ✅ Gerenciamento simples através de arquivo JSON
- ✅ Rastreamento de uso por usuário

📚 **Veja o guia completo**: [README_BACKEND.md](./README_BACKEND.md)

## ✨ Funcionalidades

### 🎯 Análise Inteligente com IA
- **Tire foto agora** ou **envie da galeria**
- IA de visão (GPT-4o) detecta automaticamente os números
- Análise matemática de padrões em tempo real
- **Simples, rápido e preciso!**

### 🎮 Sistema de Gamificação
- **Níveis e XP**: Ganhe experiência a cada análise e resultado registrado
- **7 Conquistas**: Desbloqueie achievements por marcos importantes
- **Badges**: Aprendiz do Mago, Mago Experiente, Mestre dos Padrões, Mago Supremo e mais
- **Sequência de Uso**: Mantenha uma streak de dias consecutivos

### 📊 Estatísticas Avançadas
- **Taxa de Acerto (Win Rate)**: Porcentagem de acerto das suas entradas
- **Melhor Horário**: Descubra em qual live você mais lucra
- **Performance Semanal**: Acompanhe dias lucrativos e lucro total
- **Histórico Completo**: Todas as análises com fotos salvas
- **Análise de Padrões**: Entenda quais estratégias funcionam melhor

### 🔔 Sistema de Alertas e Notificações
- **Lembretes de Live**: Notificação nos horários das lives (11h, 15h, 19h)
- **Alerta de Banca**: Aviso quando banca cair X% (configurável)
- **Stop Loss**: Limite de perda diária com bloqueio automático
- **Meta Diária**: Notificação quando atingir sua meta

### 📊 Detecção de Padrões
O app identifica sequências em:
- **Dúzias**: 1ª (1-12), 2ª (13-24), 3ª (25-36)
- **Colunas**: 1ª, 2ª e 3ª coluna

**Nota:** O app analisa TODOS os padrões encontrados na foto (1ª+2ª, 1ª+3ª, 2ª+3ª) e mostra quantas sequências cada um teve, incluindo padrões inativos.

### 💰 Gerenciamento de Banca
- **Configure sua banca inicial**: Defina o valor da sua banca
- **Registro diário**: Adicione lucros ou perdas do dia
- **4 opções de registro**: Lives (11h, 15h, 19h) ou Sozinho (fora das lives)
- **Gráfico de evolução**: Visualize os últimos 7 dias
- **Histórico completo**: Acompanhe os últimos 30 dias
- **Estatísticas em tempo real**: Veja lucro total e variação percentual

### 🧮 Calculadora de Lucro
- **Meta diária**: Defina quanto quer lucrar por dia
- **Gestão de apostas**: Calcula valores para progressão Martingale
- **Planejamento financeiro**: Veja quantas operações pode fazer com sua banca
- **Dicas de gestão**: Recomendações de gerenciamento de risco

### 🎮 Sistema de Classificação

**🔴 Momento Fraco** (< 4 sequências)
- Aguarde! O Mago te avisará quando o padrão melhorar
- Recomendação: Não entre ainda

**🟡 Bom Momento** (4-5 sequências)
- Padrão confiável! Hora de entrar com segurança
- Momento favorável para entrar

**🟢 Alavancar!** (6-20 sequências)
- MOMENTO PERFEITO! Sequência forte para alavancagem
- Alta probabilidade de continuidade

### 📈 Estatísticas e Histórico
- Acompanhe todas suas análises
- Veja quantas oportunidades boas e de alavancagem você encontrou
- Taxa de sucesso em tempo real

## 🎯 Estratégia

O App do Mago opera **a favor da sequência**:

- Quando detectamos 4+ repetições consecutivas em **dúzias** ou **colunas**, você recebe uma entrada
- A estratégia se baseia em apostar na continuidade do padrão observado nos **últimos 4 resultados**
- Sequências de 6 a 20 são consideradas excelentes oportunidades de alavancagem
- Se o padrão quebrar (GAIL), o app avisa para aguardar

### Exemplos:
- Se os últimos 4 caíram na 1ª e 2ª dúzia → Entre na 1ª e 2ª dúzia
- Se os últimos 4 caíram na 1ª e 3ª coluna → Entre na 1ª e 3ª coluna
- Se o padrão quebrou → Aguarde novo padrão se formar

## 🎨 Design e UX

### Design Gamificado
- Interface dark mode com gradientes visuais impressionantes
- **Tema Roxo/Purple**: Magia, IA e elementos premium
- Cards com bordas arredondadas e sombras
- Ícones grandes e informativos
- Animações sutis nos botões

### Copy Persuasivo
- **Onboarding**: "Não sabe analisar padrões? Relaxa! 😌 O Mago analisa tudo pra você."
- **Home**: "✨ A Magia da IA nas Suas Mãos"
- **Results**: Cards coloridos por confiança (roxo=alavancar, amarelo=bom, vermelho=fraco)
- **Ativação**: Botão verde "Comprar Acesso" para facilitar conversão
- Linguagem acessível e motivadora

### Tipografia e Espaçamento
- Fontes: System font com pesos black (900), bold (700), semibold (600)
- Espaçamento generoso seguindo Apple HIG
- Hierarquia visual clara com tamanhos de texto 4xl, 3xl, 2xl, xl
- Emojis estratégicos para engajamento

## 🏗️ Arquitetura Técnica

### Stack
- **Framework**: Expo SDK 53
- **React Native**: 0.76.7
- **Navegação**: React Navigation 7 (Native Stack)
- **Estado**: Zustand + AsyncStorage
- **Estilo**: NativeWind (TailwindCSS)
- **IA**: OpenAI GPT-4o (Vision + Text)
- **Câmera**: Expo Camera

### Estrutura de Pastas

```
src/
├── screens/           # Telas do app
│   ├── OnboardingScreen.tsx    # Introdução e tutorial
│   ├── ActivationScreen.tsx    # Ativação de código de acesso
│   ├── HomeScreen.tsx          # Tela principal (Análise)
│   ├── BankrollScreen.tsx      # Gerenciamento de banca
│   ├── CalculatorScreen.tsx    # Calculadora de lucro
│   ├── ImagePickerScreen.tsx   # Upload de foto
│   ├── AnalysisScreen.tsx      # Processamento com IA
│   ├── ResultsScreen.tsx       # Resultados da análise
│   └── HistoryScreen.tsx       # Histórico e stats
│
├── navigation/        # Configuração de rotas
│   ├── RootNavigator.tsx       # Stack principal
│   └── MainTabs.tsx            # Navegação em abas
│
├── state/            # Gerenciamento de estado
│   ├── rouletteStore.ts        # Store de análises
│   ├── accessCodeStore.ts      # Store de autenticação
│   └── bankrollStore.ts        # Store de banca
│
├── utils/            # Utilitários
│   ├── rouletteAnalyzer.ts   # Motor de análise de padrões
│   └── cn.ts                  # Helper TailwindCSS
│
├── types/            # TypeScript types
│   ├── roulette.ts   # Tipos do domínio
│   └── ai.ts         # Tipos de IA
│
├── services/         # Serviços externos
│   └── backend.ts    # Cliente do backend
│
└── api/              # Integrações
    ├── chat-service.ts       # Cliente OpenAI
    ├── openai.ts             # Config OpenAI
    └── grok.ts               # Config Grok
```

## 🔧 Funcionalidades Técnicas

### Motor de Análise (`rouletteAnalyzer.ts`)

**Funções principais:**
- `parseRouletteNumber()`: Converte número em cor, dúzia e coluna
- `detectColorSequences()`: Detecta sequências de cores
- `detectDozenSequences()`: Detecta sequências em dúzias (1+2, 1+3, 2+3)
- `detectColumnSequences()`: Detecta sequências em colunas (1+2, 1+3, 2+3)
- `generateOpportunities()`: Converte padrões em oportunidades de aposta
- `analyzeRouletteResults()`: Análise completa dos números

### Store Zustand

**Estado persistido:**
- `analysisHistory`: Últimas 50 análises
- `userStats`: Estatísticas do usuário
- `hasCompletedOnboarding`: Flag de onboarding

**Estado de sessão:**
- `currentAnalysis`: Análise atual
- `isAnalyzing`: Flag de loading

### Fluxo de Análise

1. **Upload**: Usuário escolhe foto do painel da galeria (`ImagePickerScreen`)
2. **Conversão**: Imagem é convertida para base64
3. **IA Vision**: GPT-4o detecta os números na imagem
4. **Parse**: Números são convertidos em objetos RouletteResult
5. **Análise**: Motor detecta todos os padrões de sequência
6. **Scoring**: Padrões são classificados (ruim/bom/alavancar)
7. **Apresentação**: Resultados são mostrados com UI gamificada

## 🎨 Design

- **Tema**: Dark mode com gradientes (slate-950 → slate-800)
- **Cores principais**:
  - **Roxo/Purple**: CTA principal e elementos de destaque
  - **Amarelo**: Padrões bons
  - **Vermelho**: Padrões ruins/fracos
  - **Verde**: Botões de compra e sucesso
- **Tipografia**: System font com pesos bold e semibold
- **Espaçamento**: Generoso (Apple HIG)
- **Bordas**: Arredondadas (rounded-2xl, rounded-3xl)

## 📝 Como Usar

### 🔐 Primeiro Acesso
1. **Insira seu código de acesso**: Use um dos códigos CLIENTE001-100
2. **Ativação automática**: O código será vinculado ao seu dispositivo
3. **Acesso liberado**: Você tem 30 dias de acesso a partir do primeiro uso

### 📱 Navegação Principal (3 Abas)

#### 📸 Aba Análise
1. **Veja suas estatísticas**: Acompanhe seu histórico de análises
2. **Envie foto da mesa**: Tire uma foto ou escolha da galeria
3. **Análise IA**: Aguarde 5-10 segundos para processar
4. **Veja resultados**: Oportunidades classificadas por confiança

#### 💰 Aba Banca
1. **Configure banca inicial**: Informe o valor da sua banca
2. **Adicione resultados diários**: Registre lucros (+) ou perdas (-)
   - **Lives**: 11h, 15h ou 19h (se jogou nas lives)
   - **Sozinho**: Se jogou fora das lives por conta própria
3. **Visualize evolução**: Gráfico dos últimos 7 dias
4. **Acompanhe histórico**: Veja os últimos 30 dias de resultados

#### 🧮 Aba Calculadora
1. **Defina meta diária**: Quanto quer lucrar por dia (ex: R$100)
2. **Informe sua banca**: Valor disponível para operar
3. **Calcule gestão**: Veja valores de 1ª e 2ª aposta (Martingale)
4. **Planeje operações**: Quantas operações pode fazer com sua banca

### Dicas para Melhores Resultados:
- Tire fotos claras do painel com pelo menos 8-10 números visíveis
- Certifique-se de que os números estão legíveis
- O app lê da ESQUERDA para DIREITA (ou de CIMA para BAIXO em painéis verticais)
- O número mais à direita/embaixo é o MAIS RECENTE
- Use a calculadora para planejar suas apostas ANTES de entrar
- Registre TODOS os resultados na aba Banca para ter estatísticas precisas

## 🔐 Variáveis de Ambiente

O app requer:
- `EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY`: Chave da OpenAI para análise

## 🚀 Performance

- Análise completa: ~5-10 segundos
- Cache de imagens: FileSystem nativo
- Persistência: AsyncStorage otimizado
- Histórico limitado: Últimas 50 análises

## 🎯 Melhorias Recentes

### ✅ SISTEMA COMPLETO INTEGRADO (v5.0 FINAL)

**🎮 Gamificação 100% Funcional:**
- ✅ Níveis e XP ganhos automaticamente em cada análise
- ✅ Conquistas desbloqueadas automaticamente
- ✅ Sistema de streak atualizado diariamente
- ✅ Botão "Ver Mais" na tela principal para acessar stats

**📊 Estatísticas em Tempo Real:**
- ✅ Taxa de acerto calculada automaticamente
- ✅ Melhor horário identificado com base em lucros
- ✅ Performance semanal atualizada
- ✅ Histórico de análises com fotos salvas

**🔔 Alertas Ativos:**
- ✅ Notificações de live (11h, 15h, 19h) agendadas automaticamente
- ✅ Alerta de banca quando cair 20%
- ✅ Stop loss checado a cada resultado adicionado
- ✅ Permissões pedidas ao iniciar o app

**🎯 Integrações Completas:**
- ✅ Análises adicionam XP automaticamente (10 XP por análise)
- ✅ Resultados na banca checam alertas e stop loss
- ✅ Sistema inicia e configura notificações ao abrir app
- ✅ Tudo persistido e sincronizado entre sessões

### 🎮 Sistema de Gamificação e Stats Avançadas (v5.0)
- **Níveis e XP**: Sistema de progressão com níveis e experiência
- **Conquistas**: 7 conquistas desbloqueáveis (Primeira Análise, 10 análises, 50 análises, 100 análises, 7 dias seguidos, Semana lucrativa, 70% win rate)
- **Taxa de Acerto**: Acompanhe seu win rate em tempo real
- **Melhor Horário**: Descubra qual live você mais lucra (11h, 15h, 19h ou Sozinho)
- **Performance Semanal**: Veja dias lucrativos e lucro dos últimos 7 dias
- **Sequência de Uso**: Contador de dias consecutivos usando o app
- **Alertas de Banca**: Notificação quando banca cair X%
- **Stop Loss**: Configure limite de perda diária
- **Lembretes de Live**: Notificações para registrar resultados
- **Tela de Estatísticas**: Nova tela completa com todos os dados
- **Tela de Conquistas**: Visualize e desbloqueie achievements

### 💰 Melhorias na Banca (v4.3)
- **Opção "Sozinho"**: Agora você pode registrar lucros/perdas quando joga sozinho fora das lives (11h, 15h, 19h)
- **Cores diferenciadas**: Cada opção tem sua cor (Azul=11h, Roxo=15h, Amarelo=19h, Cinza=Sozinho)

### 🔧 Melhorias de UX (v4.2)
- **Botão de Sair**: Adicionado botão vermelho "Sair" no header da tela principal para deslogar e voltar para tela de código
- **Nomes de estratégias atualizados**: "Implacável" → "Mago Supremo" e "Visionário" → "Feiticeiro da Roleta"
- **Navegação inteligente**: Ao clicar em "Começar a Magia" no onboarding, usuários já ativados vão direto para o app (não precisam inserir código novamente)
- **Botão de compra**: Adicionado botão verde "Comprar Acesso" na tela de ativação que leva direto ao link de pagamento
- **Email atualizado**: Email de contato atualizado para hallefpatyel1@hotmail.com

### ✨ Navegação em Abas (v3.0)
- **3 Abas principais**: Análise, Banca e Calculadora
- **Persistência de login**: Não precisa mais inserir código toda vez
- **Bottom Tab Navigator**: Navegação intuitiva e rápida entre funcionalidades

### 💰 Gerenciamento de Banca (v3.0)
- **Configuração inicial**: Define banca de entrada
- **Registro diário**: Adiciona lucros e perdas do dia
- **Gráfico visual**: Barras dos últimos 7 dias
- **Histórico completo**: 30 dias de resultados
- **Estatísticas**: Lucro total, variação % e banca atual

### 🧮 Calculadora de Lucro (v3.0)
- **Meta diária**: Calcula valores necessários para atingir meta
- **Progressão Martingale**: 1ª e 2ª aposta calculadas automaticamente
- **Gestão de risco**: Mostra % da banca e operações possíveis
- **Dicas integradas**: Recomendações de gestão de banca

### ✨ Design Gamificado (v2.0)
- **OnboardingScreen**: Header maior com gradiente, copy persuasivo, cards gamificados
- **HomeScreen**: Estatísticas com ícones, botão principal com borda gradiente, steps numerados
- **ResultsScreen**: Cards de oportunidade coloridos por confiança, ícones grandes, badges visuais
- **Copy**: Linguagem mais acessível e motivadora em todas as telas

### 🐛 Correções de Bugs Críticos
- **Ordem de leitura**: Números agora são lidos corretamente (esquerda→direita)
- **Análise de padrões**: Verifica apenas os últimos 4 resultados para entradas ativas
- **Detecção completa**: Mostra TODOS os padrões encontrados (ativos e inativos)
- **Remoção de cores**: App agora analisa apenas dúzias e colunas (sem cores)
- **Device locking**: 1 código por dispositivo para evitar compartilhamento

## 🎯 Melhorias Futuras

- [ ] Adicionar animações com Reanimated
- [ ] Exportar relatórios de banca (PDF/CSV)
- [ ] Notificações de metas atingidas
- [ ] Gráficos de tendências avançados
- [ ] Modo offline com análise local
- [ ] Compartilhamento de resultados
- [ ] Alertas de padrões em tempo real
- [ ] Suporte a diferentes tipos de roleta (europeia, americana)
- [ ] Tutorial interativo in-app

## 📱 Compatibilidade

- **iOS**: 15.0+
- **Android**: API 21+ (Android 5.0+)
- **Expo**: SDK 53
- **React Native**: 0.76.7

---

✨ Desenvolvido com magia usando Vibecode AI App Builder
