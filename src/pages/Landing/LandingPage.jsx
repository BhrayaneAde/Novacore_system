import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  X,
  Check,
  Users,
  FileText,
  FileCheck,
  UserCircle,
  TrendingUp,
  Shield,
  Briefcase,
  User,
  Zap,
  Calendar,
  Edit,
  PenTool,
  Banknote,
  Crown,
  ShieldCheck,
} from "lucide-react";

const LandingPage = () => {
  useEffect(() => {
    document.title = "NovaCore - Système d'exploitation RH complet";
  }, []);

  return (
    <div className="bg-white text-gray-900 antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold tracking-tight">NovaCore</div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#fonctionnalites" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
              <a href="#modules" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Modules</a>
              <a href="#roles" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Rôles</a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <Link
              to="/register"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Demander une démo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&h=1000&fit=crop"
            alt="NovaCore Dashboard"
            className="w-full h-full object-cover"
            style={{ filter: "blur(8px) brightness(0.4)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-white">Plateforme SaaS pour les RH modernes</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight text-white">
              Le système d'exploitation complet pour vos ressources humaines
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Centralisez, automatisez et simplifiez toutes vos opérations RH dans une plateforme unique.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Commencer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" /> Voir la vidéo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "99.9%", label: "Disponibilité" },
            { value: "50K+", label: "Employés gérés" },
            { value: "80%", label: "Temps économisé" },
            { value: "500+", label: "Entreprises clientes" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-semibold tracking-tight mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">Finies les données fragmentées</h2>
            <p className="text-lg text-gray-600">
              NovaCore résout le problème fondamental de la fragmentation RH. Une source unique de vérité où tout est connecté.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Avant NovaCore</h3>
                  <p className="text-gray-600 text-sm">Multiples logiciels désorganisés, emails perdus, processus manuels.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Avec NovaCore</h3>
                  <p className="text-gray-600 text-sm">Une plateforme unifiée, données centralisées, automatisation intelligente.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="Équipe collaborative"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">Modules intégrés pour tout le cycle RH</h2>
            <p className="text-lg text-gray-600">De l'embauche au développement, gérez chaque étape avec des outils connectés.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, color: "blue", title: "NovaHire", text: "Recrutement simplifié et suivi des candidatures." },
              { icon: FileText, color: "purple", title: "NovaSign", text: "Signature électronique sécurisée pour tous vos documents RH." },
              { icon: FileCheck, color: "green", title: "NovaContrat", text: "Gestion complète des contrats de travail." },
              { icon: UserCircle, color: "orange", title: "NovaPeople", text: "Base de données employés complète et actualisée." },
              { icon: TrendingUp, color: "red", title: "NovaPerform", text: "Évaluation des performances et objectifs SMART." },
              { icon: Banknote, color: "indigo", title: "NovaPay", text: "Gestion automatisée de la paie avec conformité légale." },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition">
                <div className={`w-12 h-12 bg-${m.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <m.icon className={`w-6 h-6 text-${m.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{m.text}</p>
                <a href="#" className="text-sm font-medium text-gray-900 inline-flex items-center gap-1 hover:gap-2 transition-all">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">Une interface adaptée à chaque rôle</h2>
            <p className="text-lg text-gray-600">Permissions granulaires pour une collaboration efficace</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Employeur", icon: Crown, gradient: "from-purple-500 to-pink-500" },
              { title: "Admin RH", icon: ShieldCheck, gradient: "from-blue-500 to-cyan-500" },
              { title: "Manager", icon: Briefcase, gradient: "from-orange-500 to-red-500" },
              { title: "Employé", icon: User, gradient: "from-green-500 to-emerald-500" },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-4`}>
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Interface dédiée selon le rôle et les autorisations.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 px-6 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Prêt à transformer votre gestion RH ?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Rejoignez les entreprises qui simplifient leurs opérations avec NovaCore.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition">
              Démarrer gratuitement
            </Link>
            <Link to="/login" className="px-8 py-4 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition">
              Planifier une démo
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Aucune carte requise • Configuration en 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-lg font-semibold tracking-tight mb-4">NovaCore</div>
              <p className="text-sm text-gray-600">Le système d'exploitation complet pour vos ressources humaines</p>
            </div>
            {[
              {
                title: "Produit",
                links: ["Fonctionnalités", "Modules", "Tarifs", "Sécurité"],
              },
              {
                title: "Entreprise",
                links: ["À propos", "Blog", "Carrières", "Contact"],
              },
              {
                title: "Ressources",
                links: ["Documentation", "Support", "API", "Statut"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-gray-900 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2025 NovaCore. Tous droits réservés.</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Conditions</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
