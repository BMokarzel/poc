import { Test, TestingModule } from '@nestjs/testing'
import { ProductsService } from './products.service'
import { CoreHttpClient } from '../common/http/core-http.client'

describe('ProductsService', () => {
  let service: ProductsService

  const mockCoreClient = { get: jest.fn() }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: CoreHttpClient, useValue: mockCoreClient },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
  })

  afterEach(() => jest.clearAllMocks())

  it('returns a paginated slice from Core response', async () => {
    const allProducts = Array.from({ length: 25 }, (_, i) => ({ id: `p${i}`, name: `Product ${i}` }))
    mockCoreClient.get.mockResolvedValue(allProducts)

    const result = await service.findAll({ page: 2, limit: 10 })

    expect(result).toHaveLength(10)
    expect(result[0]).toEqual(allProducts[10])
  })

  it('returns first page by default', async () => {
    const allProducts = Array.from({ length: 5 }, (_, i) => ({ id: `p${i}` }))
    mockCoreClient.get.mockResolvedValue(allProducts)

    const result = await service.findAll({})

    expect(result).toHaveLength(5)
  })
})
