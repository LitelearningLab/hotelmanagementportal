import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { DefaultStoreService } from './default-store.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    title: string;
    constructor(
        private toastr: ToastrService,
        private store: DefaultStoreService
    ) {
        this.store.generalSettings.subscribe(
            (result) => {
                if (result && typeof result.site_title != 'undefined') {
                    this.title = result.site_title;
                }
            }
        );
    }

    showSuccess(message) {
        this.toastr.success(message, this.title,
            {
                progressBar: true,
                progressAnimation: "decreasing",
                closeButton: true,
                positionClass: 'toast-top-center'

            }
        )
    }

    showError(message) {
        this.toastr.error(message, this.title,
            {
                progressBar: true,
                progressAnimation: "decreasing",
                closeButton: true,
                positionClass: 'toast-top-center'

            }
        );
    }

    showInfo(message) {
        this.toastr.info(message, this.title,
            {
                progressBar: true,
                progressAnimation: "decreasing",
                closeButton: true,
                positionClass: 'toast-top-center'

            }
        )
    }

    showWarning(message: string, enableHtml?: boolean) {
        this.toastr.warning(message, this.title,
            {
                enableHtml: enableHtml ? enableHtml : false,
                progressBar: true,
                progressAnimation: "decreasing",
                closeButton: true,
                positionClass: 'toast-top-center'

            }
        )
    }

}