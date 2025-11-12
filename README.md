# App do Mago 🎩✨ - A IA que Trabalha pra Você

## 📱 Sobre o App

**App do Mago** é um aplicativo mobile que usa Inteligência Artificial para analisar mesas de roleta e identificar padrões de sequência automaticamente. Não sabe analisar padrões? Relaxa! O Mago analisa tudo pra você. Envie uma foto e deixe a magia da IA trabalhar.

## ✨ Funcionalidades

### 🎯 Análise Inteligente com IA
- Envie uma foto do painel da roleta da sua galeria
- IA de visão (GPT-4o) detecta automaticamente os números
- Análise matemática de padrões em tempo real
- **Simples, rápido e preciso!**

### 📊 Detecção de Padrões
O app identifica sequências em:
- **Dúzias**: 1ª (1-12), 2ª (13-24), 3ª (25-36)
- **Colunas**: 1ª, 2ª e 3ª coluna

**Nota:** O app analisa TODOS os padrões encontrados na foto (1ª+2ª, 1ª+3ª, 2ª+3ª) e mostra quantas sequências cada um teve, incluindo padrões inativos.

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
- Tema roxo/purple (magia e IA)
- Cards com bordas arredondadas e sombras
- Ícones grandes e informativos
- Animações sutis nos botões

### Copy Persuasivo
- **Onboarding**: "Não sabe analisar padrões? Relaxa! 😌 O Mago analisa tudo pra você."
- **Home**: "✨ A IA que trabalha pra você"
- **Results**: Cards coloridos por confiança (roxo=alavancar, amarelo=bom, vermelho=fraco)
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
│   ├── HomeScreen.tsx          # Tela principal
│   ├── ImagePickerScreen.tsx   # Upload de foto
│   ├── AnalysisScreen.tsx      # Processamento com IA
│   ├── ResultsScreen.tsx       # Resultados da análise
│   └── HistoryScreen.tsx       # Histórico e stats
│
├── navigation/        # Configuração de rotas
│   └── RootNavigator.tsx
│
├── state/            # Gerenciamento de estado
│   └── rouletteStore.ts    # Store Zustand
│
├── utils/            # Utilitários
│   ├── rouletteAnalyzer.ts   # Motor de análise de padrões
│   └── cn.ts                  # Helper TailwindCSS
│
├── types/            # TypeScript types
│   ├── roulette.ts   # Tipos do domínio
│   └── ai.ts         # Tipos de IA
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
  - Purple (roxo): CTA e magia
  - Yellow (amarelo): Padrões bons
  - Red (vermelho): Padrões ruins
- **Tipografia**: System font com pesos bold e semibold
- **Espaçamento**: Generoso (Apple HIG)
- **Bordas**: Arredondadas (rounded-2xl, rounded-3xl)

## 📝 Como Usar

1. **Primeira vez**: Veja o onboarding explicando como a magia da IA funciona
2. **Tela Home**: Veja suas estatísticas e toque em "📸 Enviar Foto da Mesa"
3. **Escolher Foto**: Selecione uma foto da galeria mostrando o painel da roleta
4. **Análise**: Aguarde a magia da IA processar (5-10 segundos)
5. **Resultados**: Veja as oportunidades detectadas com classificação visual
6. **Histórico**: Acesse suas análises anteriores a qualquer momento

### Dicas para Melhores Resultados:
- Tire fotos claras do painel com pelo menos 8-10 números visíveis
- Certifique-se de que os números estão legíveis
- O app lê da ESQUERDA para DIREITA (ou de CIMA para BAIXO em painéis verticais)
- O número mais à direita/embaixo é o MAIS RECENTE

## 🔐 Variáveis de Ambiente

O app requer:
- `EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY`: Chave da OpenAI para análise

## 🚀 Performance

- Análise completa: ~5-10 segundos
- Cache de imagens: FileSystem nativo
- Persistência: AsyncStorage otimizado
- Histórico limitado: Últimas 50 análises

## 🎯 Melhorias Recentes

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

## 🎯 Melhorias Futuras

- [ ] Adicionar animações com Reanimated
- [ ] Modo offline com análise local
- [ ] Compartilhamento de resultados
- [ ] Gráficos de tendências
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
