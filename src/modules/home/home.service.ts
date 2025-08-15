import HomeRepository from './home.repository';

export class HomeService {
  constructor(private readonly repo: HomeRepository) {}
  hero() { return { title: 'Emlak Yönetim Sistemi', subtitle: 'Modern, hızlı ve güvenilir', ctaText: 'Yönetim Paneli', ctaHref: '/admin' }; }
  featuredProperties(ownerUserId: string, limit?: number) { return this.repo.featuredProperties(ownerUserId, limit); }
  quickStats(ownerUserId: string) { return this.repo.quickStats(ownerUserId); }
}

export default HomeService;


