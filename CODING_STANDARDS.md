# 📋 Padrões de Desenvolvimento - One Forum Frontend

## Índice
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Padrões TypeScript](#padrões-typescript)
- [Padrões de Componentes](#padrões-de-componentes)
- [Padrões de Services](#padrões-de-services)
- [Padrões de Estilo (CSS)](#padrões-de-estilo-css)
- [Padrões de Template (HTML)](#padrões-de-template-html)
- [Padrões de Roteamento](#padrões-de-roteamento)
- [Acessibilidade](#acessibilidade)
- [Sistema de Temas](#sistema-de-temas)

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas
```
src/app/
├── core/                    # Funcionalidades essenciais
│   ├── models/             # Interfaces e tipos
│   ├── services/           # Serviços globais
│   ├── interceptors/       # HTTP interceptors
│   └── validators/         # Validadores customizados
├── features/               # Módulos de funcionalidades
│   ├── auth/              # Autenticação
│   ├── home/              # Página inicial
│   ├── topics/            # Gerenciamento de tópicos
│   └── profile/           # Perfil de usuário
├── shared/                # Componentes compartilhados
│   ├── components/        # Componentes reutilizáveis
│   └── utils/            # Funções utilitárias
└── pages/                # Páginas standalone
```

### Organização de Features
Cada feature deve seguir esta estrutura:
```
feature-name/
├── pages/              # Páginas da feature
├── components/         # Componentes específicos
├── models/            # Modelos locais (opcional)
└── services/          # Serviços locais (opcional)
```

---

## 📘 Padrões TypeScript

### 1. Imports
**Organizar alfabeticamente por origem:**
```typescript
// ✅ Correto
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { CategoryService } from '../../../../core/services/category.service';
import { TopicDialog } from '../../../../shared/components/topic-dialog/topic-dialog';
import { SearchBar } from '../../components/search-bar/search-bar';

// ❌ Incorreto
import { MatIcon } from '@angular/material/icon';
import { Component, inject } from '@angular/core';
import { TopicDialog } from '../../../../shared/components/topic-dialog/topic-dialog';
import { AuthService } from '../../../../core/services/auth.service';
```

### 2. Nomenclatura

**Classes:**
- PascalCase para classes, interfaces, types
- Sufixo descritivo quando apropriado

```typescript
// ✅ Correto
export class AuthService { }
export class UserService { }
export interface User { }
export type Theme = 'light' | 'dark';

// ❌ Incorreto
export class authService { }
export class userService { }
export interface user { }
```

**Variáveis e Métodos:**
- camelCase para variáveis e métodos
- Nomes descritivos e claros

```typescript
// ✅ Correto
private readonly authService = inject(AuthService);
openCreateTopicDialog(): void { }
isOwnProfile = signal(true);

// ❌ Incorreto
private auth = inject(AuthService);
createTopicBtnClick() { }
isOwn = signal(true);
```

### 3. Tipagem
**Sempre especificar tipos de retorno:**
```typescript
// ✅ Correto
getUserById(id: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
}

setTheme(theme: Theme): void {
  this.theme.set(theme);
}

// ❌ Incorreto
getUserById(id: number) {
  return this.http.get(`${this.apiUrl}/${id}`);
}

setTheme(theme) {
  this.theme.set(theme);
}
```

---

## 🧩 Padrões de Componentes

### 1. Estrutura de Componente
```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [
    CommonModule,
    // Imports organizados alfabeticamente
  ],
  templateUrl: './example.html',
  styleUrl: './example.css',
})
export class Example {
  // 1. Serviços injetados (protected para uso no template, private para uso interno)
  protected readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);
  
  // 2. Signals e propriedades públicas/protected
  protected isLoading = signal(false);
  protected data = signal<Data[]>([]);
  
  // 3. Propriedades privadas
  private subscriptions: Subscription[] = [];
  
  // 4. Constructor (apenas quando necessário lógica de inicialização)
  constructor() {
    this.initialize();
  }
  
  // 5. Lifecycle hooks
  ngOnInit(): void { }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  // 6. Métodos públicos/protected (usados no template)
  protected handleClick(): void { }
  
  // 7. Métodos privados (lógica interna)
  private initialize(): void { }
}
```

### 2. Uso de Signals
**Preferir signals para estado reativo:**
```typescript
// ✅ Correto
protected isEditing = signal(false);
protected user = signal<User | null>(null);

// No template
@if (isEditing()) {
  <form>...</form>
}

// ❌ Evitar (a menos que seja necessário Observable)
protected isEditing = false;
protected user: User | null = null;
```

### 3. Injeção de Dependências
**Usar `inject()` em vez de constructor injection:**
```typescript
// ✅ Correto
export class MyComponent {
  private readonly service = inject(MyService);
  protected readonly authService = inject(AuthService);
}

// ❌ Evitar
export class MyComponent {
  constructor(
    private service: MyService,
    private authService: AuthService
  ) {}
}
```

---

## 🔧 Padrões de Services

### 1. Estrutura de Service
```typescript
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  // 1. Dependências injetadas
  private readonly http = inject(HttpClient);
  
  // 2. Constantes e configuração
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;
  
  // 3. Observables e subjects (quando necessário)
  private readonly dataSubject = new BehaviorSubject<Data[]>([]);
  readonly data$ = this.dataSubject.asObservable();
  
  // 4. Signals (quando apropriado)
  readonly currentUser = signal<User | null>(null);
  
  // 5. Constructor (apenas quando necessário inicialização)
  constructor() {
    this.initialize();
  }
  
  // 6. Métodos públicos
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  // 7. Métodos privados
  private initialize(): void { }
}
```

### 2. Propriedades
**Usar `readonly` sempre que possível:**
```typescript
// ✅ Correto
private readonly http = inject(HttpClient);
private readonly apiUrl = `${environment.apiBaseUrl}/users`;

// ❌ Evitar
private http = inject(HttpClient);
private apiUrl = `${environment.apiBaseUrl}/users`;
```

### 3. URLs da API
**Usar `environment` para base URL:**
```typescript
// ✅ Correto
private readonly apiUrl = `${environment.apiBaseUrl}/users`;

// ❌ Evitar
private readonly apiUrl = 'http://localhost:8080/users';
```

### 4. Tipos de Retorno HTTP
**Sempre especificar tipos genéricos:**
```typescript
// ✅ Correto
getUser(id: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
}

deleteUser(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

// ❌ Incorreto
getUser(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}
```

---

## 🎨 Padrões de Estilo (CSS)

### 1. Variáveis de Tema
**SEMPRE usar variáveis CSS para cores:**
```css
/* ✅ Correto */
.container {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.button {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}

/* ❌ Incorreto */
.container {
  background-color: #F9FAFB;
  color: #111827;
  border: 1px solid #e5e7eb;
}
```

### 2. Variáveis Disponíveis
```css
/* Backgrounds */
--bg-primary        /* Fundo principal da página */
--bg-secondary      /* Fundo de cards e containers */
--bg-tertiary       /* Fundo de inputs e elementos secundários */

/* Textos */
--text-primary      /* Texto principal */
--text-secondary    /* Texto secundário/descrições */
--text-tertiary     /* Texto desabilitado/placeholders */

/* Bordas e divisores */
--border-color      /* Bordas e divisores */

/* Botões */
--button-primary-bg       /* Background botão primário */
--button-primary-text     /* Texto botão primário */
--button-secondary-bg     /* Background botão secundário */
--button-secondary-text   /* Texto botão secundário */

/* Sombras */
--card-shadow       /* Sombra de cards */
```

### 3. Transições
**Adicionar transições para mudanças de tema:**
```css
/* ✅ Correto */
.element {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ❌ Evitar (sem transição) */
.element {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}
```

### 4. Organização do CSS
```css
/* 1. Posicionamento e Layout */
.element {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  /* 2. Dimensões */
  width: 100%;
  max-width: 72rem;
  height: auto;
  padding: 1rem;
  margin: 0 auto;
  
  /* 3. Aparência */
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--card-shadow);
  
  /* 4. Tipografia */
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  
  /* 5. Transições e animações */
  transition: all 0.3s ease;
}
```

### 5. Responsividade
**Usar breakpoints consistentes:**
```css
/* Desktop-first approach */
@media (max-width: 1024px) {
  /* Tablet */
}

@media (max-width: 768px) {
  /* Mobile */
}
```

---

## 📄 Padrões de Template (HTML)

### 1. Estrutura Semântica
**Usar tags HTML5 semânticas:**
```html
<!-- ✅ Correto -->
<nav aria-label="Navegação principal">
  <div class="nav-buttons-container">
    <button>Home</button>
  </div>
</nav>

<main aria-label="Conteúdo principal">
  <article>...</article>
</main>

<aside aria-label="Filtros">
  <app-filters-card></app-filters-card>
</aside>

<!-- ❌ Incorreto -->
<div class="nav">
  <div class="buttons">
    <button>Home</button>
  </div>
</div>

<div class="content">
  <div>...</div>
</div>
```

### 2. Sintaxe de Template
**Usar nova sintaxe de controle de fluxo (@if, @for):**
```html
<!-- ✅ Correto -->
@if (isLoading()) {
  <app-loader></app-loader>
} @else {
  <div class="content">{{ data() }}</div>
}

@for (item of items(); track item.id) {
  <app-card [data]="item"></app-card>
}

<!-- ❌ Evitar (sintaxe antiga) -->
<app-loader *ngIf="isLoading()"></app-loader>
<div class="content" *ngIf="!isLoading()">{{ data() }}</div>

<app-card *ngFor="let item of items()" [data]="item"></app-card>
```

### 3. Property Binding
**Remover `this.` desnecessário:**
```html
<!-- ✅ Correto -->
<button [disabled]="!(authService.isLogged$ | async)">
  Criar tópico
</button>

@if (isEditing()) {
  <form>...</form>
}

<!-- ❌ Incorreto -->
<button [disabled]="!(this.authService.isLogged$ | async)">
  Criar tópico
</button>

@if (this.isEditing()) {
  <form>...</form>
}
```

### 4. Formatação
```html
<!-- ✅ Correto - Bem formatado e legível -->
<button 
  matButton="filled"
  [disabled]="isLoading()"
  (click)="handleSubmit()"
  aria-label="Enviar formulário"
>
  Enviar
</button>

<!-- ❌ Incorreto - Tudo em uma linha -->
<button matButton="filled" [disabled]="isLoading()" (click)="handleSubmit()" aria-label="Enviar formulário">Enviar</button>
```

---

## 🛣️ Padrões de Roteamento

### 1. Definição de Rotas
```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home').then(m => m.Home),
    canActivate: [requireAuthentication]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
    canActivate: [redirectIfAuthenticated]
  },
];
```

### 2. Route Guards
**Usar funções de guard funcionais:**
```typescript
// ✅ Correto
const requireAuthentication = (): boolean => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.getAccessToken()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

// ❌ Evitar (guards de classe - deprecated)
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}
  
  canActivate(): boolean { }
}
```

---

## ♿ Acessibilidade

### 1. Atributos ARIA Obrigatórios

**Navegação:**
```html
<nav aria-label="Navegação principal">
  <div role="group" aria-label="Navegação de visualização">
    <button aria-label="Visualizar feed" aria-current="page">
      Feed
    </button>
  </div>
</nav>
```

**Botões com apenas ícones:**
```html
<button 
  mat-icon-button 
  (click)="toggleTheme()"
  aria-label="Alternar tema escuro"
>
  <mat-icon aria-hidden="true">dark_mode</mat-icon>
</button>
```

**Ícones decorativos:**
```html
<!-- Sempre adicionar aria-hidden="true" em ícones decorativos -->
<button>
  <mat-icon aria-hidden="true">send</mat-icon>
  <span>Enviar</span>
</button>
```

**Regiões principais:**
```html
<main aria-label="Conteúdo principal">
  <!-- conteúdo -->
</main>

<aside aria-label="Filtros de busca">
  <!-- filtros -->
</aside>
```

### 2. Estados Interativos
```html
<!-- Indicar estado atual -->
<button aria-current="page">Página atual</button>
<button aria-pressed="true">Botão ativado</button>
<button aria-expanded="false">Menu fechado</button>

<!-- Estados de carregamento -->
<button [attr.aria-busy]="isLoading()">
  Carregar mais
</button>
```

### 3. Formulários Acessíveis
```html
<mat-form-field>
  <mat-label>Nome de usuário</mat-label>
  <input 
    matInput 
    formControlName="username"
    aria-required="true"
    aria-describedby="username-error"
  />
  <mat-error id="username-error">
    Nome de usuário obrigatório
  </mat-error>
</mat-form-field>
```

---

## 🌓 Sistema de Temas

### 1. Como Usar Variáveis
```css
.my-component {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 2. Acessar Tema no TypeScript
```typescript
import { ThemeService } from '@core/services/theme.service';

export class MyComponent {
  protected readonly themeService = inject(ThemeService);
  
  get isDarkMode(): boolean {
    return this.themeService.theme() === 'dark';
  }
}
```

### 3. Toggle de Tema
```html
<button (click)="themeService.toggleTheme()">
  <mat-icon>
    {{ themeService.theme() === 'light' ? 'dark_mode' : 'light_mode' }}
  </mat-icon>
</button>
```

### 4. Regras Importantes
- ✅ **NUNCA** usar cores hardcoded (`#hex`, `rgb()`)
- ✅ **SEMPRE** usar variáveis CSS do tema
- ✅ **SEMPRE** adicionar transições nas propriedades de cor
- ✅ **TESTAR** ambos os temas (claro e escuro) ao desenvolver

---

## 📝 Checklist de Review

### Antes de Commitar
- [ ] Imports organizados alfabeticamente
- [ ] Propriedades com `readonly` quando apropriado
- [ ] Tipos de retorno explícitos em métodos
- [ ] Variáveis CSS usadas para cores
- [ ] Transições adicionadas para mudanças de tema
- [ ] Atributos ARIA em elementos interativos
- [ ] Tags semânticas HTML5 utilizadas
- [ ] Nova sintaxe de template (@if, @for)
- [ ] Nomes de classes em PascalCase
- [ ] Nomes de variáveis/métodos em camelCase
- [ ] `this.` removido dos templates
- [ ] Código formatado e sem erros de lint

### Testes Manuais
- [ ] Componente funciona no tema claro
- [ ] Componente funciona no tema escuro
- [ ] Navegação por teclado funciona
- [ ] Leitores de tela conseguem interpretar (testar com NVDA/JAWS)
- [ ] Responsivo em diferentes tamanhos de tela
- [ ] Sem erros no console

---

## 🔗 Recursos Úteis

- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Material Documentation](https://material.angular.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

---

**Última atualização:** Dezembro 2025  
**Versão:** 1.0.0
