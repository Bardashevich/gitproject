import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {LoginData} from "../../shared/models/login/login-data";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
export class LoginComponent implements OnInit {

  private returnUrl: string;
  private loginForm: FormGroup;
  loginData: LoginData = {username: '', password: '', rememberMe: false};

  colorClass;
  colorClasses = ['light-blue', 'blue', 'indigo', 'deep-purple', 'purple', 'pink', 'red',
    'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber',
    'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'];

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    this.colorClass = this.colorClasses[0];
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    })
  }

  submit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    this.authService.login(this.loginData).subscribe(response => {
      this.router.navigate([this.returnUrl]);
    });
  }

  nextColor() {
    let index = this.colorClasses.indexOf(this.colorClass) + 1;
    this.colorClass = this.colorClasses[index >= this.colorClasses.length ? 0 : index];
  }
}