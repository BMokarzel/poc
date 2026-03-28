"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const PAGES = {
    home: {
        slug: 'home',
        title: 'Início',
        sections: [
            {
                type: 'hero',
                data: {
                    title: 'As melhores ofertas estão aqui',
                    subtitle: 'Compre com segurança e rapidez',
                    cta: { label: 'Ver produtos', href: '/products' },
                    image: '/assets/hero-banner.jpg',
                },
            },
            {
                type: 'featured-categories',
                data: {
                    title: 'Categorias em destaque',
                    items: [
                        { id: 'electronics', label: 'Eletrônicos', icon: 'laptop' },
                        { id: 'fashion', label: 'Moda', icon: 'shirt' },
                        { id: 'home-garden', label: 'Casa e Jardim', icon: 'home' },
                    ],
                },
            },
            {
                type: 'promo-banner',
                data: {
                    title: 'Frete grátis acima de R$ 150',
                    backgroundColor: '#FA5A50',
                    textColor: '#FFFFFF',
                },
            },
        ],
    },
    'product-listing': {
        slug: 'product-listing',
        title: 'Produtos',
        sections: [
            {
                type: 'filters',
                data: {
                    categories: ['Eletrônicos', 'Moda', 'Casa e Jardim'],
                    sortOptions: ['Relevância', 'Menor preço', 'Maior preço', 'Mais vendidos'],
                },
            },
            {
                type: 'grid-config',
                data: { defaultView: 'grid', itemsPerPage: 24 },
            },
        ],
    },
    checkout: {
        slug: 'checkout',
        title: 'Checkout',
        sections: [
            {
                type: 'steps',
                data: {
                    steps: ['Carrinho', 'Endereço', 'Pagamento', 'Confirmação'],
                },
            },
            {
                type: 'payment-methods',
                data: {
                    methods: ['credit-card', 'pix', 'boleto'],
                },
            },
        ],
    },
};
let PagesService = class PagesService {
    listPages() {
        return Object.values(PAGES).map((p) => ({ slug: p.slug, title: p.title }));
    }
    getPage(slug) {
        const page = PAGES[slug];
        if (!page)
            throw new common_1.NotFoundException(`Page '${slug}' not found`);
        return page;
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)()
], PagesService);
//# sourceMappingURL=pages.service.js.map