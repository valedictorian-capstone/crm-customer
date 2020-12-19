import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProductService, GlobalService, CategoryService, TicketService } from '@services';
import { CategoryVM, ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { environment } from '@environments/environment';
import swal from 'sweetalert2';

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
  description = '';
  showSearch = false;
  constructor(
    protected readonly productService: ProductService,
    protected readonly categoryService: CategoryService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
    protected readonly ticketService: TicketService,
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
        this.products = data.filter((e) => !e.isDelete);
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
    console.log(id);
    this.router.navigate(['core/product/detail/' + id]);
  }
  useShowSpinner = () => {
    this.spinner.show('product-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('product-main');
    }, 1000);
  }
  useContact = (templateGotoLogin: TemplateRef<any>, templateSupport: TemplateRef<any>, name?: string) => {
    if (localStorage.getItem(environment.token)) {
      this.useDialog(templateSupport, name);
    } else {
      this.useDialog(templateGotoLogin);
    }
  }
  useDialog = (template: TemplateRef<any>, name?: string) => {
    this.dialogService.open(template, { closeOnBackdropClick: true, context: {name} });
  }
  usePhone = () => {
    window.open('tel:' + '0902818547', '_self');
  }
  useLogin = () => {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
  useSupport = (ref: NbDialogRef<any>, name: string) => {
    console.log(name);
    ref.close();
    this.ticketService.insert({
      description: this.description + `<br>Service name: ${name}`,
      type: 'deal',
    } as any).subscribe(() => {
      this.description = '';
      swal.fire('Your support form have been send!', 'Thask for your attention! We will contact you soon!', 'success');
    });
  }
}
