import { prisma } from '../config/db';
import { Organization, BusinessProfile, BusinessMetric, Role } from '@prisma/client';

export class OrgRepository {
  static async create(name: string, industry: string, website?: string): Promise<Organization> {
    return prisma.organization.create({
      data: { name, industry, website }
    });
  }

  static async addMember(organizationId: string, userId: string, role: Role): Promise<any> {
    return prisma.member.create({
      data: { organizationId, userId, role }
    });
  }

  static async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        businessProfile: true,
        metrics: true
      }
    });
  }

  static async findByUserId(userId: string): Promise<Organization[]> {
    return prisma.organization.findMany({
      where: {
        members: {
          some: { userId }
        }
      }
    });
  }

  static async upsertProfile(organizationId: string, profileData: any): Promise<BusinessProfile> {
    return prisma.businessProfile.upsert({
      where: { organizationId },
      update: { profileData },
      create: { organizationId, profileData }
    });
  }

  static async addMetric(organizationId: string, metricName: string, value: number, period: string, timestamp: Date): Promise<BusinessMetric> {
    return prisma.businessMetric.create({
      data: { organizationId, metricName, value, period, timestamp }
    });
  }

  static async getMetrics(organizationId: string): Promise<BusinessMetric[]> {
    return prisma.businessMetric.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' }
    });
  }
}
