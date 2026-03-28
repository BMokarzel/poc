import { Injectable, NotFoundException } from '@nestjs/common'

// Conteúdo SCMS hardcoded — simula entrega de estrutura de página pelo CMS para o frontend
const PAGES: Record<string, unknown> = {
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
}

@Injectable()
export class PagesService {
  listPages() {
    return Object.values(PAGES).map((p: any) => ({ slug: p.slug, title: p.title }))
  }

  getPage(slug: string) {
    const page = PAGES[slug]
    if (!page) throw new NotFoundException(`Page '${slug}' not found`)
    return page
  }
}
