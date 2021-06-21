import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  apps: PropertyApps[] = [];
  title = '';
  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const propertyId = params.id;
      this.dashboardService
        .fetchProperty(propertyId)
        .valueChanges.subscribe(({ data }) => {
          const { apps, projectId, name } = data.fetchProperty;
          this.apps = apps;
          this.title = name;
          this.dashboardService
            .fetchScores(projectId, apps)
            .valueChanges.subscribe(({ data }) => {
              console.log(data);
            });
        });
    });
  }
}
