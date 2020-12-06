import { Component, OnInit } from '@angular/core';
import { ProductService, GlobalService, CategoryService } from '@services';
import { CategoryVM, ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.page.html',
  styleUrls: ['./product-main.page.scss']
})
export class ProductMainPage implements OnInit {
  products: ProductVM[] = [];
  filterProducts: ProductVM[] = [];
  categories: (CategoryVM & { choosen?: boolean })[] = [];
  search = '';
  stage = 'done';
  showSearch = false;
  constructor(
    protected readonly productService: ProductService,
    protected readonly categoryService: CategoryService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.categoryService.findAll().subscribe((data) => this.categories = data);
    this.useReload();
  }
  useReload = () => {
    this.useShowSpinner();
    this.productService.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.products = data;
        this.useFilter();
      });
  }
  useFilter = () => {
    this.filterProducts = this.products.filter((e) =>
      (e.name.toLowerCase().includes(this.search.toLowerCase()) ||
        e.code.toLowerCase().includes(this.search.toLowerCase()))
        && (this.categories.filter((category) => category.choosen).length > 0
        ? this.categories.find((category) => category.id === e.category?.id)?.choosen : true)
    );
  }
  useSelectItem = (id: string) => {
    this.router.navigate(['core/home/' + id]);
  }
  useShowSpinner = () => {
    this.spinner.show('product-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('product-main');
    }, 1000);
  }
}
