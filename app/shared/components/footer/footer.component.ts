import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">QuizMaster</div>
            <p class="footer-description">
              Une application de quiz en temps réel pour l'apprentissage interactif.
            </p>
          </div>
          
          <div class="footer-links">
            <div class="footer-links-column">
              <h5>Navigation</h5>
              <ul>
                <li><a routerLink="/">Accueil</a></li>
                <li><a routerLink="/auth/login">Connexion</a></li>
                <li><a routerLink="/auth/register">Inscription</a></li>
              </ul>
            </div>
            
            <div class="footer-links-column">
              <h5>Ressources</h5>
              <ul>
                <li><a routerLink="/help">Centre d'aide</a></li>
                <li><a routerLink="/privacy">Politique de confidentialité</a></li>
                <li><a routerLink="/terms">Conditions d'utilisation</a></li>
              </ul>
            </div>
            
            <div class="footer-links-column">
              <h5>Contact</h5>
              <ul>
                <li><a href="mailto:support@quizmaster.com">Support par email</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Groupe 13 Quiz App. Développé par Koagne-Teussi-Wendell.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--neutral-800);
      color: var(--neutral-200);
      padding: var(--space-5) 0 var(--space-3);
      margin-top: var(--space-5);
    }
    
    .footer-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }
    
    .footer-brand {
      margin-bottom: var(--space-3);
    }
    
    .footer-logo {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: var(--space-2);
    }
    
    .footer-description {
      color: var(--neutral-400);
      max-width: 300px;
    }
    
    .footer-links {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-4);
    }
    
    .footer-links-column h5 {
      color: white;
      margin-bottom: var(--space-3);
      font-size: 1.1rem;
    }
    
    .footer-links-column ul {
      list-style: none;
      padding: 0;
    }
    
    .footer-links-column li {
      margin-bottom: var(--space-2);
    }
    
    .footer-links-column a {
      color: var(--neutral-400);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-links-column a:hover {
      color: white;
    }
    
    .footer-bottom {
      border-top: 1px solid var(--neutral-700);
      padding-top: var(--space-3);
      margin-top: var(--space-3);
      color: var(--neutral-500);
      font-size: 0.875rem;
      text-align: center;
    }
    
    @media (min-width: 768px) {
      .footer-content {
        flex-direction: row;
        justify-content: space-between;
      }
      
      .footer-brand {
        flex: 0 0 300px;
      }
      
      .footer-links {
        flex: 1;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
