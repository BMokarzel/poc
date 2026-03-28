import { PagesService } from './pages.service';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    listPages(): {
        slug: any;
        title: any;
    }[];
    getPage(slug: string): unknown;
}
