import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employeetable',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './employeetable.component.html',
  styleUrl: './employeetable.component.css'
})
export class EmployeetableComponent implements OnInit{

  page :number = 0;
  size :number = 20;
  data : any = null;
  maxPages :number = 0;
  sort :string = "firstName";
  showAddForm : boolean = false;
  //variabili per la modifica employee
  showModifyForm : boolean = false;
  employeeToModData: any = null;
  nameToMod: string = "";
  surnameToMod: string = "";
  birthDateToMod: string = "";
  hireDateToMod: string = "";
  genderToMod: string = "";
  idToMod: number = -1;
  

  constructor(public employeeService: EmployeeService){};
  //chiamata quando sort oppure size cambiano dall'html
  onInputChange() { 
    this.loadData(this.page, this.size, this.sort); 
  }
  //inizializza
  ngOnInit(): void{
    this.loadData(this.page, this.size, this.sort);
  }
  //carica dati presenti nel db
  loadData(page:number, size:number, sort:string){
    this.employeeService.get(page,size,sort).subscribe(remoteData => {
      this.data = remoteData;
      this.maxPages = this.data.page.totalPages - 1;
    });
  }
  //cambia pagina della tabella
  changePage(opt:number){
    switch(opt){
      case 0:
        this.page = 0;
        break;
      case -1:
        if (this.page == 0) break;
        this.page--;
        break;
      case 1:
        if (this.page == this.maxPages) break;
        this.page++;
        break;
      case 9:
        this.page = this.maxPages;
        break;
    }
    this.loadData(this.page, this.size, this.sort);
  }
  //delete record del db
  deleteEmployee(id:number){
    this.employeeService.delete(id).subscribe(remoteData => {
      this.data = remoteData;
      location.reload();
    });
    
  }
  //mostra il form di aggiunta
  enableAddForm(){
    this.showAddForm = true;
  }
  //conferma i valori inseriti nel form e li manda al metodo post
  submitAddForm(form: NgForm) {
    this.showAddForm = false;
    if (!(form.value.birthDate == "" || form.value.name == "" || form.value.gender == "" || form.value.hireDate == "" || form.value.surname == "")){ //se tutti i campi sono stati riempiti
      const body = `{
        "birthDate": "`+ form.value.birthDate +`",
        "firstName": "`+ form.value.name +`",
        "gender": "`+ form.value.gender +`",
        "hireDate": "`+ form.value.hireDate +`",
        "id": 0,
        "lastName": "`+ form.value.surname +`"
      }`;
      this.postEmployee(body);
    }

    location.reload();

  }
  //post nel db del nuovo record
  postEmployee(body: any){
    this.employeeService.post(body).subscribe(remoteData => {
      this.data = remoteData;
    });
  }
  //conferma le modifiche dei valori del form 
  submitModifyForm(form: NgForm){
    if (!(form.value.birthDate == "" || form.value.name == "" || form.value.gender == "" || form.value.hireDate == "" || form.value.surname == "")){ //se tutti i campi sono stati riempiti
      const body = `{
        "birthDate": "`+ form.value.birthDate +`",
        "firstName": "`+ form.value.name +`",
        "gender": "`+ form.value.gender +`",
        "hireDate": "`+ form.value.hireDate +`",
        "id": `+ this.idToMod +`,
        "lastName": "`+ form.value.surname +`"
      }`;
      this.putEmployee(this.idToMod, body);
    }
  }
  //mostra il form con i valori del record
  modifyEmployee(id: number){
    // get con l'id
    this.employeeService.getById(id).subscribe(remoteData => {
      this.employeeToModData = remoteData;

      this.showModifyForm = true;
      // popolare campi form
      this.nameToMod = this.employeeToModData.firstName;
      this.surnameToMod = this.employeeToModData.lastName;
      this.birthDateToMod = this.employeeToModData.birthDate;
      this.hireDateToMod = this.employeeToModData.hireDate;
      this.genderToMod = this.employeeToModData.gender;
      
      this.idToMod = this.employeeToModData.id;
    });
    

  }
  //update record db
  putEmployee(id: number, body: any){
    this.employeeService.put(id, body).subscribe(remoteData => {
      this.data = remoteData;
      location.reload();
    });
  }
}
