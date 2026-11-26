# HOMEMADE · Design

Direção: confeitaria de casa com abertura escura e cheia de foto. A estrutura da abertura e a faixa animada seguem a referência que a TUCA escolheu (site da Oliveira Barbearia); cores, tipografia e conteúdo são da HOMEMADE.

## Cor

| Token | Valor | Papel |
| --- | --- | --- |
| `--cacau` | `#1E120C` | Fundo da abertura, do fechamento e do rodapé |
| `--creme` | `#FFF6EA` | Texto sobre o escuro, botão principal no escuro, cartões |
| `--massa` | `#F4ECE1` | Fundo das seções claras |
| `--borda` | `#E2D3C1` | Linhas e bordas no claro |
| `--texto` | `#2B1A12` | Texto principal no claro |
| `--texto-2` | `#5C4031` | Texto secundário no claro (7,6:1 sobre `--massa`) |
| `--marca` | `#BC6C50` | Terracota do logo; selos, ícones, detalhes |
| `--marca-escura` | `#8F4A32` | Botões e links no claro (texto creme 6,1:1) |
| `--marca-clara` | `#E9A385` | Itálicos e destaques sobre o escuro |

O site é claro com abertura escura e não tem modo escuro próprio.

## Tipografia

- **Instrument Serif** (400 e itálico): títulos e nomes de produtos.
- **Figtree** (400, 500, 600, 800): textos, preços, botões; faixa animada em caixa alta 800.
- Escala: 12 · 14 · 16 (corpo) · 18 · 22 · 28 · 40 · clamp(44–88) no título da abertura.

## Espaço e forma

- Base 8 px. Seções: `clamp(64px, 10vw, 120px)` na vertical. Conteúdo até 1180 px, margem lateral 20 px no celular.
- Raios: 12 (cartões pequenos), 20 (cartões), 999 (botões em pílula).
- Sombra única e suave em cartões elevados; nada de gradiente decorativo.

## Componentes

- **Botões**: pílula, altura mínima 52 px (polegar). Primário no escuro: creme com texto cacau. Primário no claro: `--marca-escura` com texto creme. Secundário: contorno. Foco visível com anel de 3 px.
- **Barra fixa no celular**: "Fazer pedido" (Instadelivery) + WhatsApp, sempre ao alcance do polegar.
- **Cartão de produto**: foto 4:5, nome em serifada, descrição curta, preço em Figtree 600.
- **Cardápio completo**: categorias em `<details>` para não alongar a página no celular.

## Imagens e ícones

- Fotos reais da HOMEMADE (pasta do Drive). Enquanto não chegam, espaços reservados com o nome do produto.
- Ícones em traço fino (estilo Lucide), nunca emoji.

## Canais de pedido

1. Instadelivery (principal, sem taxa do iFood)
2. WhatsApp (encomendas e dúvidas)
3. iFood (discreto, no rodapé)
