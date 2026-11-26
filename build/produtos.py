# Cardápio real da HOMEMADE, copiado do Instadelivery em 26/11/2026
# (/mnt/project-files/cardapio/cardapio-instadelivery.md). Não inventar preços nem sabores.
# "foto": caminho em assets/img/produtos/ quando a foto real chegar; None = espaço reservado.

CATEGORIAS = [
    {
        "id": "cookies",
        "nome": "Cookies",
        "intro": "Cookies de 120 g, recheados.",
        "itens": [
            ("Nutella", "20,00", "Massa tradicional com gotas de chocolate nobre, recheado de Nutella."),
            ("Pistache", "22,00", "Massa tradicional com grãos de pistache e chocolate branco nobre, recheado de creme de pistache."),
            ("Kinder Bueno", "22,00", "Massa tradicional com mix de chocolates nobres, branco e ao leite, recheado com creme de Kinder."),
            ("Brownie com ovomaltine", "22,00", "Massa de chocolate com gotas de chocolate e pedaços de brownie, recheado de mais brownie e creme de ovomaltine."),
            ("Banoffee", "20,00", "Massa tradicional com canela e chocolate branco nobre, recheio de doce de leite com banana."),
            ("Cocada", "20,00", "Massa tradicional com coco e gotas de chocolate branco nobre, recheado de cocada."),
            ("Farinha láctea", "22,00", "Massa tradicional com muita farinha láctea e gotas de chocolate branco, recheado de brigadeiro branco."),
            ("Fubá com goiabada", "20,00", "Cookie de fubá com chocolate branco e goiabada, recheado de brigadeiro de parmesão."),
            ("Birthday cookie", "20,00", "O recheio é surpresa."),
        ],
    },
    {
        "id": "brownies",
        "nome": "Brownies",
        "intro": "Densos, com casquinha.",
        "itens": [
            ("Brownie de brigadeiro", "10,00", "Denso, com casquinha, gotas de chocolate e recheado de brigadeiro."),
            ("Brownie de ninho com Nutella", "12,00", "Brownie recheado com Ninho e Nutella."),
            ("Brownie de brigadeiro e caramelo salgado", "12,00", ""),
            ("Brownie Snickers", "15,00", "Camada generosa de caramelo salgado, amendoim caramelizado e cobertura de chocolate crocante."),
        ],
    },
    {
        "id": "croissants",
        "nome": "Croissants e crookie",
        "intro": "Amanteigados e crocantes.",
        "itens": [
            ("Croissant queijudo", "22,00", "Amanteigado e crocante, recheado com muito queijo."),
            ("Crookie", "38,00", "Croissant tradicional coberto com cookie, finalizado com Nutella e leite em pó."),
            ("Combo croissant + brownie", "35,00", "Croissant de queijo + brownie de brigadeiro."),
        ],
    },
    {
        "id": "palha",
        "nome": "Palha italiana",
        "intro": "",
        "itens": [
            ("Palha italiana", "16,00", "Brigadeiro branco cremoso com Ninho, pedacinhos de bolacha e recheio de Nutella, envolvido em leite em pó."),
        ],
    },
    {
        "id": "combos",
        "nome": "Combos",
        "intro": "Escolha os sabores dos cookies. Pistache, Kinder Bueno, Brownie com ovomaltine e Farinha láctea têm acréscimo de R$ 1,00 cada.",
        "itens": [
            ("Dupla de cookies", "35,00", "Dois cookies à sua escolha."),
            ("Combo família", "75,00", "Cinco cookies à sua escolha, para dividir com a galera."),
        ],
    },
    {
        "id": "presente",
        "nome": "Para presentear",
        "intro": "",
        "itens": [
            ("Sacola Home", "3,00", "Sacola para presente."),
        ],
    },
]

NATAL = {
    "id": "natal",
    "nome": "Natal 2026",
    "intro": "Edição de temporada.",
    "itens": [
        ("Panetone cookie de ninho com Nutella", "120,00", "Recheado com brigadeiro branco cremoso, pedaços de cookie e uma generosa camada de Nutella. Em média 850 g."),
        ("Panetone brownie com caramelo", "100,00", "Massa macia e intensa, recheada com caramelo salgado e brigadeiro cremoso. Em média 850 g."),
        ("Panetone com gotas de chocolate", "55,00", "Massa artesanal, macia e aromática, com aromas naturais e generosas gotas de chocolate."),
        ("Mini panetone", "50,00", "Recheado com brigadeiro branco cremoso, pedaços de cookie e uma generosa camada de Nutella."),
        ("Mini panetone brownie com caramelo", "45,00", "Massa macia e intensa, recheada com caramelo salgado, brownie e brigadeiro cremoso."),
        ("Biscoitinhos", "22,00", "8 biscoitinhos caseiros que derretem na boca, recheados com doce de leite."),
        ("Pão de mel", "20,00", "Massa caseira fofinha com especiarias, recheada com doce de leite e casquinha de chocolate."),
    ],
}

# Linha de produtos informada pela TUCA que não está no Instadelivery: sob encomenda, sem preço.
ENCOMENDA = [
    ("Bentô cake", "[DESCRIÇÃO A CONFIRMAR: tamanhos, sabores e preço]"),
    ("Bolos de festa", "[DESCRIÇÃO A CONFIRMAR: tamanhos, sabores e preço]"),
    ("Cestas", "[DESCRIÇÃO A CONFIRMAR: o que vem na cesta e preço]"),
]

# Destaques da vitrine (nomes precisam existir nas categorias acima).
DESTAQUES = ["Palha italiana", "Nutella", "Crookie", "Brownie Snickers", "Pistache", "Croissant queijudo"]
DESTAQUES_NATAL = ["Panetone cookie de ninho com Nutella", "Panetone brownie com caramelo"]
