import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewSingleInvoicesService } from './view-single-invoice.service';
import { Invoice } from '../invoice.types';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-view-single-invoice',
  templateUrl: './view-single-invoice.component.html',
  styleUrls: ['./view-single-invoice.component.scss'],
})
export class ViewSingleInvoiceComponent implements OnInit {
  SERVER = environment.SERVER;
  invoice?: Invoice;
  userType: any;
  reviewable?: boolean;
  approvable?: boolean;
  rejectable?: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewSingleInvoicesService: ViewSingleInvoicesService,
    private appService: AppService
  ) {
    const invoiceId = this.route.snapshot.params['id'];
    this.viewSingleInvoicesService.getInvoiceById(invoiceId).then((invoice) => {
      this.invoice = invoice;
      this.userType = localStorage.getItem('user_type');
      this.reviewable =
        this.userType === 'CLIENT' && this.invoice.status === 'UPLOADED';
      this.approvable =
        this.userType === 'BANKER' &&
        (this.invoice.status === 'IN_REVIEW' ||
          this.invoice.status === 'REJECTED');
      this.rejectable =
        this.userType === 'BANKER' && this.invoice.status === 'IN_REVIEW';
    });
  }

  ngOnInit(): void {
    this.appService.setPageTitle('View Invoice');
  }

  back(): void {
    this.router.navigateByUrl('invoice/view-invoices');
  }

  approve(): void {
    if (this.invoice) {
      this.viewSingleInvoicesService
        .updateStatus({
          invoiceId: this.invoice.invoiceId,
          status: 'APPROVED',
        })
        .subscribe((res) => {
          this.invoice = res;
        });
    }
  }

  reject(): void {
    if (this.invoice) {
      this.viewSingleInvoicesService
        .updateStatus({
          invoiceId: this.invoice.invoiceId,
          status: 'REJECTED',
        })
        .subscribe((res) => {
          this.invoice = res;
        });
    }
  }

  requestReview(): void {
    if (this.invoice) {
      this.viewSingleInvoicesService
        .requestReview({
          invoiceId: this.invoice.invoiceId,
          status: 'IN_REVIEW',
        })
        .subscribe((res) => {
          this.invoice = res;
        });
    }
  }
}
