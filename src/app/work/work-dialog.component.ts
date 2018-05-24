// npm packages - angular
import { Component, Inject, OnInit }  from '@angular/core';
import { MD_DIALOG_DATA }             from '@angular/material';

// npm packages
import { ValidationManager }  from 'ng2-validation-manager';

@Component({
  selector: 'cus-work-dialog',
  templateUrl: './work-dialog.component.html',
})

export class WorkDialogComponent implements OnInit {
  workForm;

  constructor(@Inject(MD_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.workForm = new ValidationManager({
      '_id': '',
      'name': 'required|alphaSpace',
      'address': 'required',
      'country': 'required|alphaSpace',
      'note': '',
    });

    this.workForm.setValue({
      '_id': this.data._id,
      'name': this.data.name,
      'address': this.data.address,
      'country': this.data.country,
      'note': this.data.note,
    });
  }
}
