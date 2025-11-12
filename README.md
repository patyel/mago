# RoletaPro - Assistente Inteligente de Roleta

## 📱 Sobre o App

RoletaPro é um aplicativo mobile que usa Inteligência Artificial para analisar mesas de roleta e identificar padrões de sequência, ajudando você a encontrar as melhores oportunidades de entrada.

## ✨ Funcionalidades

### 🎯 Análise Inteligente com IA
- Tire uma foto do painel da roleta
- IA de visão (GPT-4o) detecta automaticamente os números
- Análise matemática de padrões em tempo real

### 📊 Detecção de Padrões
O app identifica sequências em:
- **Cores**: Vermelho e Preto
- **Dúzias**: 1ª (1-12), 2ª (13-24), 3ª (25-36)
- **Colunas**: 1ª, 2ª e 3ª coluna

### 🎮 Classificação de Oportunidades

**🔴 Ruim** (< 4 sequências)
- Momento fraco para entrar
- Recomendação: Aguarde padrões mais fortes

**🟡 Bom** (4-5 sequências)
- Momento favorável para entrar
- Padrão confiável detectado

**🟢 Alavancar** (6-20 sequências)
- Momento excelente para entrar
- Alta probabilidade de continuidade

### 📈 Estatísticas e Histórico
- Acompanhe todas suas análises
- Veja quantas oportunidades boas e de alavancagem você encontrou
- Taxa de sucesso em tempo real

## 🎯 Estratégia

O RoletaPro opera **a favor da sequência**:

- Quando detectamos 4+ repetições consecutivas em **cores**, **dúzias** ou **colunas**, você recebe uma entrada
- A estratégia se baseia em apostar na continuidade do padrão observado
- Sequências de 6 a 20 são consideradas excelentes oportunidades de alavancagem

### Exemplos:
- Se caiu 4x ou mais na 1ª e 2ª dúzia → Entre na 1ª e 2ª dúzia
- Se caiu 4x ou mais na 1ª e 3ª coluna → Entre na 1ª e 3ª coluna
- Se caiu 4x ou mais vermelho → Entre no vermelho

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
│   ├── CameraScreen.tsx        # Captura de foto
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

1. **Captura**: Usuário tira foto do painel (`CameraScreen`)
2. **Upload**: Imagem é convertida para base64
3. **IA Vision**: GPT-4o detecta os números na imagem
4. **Parse**: Números são convertidos em objetos RouletteResult
5. **Análise**: Motor detecta todos os padrões de sequência
6. **Scoring**: Padrões são classificados (ruim/bom/alavancar)
7. **Apresentação**: Resultados são mostrados com UI gamificada

## 🎨 Design

- **Tema**: Dark mode com gradientes (slate-950 → slate-800)
- **Cores principais**:
  - Emerald (verde): CTA e sucesso
  - Yellow (amarelo): Padrões bons
  - Red (vermelho): Padrões ruins
- **Tipografia**: System font com pesos bold e semibold
- **Espaçamento**: Generoso (Apple HIG)
- **Bordas**: Arredondadas (rounded-2xl, rounded-3xl)

## 📝 Como Usar

1. **Primeira vez**: Veja o onboarding explicando a estratégia
2. **Tela Home**: Veja suas estatísticas e toque em "Analisar Mesa"
3. **Câmera**: Fotografe o painel da roleta com os últimos resultados
4. **Análise**: Aguarde a IA processar (5-10 segundos)
5. **Resultados**: Veja as oportunidades detectadas e onde apostar
6. **Histórico**: Acesse suas análises anteriores a qualquer momento

## 🔐 Variáveis de Ambiente

O app requer:
- `EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY`: Chave da OpenAI para análise

## 🚀 Performance

- Análise completa: ~5-10 segundos
- Cache de imagens: FileSystem nativo
- Persistência: AsyncStorage otimizado
- Histórico limitado: Últimas 50 análises

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

Desenvolvido com ❤️ usando Vibecode AI App Builder
