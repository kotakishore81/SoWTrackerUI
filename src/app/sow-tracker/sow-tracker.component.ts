import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SowtrackerService } from './sowtracker.service';
import { ActivatedRoute } from '@angular/router';
import { CreatesowService } from '../create-sow/createsow.service';

@Component({
  selector: 'app-sow-tracker',
  templateUrl: './sow-tracker.component.html',
  styleUrls: ['./sow-tracker.component.scss']
})
export class SowTrackerComponent implements OnInit {
  response: any;
  originalSoWFromCreateSoW: any;
  getValuefromCreateFlow: any;
  loading=false;
  constructor(private router: Router, private createSoWService: CreatesowService,
    private sowtrackerservice: SowtrackerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading=true;

    this.getValuefromCreateFlow = this.createSoWService.getFromCreateSoW();
    this.originalSoWFromCreateSoW = this.createSoWService.getOriginalSoWNumber();
    if (this.getValuefromCreateFlow == true) {
      this.sowtrackerservice.getSummaryDetailsAfterReview(this.originalSoWFromCreateSoW)
        .subscribe(response => {
          this.response = response.data;
          this.loading=false;

        });
    } else {
      this.route.queryParamMap.subscribe(params =>
        this.getSummaryDetails(params)
      );

    }
  }

  navigateToEditSoWTracker() {
    this.router.navigate([('/editSOW')], { queryParams: { sow: this.response.soWPattern } });
  }
  getSummaryDetails(params: any) {

    this.sowtrackerservice.getSummaryDetails(params.params.category)
      .subscribe(response => {
        this.response = response.data;
        this.loading=false;

      });
  }
  navigateToChooseSoW() {
    this.router.navigate(['/chooseSOW']);
  }
  navigateToSearchSoW() {
    this.router.navigate(['/']);
  }
  navigateToReviewSow(){
    this.router.navigate(['/reviewSOW'], { queryParams: { category: this.response.soWPattern } } );
  }
}
