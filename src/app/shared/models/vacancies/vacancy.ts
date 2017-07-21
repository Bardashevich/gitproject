export class Vacancy {
    id: number;
    name: string;
    positionName: string;
    responsibilities: string;
    salaryMin: number;
    salaryMax: number;
    educationType: string;
    specialization: string;
    openDate: any;
    closeDate: any;
    comment: string;
    foreignLanguage: string;
    languageLevel: string;
    experienceMin: number;
    experienceMax: number;
    vacancyPriority: string;
    hr: any;
    creator: any;
    dateDeleted: number;
    lastSearchDate: number;
    deleter: any;
    history: any;
    vacancySkills:any[] = [];
    status: string;
    selected: boolean = false;
    
    constructor(){
        this.foreignLanguage = 'English';
        this.openDate = new Date;
    }
}