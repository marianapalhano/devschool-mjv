import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Adopter } from 'src/app/features/adopters/models/adopter.model';
import { AdoptersService } from 'src/app/features/adopters/services/adopters.service';
import { Ngo } from 'src/app/features/ngos/models/ngo.model';
import { NgosService } from 'src/app/features/ngos/services/ngos.service';
import { MsgDialogComponent } from 'src/app/shared/dialogs/msg-dialog/msg-dialog.component';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.scss']
})
export class PetComponent implements OnInit {

  @Input()
  pet?: Pet;

  @Input()
  card: boolean = false;

  ngos: Array<Ngo> = [];
  ngoName: string = '';

  adopter?: Adopter;

  constructor(
    private ngosService: NgosService, 
    private activatedRoute: ActivatedRoute,
    private adoptersService: AdoptersService,
    private dialog: MatDialog
  ) { 
    const adopterStorage = sessionStorage.getItem('adopter');
    if (adopterStorage) {
      this.adopter = JSON.parse(adopterStorage);
    }
  }

  ngOnInit(): void {   

    this.activatedRoute.params.subscribe(params => {
      if (this.pet && params['id']) {
        this.ngos = this.ngosService.getNgos();
        this.ngos.filter(ngo => {
          if (ngo.id === this.pet?.ngoId) {
            this.ngoName = ngo.name;
          }
        });
      };
    });
  }


  makeAdoption() {
    if (this.adopter && this.pet) {
      // adiciona pet no array pets do this.adopter
      this.adoptersService.addPetToAdopter(this.adopter.id, this.pet.id);
      this.dialog.open(MsgDialogComponent, {
        width: '350px',
        data: { title: 'Parabéns', message: 'Você iniciou o processo de adoção.' }
      })
    } else {
      this.dialog.open(MsgDialogComponent, {
        width: '350px',
        data: { title: 'Alerta', message: 'Você precisa fazer login para acessar a adoção.' }
      })
    }
  }

}