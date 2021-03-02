import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit {
  constructor(private pConfig: PrimeNGConfig, private config: ConfigService) {}

  ngOnInit(): void {
    console.log('Pasamos por aqui antes');
    this.config.getData().subscribe((res) => {
      this.pConfig.setTranslation(res.primeng);
    });
  }
}
