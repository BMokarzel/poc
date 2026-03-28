import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { ProductsService } from './products.service'
import { Product } from './product.schema'

const mockProductModel = {
  find: jest.fn(),
  findById: jest.fn(),
}

describe('ProductsService', () => {
  let service: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getModelToken(Product.name), useValue: mockProductModel },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
  })

  afterEach(() => jest.clearAllMocks())

  it('returns active products', async () => {
    const fakeProducts = [
      { toObject: () => ({ name: 'Notebook', price: 3000, active: true }) },
    ]
    mockProductModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(fakeProducts) })

    const result = await service.findAll()

    expect(mockProductModel.find).toHaveBeenCalledWith({ active: true })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Notebook')
  })
})
