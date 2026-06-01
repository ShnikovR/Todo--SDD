# Uso da Inteligência Artificial no Projeto To-Do SDD

---

## Ferramenta utilizada

| Ferramenta | Uso no projeto |
|------------|----------------|
| **Cursor Agent** (IA integrada ao IDE) | Especificação, código TypeScript, testes, documentação |
| **Modelo de linguagem** (Claude/GPT via Cursor) | Geração e refatoração assistida |

> Equivalente acadêmico a categorias **Copilot** / **ChatGPT** para desenvolvimento assistido.

---

## Prompts utilizados

### Prompt 1 — Etapa 1 / Especificação v1

```
Desenvolvimento de Aplicação To-Do - Etapa 1 (Spec Driven Development)
… elaborar especificação … implementar … testes … justificativa SDD
```

**Resultado:** Spec v1, arquitetura em camadas, protótipo Python/Flask, testes pytest.

### Prompt 2 — Etapa 2 / Especificação v2

```
Desenvolvimento de Projeto To-Do - Etapa 2 (SDD, OpenSpec)
… RF04–RF08 … Vitest … Cypress … relatório IA …
```

**Resultado:** Spec OpenSpec completa, migração TypeScript, persistência JSON, 18 testes unitários, 6 E2E.

### Prompt 3 — Estrutura GitHub

```
Estrutura de Entrega no GitHub — todo-sdd/
… especificacao-v1.md, especificacao-v2.md … vitest.config.js … README
```

**Resultado:** Reorganização de pastas, documentação padronizada, configs `.js` na raiz.

### Prompts auxiliares (típicos durante o desenvolvimento)

- "Implemente RF07 filtro conforme RN08 da spec"
- "Gere critérios de aceite Dado/Quando/Então para RF04"
- "Configure Vitest com cobertura mínima 80%"
- "Crie testes Cypress com data-testid para os 6 cenários"

---

## Resultados obtidos

| Área | Resultado |
|------|-----------|
| Documentação | 5 arquivos Markdown estruturados em `docs/` |
| Código | ~15 módulos TypeScript em camadas |
| Testes unitários | 18 testes, ~88% cobertura |
| Testes E2E | 6 cenários Cypress passando |
| Tempo | Redução significativa de boilerplate e documentação |

---

## Como a IA auxiliou no desenvolvimento

1. **Especificação:** estruturação de RF, RN, critérios de aceite e cenários normais/erro.
2. **Arquitetura:** diagramas e definição de camadas alinhadas à spec.
3. **Implementação:** geração de entidades, serviços, repositório JSON e rotas REST.
4. **Frontend:** HTML/CSS/JS com `data-testid` para E2E.
5. **Testes:** casos Vitest e Cypress derivados dos critérios de aceite.
6. **README e entrega GitHub:** padronização para repositório público.

---

## Relação entre IA e Spec Driven Development (SDD)

| Princípio SDD | Papel da IA |
|---------------|-------------|
| **Spec como fonte da verdade** | IA implementa o que está documentado; humano/enunciado define o escopo |
| **Spec antes do código** | Prompts pedem spec primeiro; código gerado em seguida |
| **Rastreabilidade** | IA referencia RF/RN nos comentários e nomes de teste |
| **Validação pela spec** | Testes mapeados a CA (v2) e CT (v1) |
| **Evolução controlada** | Prompt Etapa 2 explicita delta v1→v2 sem inventar requisitos |

### Fluxo SDD + IA

```
Enunciado acadêmico
       ↓
  Especificação (humano + IA)
       ↓
  Revisão / aprovação da spec
       ↓
  IA gera código e testes rastreáveis
       ↓
  Humano executa testes e valida aderência
```

### Limitações

- IA pode sugerir escopo extra → mitigado revisando contra o enunciado.
- Cobertura e E2E exigem execução local para confirmar.
- Prompts exatos dependem do histórico no Cursor; este documento usa representação fiel aos pedidos do projeto.

### Boas práticas adotadas

1. Anexar ou citar arquivos de spec nos prompts.
2. Pedir implementação "somente RFxx da spec".
3. Rodar `npm run test` e `npm run test:e2e` antes de entregar.
4. Manter `docs/` atualizado quando a spec mudar.

---

## Conclusão

A IA foi **acelerador de produtividade**, não substituto da engenharia de requisitos. O SDD garante que cada linha de código e cada teste possam ser justificados por um item da especificação — com ou sem assistência de IA.
