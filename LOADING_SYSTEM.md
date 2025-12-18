# Sistema de Loading e Skeletons

## Componentes de Skeleton Criados

### 1. SkeletonTopicCard
**Localização:** `src/app/shared/components/skeleton-topic-card/`

Skeleton animado para cards de tópicos, incluindo:
- Avatar do autor
- Nome do usuário e data
- Título e descrição
- Categorias (chips)
- Estatísticas (likes, comentários)

**Uso:**
```html
<skeleton-topic-card></skeleton-topic-card>
```

### 2. SkeletonComment
**Localização:** `src/app/shared/components/skeleton-comment/`

Skeleton para comentários, incluindo:
- Avatar do autor
- Nome e data
- Conteúdo do comentário (3 linhas)

**Uso:**
```html
<skeleton-comment></skeleton-comment>
```

### 3. SkeletonProfileCard
**Localização:** `src/app/shared/components/skeleton-profile-card/`

Skeleton para cartão de perfil, incluindo:
- Avatar grande
- Nome e email
- Seção de atividades

**Uso:**
```html
<skeleton-profile-card></skeleton-profile-card>
```

## Páginas com Loading Implementado

### Home (`topic-list`)
- **Estado:** Usa `StatusFlag.LOADING`
- **Skeleton:** Exibe 5 `skeleton-topic-card` durante carregamento
- **Comportamento:** Substituiu o spinner + texto por skeletons animados

### Topic Detail
- **Estados:**
  - `isLoadingTopic()` - Para o card do tópico
  - `isLoadingComments()` - Para a lista de comentários
- **Skeletons:**
  - 1 `skeleton-topic-card` para o tópico
  - 3 `skeleton-comment` para comentários
- **Comportamento:** Loading independente para tópico e comentários

### Profile
- **Estado:** `isLoadingProfile()`
- **Skeleton:** 1 `skeleton-profile-card`
- **Comportamento:** Exibido apenas ao carregar perfil de outro usuário

## Animação

Todos os skeletons usam a animação `pulse`:

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

- Duração: 1.5s
- Efeito: fade in/out suave
- Cor: `var(--bg-tertiary)` do tema

## CSS Variables Utilizadas

Os skeletons respeitam o tema (claro/escuro):
- `--bg-secondary` - Background dos cards
- `--bg-tertiary` - Cor dos elementos skeleton
- `--border-color` - Bordas dos cards

## Padrões de Implementação

### 1. No TypeScript
```typescript
protected isLoading = signal(true);

private loadData(): void {
  this.isLoading.set(true);
  this.service.getData().subscribe({
    next: (data) => {
      // processar dados
      this.isLoading.set(false);
    },
    error: () => {
      this.isLoading.set(false);
    }
  });
}
```

### 2. No Template
```html
@if (isLoading()) {
  @for (item of [1, 2, 3]; track item) {
    <skeleton-component></skeleton-component>
  }
} @else {
  <!-- conteúdo real -->
}
```

## Benefícios

1. **Melhor UX:** Usuário sabe que algo está carregando
2. **Redução de CLS:** Layout estável durante carregamento
3. **Percepção de Performance:** Sensação de app mais rápido
4. **Acessibilidade:** `aria-hidden="true"` nos skeletons
5. **Tema Consistente:** Adapta-se automaticamente ao tema claro/escuro

## Próximas Melhorias (Sugestões)

- [ ] Skeleton para search-bar com sugestões
- [ ] Skeleton para filtros de categoria
- [ ] Progressive loading (carregar conteúdo incremental)
- [ ] Shimmer effect (efeito de brilho deslizante)
- [ ] Lazy loading de imagens com blur placeholder
