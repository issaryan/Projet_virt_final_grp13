import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title fade-in">Apprentissage Interactif avec <span class="text-primary">QuizMaster</span></h1>
            <p class="hero-subtitle slide-in-left">Créez, partagez et participez à des quiz en temps réel pour améliorer l'expérience d'apprentissage.</p>
            <div class="hero-buttons slide-in-right">
              <a routerLink="/auth/register" class="btn btn-primary mr-3">Commencer</a>
              <a routerLink="/auth/login" class="btn btn-outline">Connexion</a>
            </div>
          </div>
          <div class="hero-image scale-in">
            <img src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Apprentissage Interactif" width="500" height="350" />
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2 class="section-title text-center">Fonctionnalités Clés</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon bg-primary">
                <span>🏫</span>
              </div>
              <h3>Portail Enseignant</h3>
              <p>Créez des quiz, gérez des sessions et analysez les performances des étudiants avec des statistiques en temps réel.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon bg-secondary">
                <span>👨‍🎓</span>
              </div>
              <h3>Portail Étudiant</h3>
              <p>Rejoignez des sessions de quiz, soumettez des réponses en temps réel et recevez des retours immédiats.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon bg-accent">
                <span>⚡</span>
              </div>
              <h3>Résultats Instantanés</h3>
              <p>Obtenez des retours instantanés et voyez vos performances par rapport à vos pairs pendant le quiz.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon bg-success">
                <span>📊</span>
              </div>
              <h3>Analyses Détaillées</h3>
              <p>Accédez à des statistiques complètes et des visualisations pour suivre les zones d'amélioration.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="how-it-works">
        <div class="container">
          <h2 class="section-title text-center">Comment ça marche</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <h3>Créez un Quiz</h3>
              <p>Les enseignants conçoivent des quiz avec différents types de questions et options de notation.</p>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <h3>Démarrez une Session</h3>
              <p>Générez un code unique et partagez-le avec les étudiants pour rejoindre le quiz.</p>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <h3>Participation en Direct</h3>
              <p>Les étudiants participent au quiz avec des retours instantanés sur leurs réponses.</p>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <h3>Analysez les Résultats</h3>
              <p>Examinez les performances individuelles et collectives avec des statistiques détaillées.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="container">
          <div class="cta-content">
            <h2>Prêt à transformer votre expérience d'enseignement ou d'apprentissage ?</h2>
            <p>Rejoignez des milliers d'enseignants et d'étudiants qui utilisent déjà QuizMaster.</p>
            <a routerLink="/auth/register" class="btn btn-primary btn-lg mt-3">Commencer Maintenant</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      margin-top: -60px;
      padding-top: 60px;
    }
    
    .hero {
      background-color: var(--neutral-50);
      padding: var(--space-6) 0;
    }
    
    .hero .container {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    
    .hero-content {
      text-align: center;
      margin-bottom: var(--space-4);
    }
    
    .hero-title {
      font-size: 2.5rem;
      margin-bottom: var(--space-3);
      color: var(--neutral-900);
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--neutral-600);
      max-width: 700px;
      margin: 0 auto var(--space-4);
    }
    
    .hero-buttons {
      margin-top: var(--space-4);
    }
    
    .hero-image {
      max-width: 100%;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }
    
    .hero-image img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .section-title {
      margin-bottom: var(--space-5);
      position: relative;
    }
    
    .section-title:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background-color: var(--primary-500);
      border-radius: 2px;
    }
    
    .features {
      padding: var(--space-6) 0;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
    }
    
    .feature-card {
      background-color: white;
      border-radius: var(--radius-md);
      padding: var(--space-4);
      box-shadow: var(--shadow-md);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-3);
      font-size: 1.75rem;
    }
    
    .feature-card h3 {
      margin-bottom: var(--space-2);
    }
    
    .how-it-works {
      padding: var(--space-6) 0;
      background-color: var(--neutral-50);
    }
    
    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
    }
    
    .step {
      text-align: center;
      padding: var(--space-3);
    }
    
    .step-number {
      width: 50px;
      height: 50px;
      background-color: var(--primary-500);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto var(--space-3);
    }
    
    .cta {
      padding: var(--space-6) 0;
      background-color: var(--primary-900);
      color: white;
    }
    
    .cta-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .cta h2 {
      color: white;
      margin-bottom: var(--space-3);
    }
    
    .btn-lg {
      padding: var(--space-2) var(--space-4);
      font-size: 1.1rem;
    }
    
    @media (min-width: 768px) {
      .hero .container {
        flex-direction: row;
        justify-content: space-between;
      }
      
      .hero-content {
        flex: 1;
        text-align: left;
        margin-right: var(--space-5);
        margin-bottom: 0;
      }
      
      .hero-subtitle {
        margin: 0 0 var(--space-4);
      }
      
      .hero-image {
        flex: 1;
      }
      
      .hero-title {
        font-size: 3rem;
      }
    }
  `]
})
export class HomeComponent {}
