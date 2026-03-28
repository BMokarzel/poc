import { Controller, Get, Param } from '@nestjs/common'
import { PagesService } from './pages.service'

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  listPages() {
    return this.pagesService.listPages()
  }

  @Get(':slug')
  getPage(@Param('slug') slug: string) {
    return this.pagesService.getPage(slug)
  }
}
