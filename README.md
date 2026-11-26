# HOMEMADE Confeitaria · landing page

One-page estática (HTML + CSS, sem framework) para a HOMEMADE, em Arapiraca–AL.

- `index.html`: versão com a seção Natal 2026
- `sem-natal.html`: mesma página sem os produtos de Natal
- `DESIGN.md`: cores, tipografia e componentes

As páginas são geradas a partir de `build/index.template.html` e do cardápio em `build/produtos.py`:

```
python3 build/build.py
```

Textos entre colchetes, como `[DEPOIMENTO REAL DE CLIENTE 1]`, são espaços reservados para dados reais que ainda faltam.
