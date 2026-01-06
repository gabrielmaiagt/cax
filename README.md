# 📊 Analytics Funnel - Caixa

Sistema completo de funil de vendas com analytics tracking e dashboard administrativo.

## 🚀 Funcionalidades

- **Funil de Conversão Completo**: Login → Simulação (3 etapas) → Loading → Atendimento
- **Tracking Automático**: Rastreamento de página views, cliques, campos e navegação
- **Dashboard Admin**: Visualização em tempo real de métricas e análises
- **Analytics Detalhado**: Taxa de conclusão por etapa e preenchimento de campos

## 📁 Estrutura do Projeto

```
oficial/
├── inicio/          # Página de login (CPF)
├── simula/          # Simulação em 3 etapas
├── atendimento/     # Chat Typebot
├── admin/           # Dashboard de analytics
└── js/
    └── analytics.js # Biblioteca de tracking
```

## 🛠️ Como Usar

1. **Servidor Local**:
   ```bash
   python -m http.server 9002
   ```

2. **Acessar**:
   - Funil: `http://localhost:9002/inicio/`
   - Admin: `http://localhost:9002/admin/`

## 📊 Dashboard Admin

- Métricas em tempo real
- Funil de conversão visual
- Análise detalhada por etapa
- Taxa de preenchimento de campos
- Gráficos e logs de eventos
- Exportação JSON/CSV

## 🎨 Design

- Dark mode premium com glassmorphism
- Tipografia Inter refinada
- Gradientes e animações suaves
- Totalmente responsivo

## 🔐 Privacidade

- Mascaramento automático de PII (CPF, telefone)
- Dados armazenados localmente (localStorage)
- Sem requisições externas para analytics

---

Desenvolvido com ❤️ para análise de funil de conversão
