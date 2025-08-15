import HomeRepository from './home.repository';

export class HomeService {
  constructor(private readonly repo: HomeRepository) {}
  hero() { return { title: 'Emlak Yönetim Sistemi', subtitle: 'Modern, hızlı ve güvenilir', ctaText: 'Yönetim Paneli', ctaHref: '/admin' }; }
  featuredProperties(tenantId: string, limit?: number) { return this.repo.featuredProperties(tenantId, limit); }
  quickStats(tenantId: string) { return this.repo.quickStats(tenantId); }
}

export default HomeService;


