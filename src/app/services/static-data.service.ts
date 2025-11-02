import { Injectable } from '@angular/core';

export interface StaticPackage {
  id: number;
  nom_pak: string;
  prix: string;
  date_debut: string;
  date_fin: string;
  ville_depart: string;
  qte_package: number;
  images: { image: string }[];
  agence?: { 
    id: number;
    nomagence: string;
    logo_agence?: string;
    adr_agence?: string;
    tel?: number;
  };
}

export interface StaticHotel {
  id: number;
  nom_hotels: string;
  prix: number;
  date_debut?: string;
  date_fin?: string;
  ville_arr: 'Makkah' | 'Madinah';
  distance_haram?: number;
  nbr_etoile?: number;
  images?: { image: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {
  
  getStaticPackages(): StaticPackage[] {
    return [
      {
        id: 1,
        nom_pak: "Omra Premium - Makkah & Madinah",
        prix: "1500",
        date_debut: "2025-12-01",
        date_fin: "2025-12-10",
        ville_depart: "Paris",
        qte_package: 25,
        images: [{ image: "/media/packages/images/omralogo.jpg" }],
        agence: {
          id: 1,
          nomagence: "Agence El Hijaz",
          logo_agence: "/media/packages/images/omralogo.jpg",
          adr_agence: "Paris, France",
          tel: 33123456789
        }
      },
      {
        id: 2,
        nom_pak: "Omra Express - Makkah",
        prix: "1200",
        date_debut: "2025-11-15",
        date_fin: "2025-11-22",
        ville_depart: "Lyon",
        qte_package: 15,
        images: [{ image: "/media/packages/images/omralogo.jpg" }],
        agence: {
          id: 1,
          nomagence: "Agence El Hijaz",
          logo_agence: "/media/packages/images/omralogo.jpg",
          adr_agence: "Paris, France",
          tel: 33123456789
        }
      },
      {
        id: 3,
        nom_pak: "Omra Complète - 15 Jours",
        prix: "2200",
        date_debut: "2025-12-20",
        date_fin: "2026-01-04",
        ville_depart: "Marseille",
        qte_package: 30,
        images: [{ image: "/media/packages/images/madina_almunawwarah.jpg" }],
        agence: {
          id: 1,
          nomagence: "Agence El Hijaz",
          logo_agence: "/media/packages/images/omralogo.jpg",
          adr_agence: "Paris, France",
          tel: 33123456789
        }
      },
      {
        id: 4,
        nom_pak: "Omra Ramadan Spécial",
        prix: "2500",
        date_debut: "2025-03-01",
        date_fin: "2025-03-15",
        ville_depart: "Paris",
        qte_package: 20,
        images: [{ image: "/media/packages/images/omralogo.jpg" }],
        agence: {
          id: 1,
          nomagence: "Agence El Hijaz",
          logo_agence: "/media/packages/images/omralogo.jpg",
          adr_agence: "Paris, France",
          tel: 33123456789
        }
      },
      {
        id: 5,
        nom_pak: "Omra Famille - Makkah & Madinah",
        prix: "1800",
        date_debut: "2025-11-01",
        date_fin: "2025-11-12",
        ville_depart: "Paris",
        qte_package: 40,
        images: [{ image: "/media/packages/images/omralogo.jpg" }],
        agence: {
          id: 1,
          nomagence: "Agence El Hijaz",
          logo_agence: "/media/packages/images/omralogo.jpg",
          adr_agence: "Paris, France",
          tel: 33123456789
        }
      },
      {
        id: 6,
        nom_pak: "Omra VIP - Hôtels 5 Étoiles",
        prix: "3500",
        date_debut: "2025-12-10",
        date_fin: "2025-12-20",
        ville_depart: "Paris",
        qte_package: 10,
        images: [{ image: "/media/packages/images/omralogo.jpg" }],
        agence: {
          id: 1,
          nomagence: "Agence El Hijaz",
          logo_agence: "/media/packages/images/omralogo.jpg",
          adr_agence: "Paris, France",
          tel: 33123456789
        }
      }
    ];
  }

  getStaticHotels(): StaticHotel[] {
    return [
      {
        id: 1,
        nom_hotels: "Hôtel Abraj Al Bait - Makkah",
        prix: 250,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Makkah",
        distance_haram: 0.2,
        nbr_etoile: 5,
        images: [{ image: "/media/hotels/images/hotel1.jpg" }]
      },
      {
        id: 2,
        nom_hotels: "Hôtel Pullman Zamzam Makkah",
        prix: 180,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Makkah",
        distance_haram: 0.1,
        nbr_etoile: 5,
        images: [{ image: "/media/hotels/images/hotel2.jpg" }]
      },
      {
        id: 3,
        nom_hotels: "Hôtel Movenpick Madinah",
        prix: 220,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Madinah",
        distance_haram: 0.3,
        nbr_etoile: 5,
        images: [{ image: "/media/hotels/images/hotel3.jpg" }]
      },
      {
        id: 4,
        nom_hotels: "Hôtel Hilton Makkah",
        prix: 200,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Makkah",
        distance_haram: 0.15,
        nbr_etoile: 5,
        images: [{ image: "/media/hotels/images/hotel1.jpg" }]
      },
      {
        id: 5,
        nom_hotels: "Hôtel Anwar Al Madinah Mövenpick",
        prix: 190,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Madinah",
        distance_haram: 0.25,
        nbr_etoile: 5,
        images: [{ image: "/media/hotels/images/hotel2.jpg" }]
      },
      {
        id: 6,
        nom_hotels: "Hôtel Raffles Makkah Palace",
        prix: 300,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Makkah",
        distance_haram: 0.05,
        nbr_etoile: 5,
        images: [{ image: "/media/hotels/images/hotel3.jpg" }]
      },
      {
        id: 7,
        nom_hotels: "Hôtel Millennium Madinah",
        prix: 160,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Madinah",
        distance_haram: 0.4,
        nbr_etoile: 4,
        images: [{ image: "/media/hotels/images/hotel1.jpg" }]
      },
      {
        id: 8,
        nom_hotels: "Hôtel Swissotel Makkah",
        prix: 230,
        date_debut: "2025-11-01",
        date_fin: "2025-11-10",
        ville_arr: "Makkah",
        distance_haram: 0.12,
        nbr_etoile: 5,
        images: [{ image: "/media/hotels/images/hotel2.jpg" }]
      }
    ];
  }

  getPackageById(id: number): StaticPackage | undefined {
    return this.getStaticPackages().find(pkg => pkg.id === id);
  }

  getHotelById(id: number): StaticHotel | undefined {
    return this.getStaticHotels().find(hotel => hotel.id === id);
  }
}

