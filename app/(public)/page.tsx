import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import PracticeAreasSection from "@/components/public/PracticeAreasSection";
import StatisticsSection from "@/components/public/StatisticsSection";
import IntroductionSection from "@/components/public/IntroductionSection";
import LatestArticlesSection from "@/components/public/LatestArticlesSection";
import Footer from "@/components/public/Footer";
import FloatingContact from "@/components/public/FloatingContact";

import { prisma } from "@/lib/db/prisma";
import { getPublicStatistics } from "@/lib/services/statistic.service";
import { getPublicArticles } from "@/lib/services/article.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_HERO = {
  subtitle: "Luật sư – Thạc sĩ",
  name: "LÊ THỊ NGỌC LỢI",
  imageUrl: "/customer-reference.png",
};

const DEFAULT_INTRO = {
  title: "VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI",
  content:
    "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn và tranh tụng, đã đồng hành và bảo vệ quyền lợi hợp pháp cho hàng trăm cá nhân, tổ chức.",
};

const DEFAULT_STATISTICS = [
  { id: "s1", value: "500+", label: "Khách hàng tin tưởng", subtext: null, displayOrder: 1 },
  { id: "s2", value: "800+", label: "Vụ việc đã giải quyết", subtext: null, displayOrder: 2 },
  { id: "s3", value: "10+", label: "Năm kinh nghiệm", subtext: null, displayOrder: 3 },
  { id: "s4", value: "100%", label: "Tận tâm vì khách hàng", subtext: null, displayOrder: 4 },
];

const DEFAULT_PRACTICE_AREAS = [
  { id: "p1", title: "ĐẤT ĐAI – NHÀ Ở" },
  { id: "p2", title: "HÔN NHÂN – GIA ĐÌNH" },
  { id: "p3", title: "DÂN SỰ – HỢP ĐỒNG" },
  { id: "p4", title: "TRANH TỤNG TẠI TÒA" },
  { id: "p5", title: "DOANH NGHIỆP" },
  { id: "p6", title: "HÌNH SỰ – HÀNH CHÍNH" },
];

const DEFAULT_SETTINGS = {
  siteName: "Luật sư - Thạc sĩ Lê Thị Ngọc Lợi",
  phone: "0902 081 061",
  address: "Phường Cao Lãnh, Đồng Tháp",
  floatingContactEnabled: true,
  practiceAreasSectionTitle: "LĨNH VỰC HOẠT ĐỘNG",
  newsSectionTitle: "TIN TỨC PHÁP LUẬT",
};

async function getSiteData() {
  try {
    const site = await prisma.site.findUnique({
      where: { slug: "le-thi-ngoc-loi" },
      include: {
        settings: true,
        hero: true,
        introduction: true,
        practiceAreas: {
          where: { status: "PUBLISHED" },
          orderBy: { displayOrder: "asc" },
        },
        contactChannels: {
          where: { status: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!site) {
      return {
        siteId: null,
        settings: DEFAULT_SETTINGS,
        hero: DEFAULT_HERO,
        introduction: DEFAULT_INTRO,
        statistics: DEFAULT_STATISTICS,
        practiceAreas: DEFAULT_PRACTICE_AREAS,
        articles: [],
        enabledChannels: [],
      };
    }

    const statistics = await getPublicStatistics(site.id).catch(() => DEFAULT_STATISTICS);
    
    // Query articles specifically marked as isNews: true
    let articlesResult: any = await getPublicArticles(site.id, { isNews: true, pageSize: 4 }).catch(() => ({ articles: [] }));

    // Secondary Check: If no articles are marked as isNews yet, check if there are articles specifically under Menu 'tin-tuc'
    if (!articlesResult.articles || articlesResult.articles.length === 0) {
      const newsMenu = await prisma.menu.findFirst({
        where: { siteId: site.id, OR: [{ slug: "tin-tuc" }, { title: { contains: "Tin tức" } }] },
      });
      if (newsMenu) {
        articlesResult = await getPublicArticles(site.id, { menuId: newsMenu.id, pageSize: 4 }).catch(() => ({ articles: [] }));
      }
    }

    return {
      siteId: site.id,
      settings: site.settings || DEFAULT_SETTINGS,
      hero: site.hero
        ? {
            subtitle: site.hero.pubSubtitle || DEFAULT_HERO.subtitle,
            name: site.hero.pubName || DEFAULT_HERO.name,
            imageUrl: site.hero.pubImageUrl || DEFAULT_HERO.imageUrl,
            title1: site.hero.pubTitle1,
            title2: site.hero.pubTitle2,
            description: site.hero.pubDescription,
            badgesJson: site.hero.pubBadgesJson,
            ctaPrimaryText: site.hero.pubCtaPrimaryText,
            ctaSecondaryText: site.hero.pubCtaSecondaryText,
          }
        : DEFAULT_HERO,
      introduction: site.introduction
        ? {
            title: site.introduction.pubTitle || DEFAULT_INTRO.title,
            content: site.introduction.pubContent || DEFAULT_INTRO.content,
            imageUrl: site.introduction.pubImageUrl || "/NgocLoi-office.jpg",
          }
        : DEFAULT_INTRO,
      statistics: statistics.length > 0 ? statistics : DEFAULT_STATISTICS,
      practiceAreas: site.practiceAreas.length > 0 ? site.practiceAreas : DEFAULT_PRACTICE_AREAS,
      articles: articlesResult.articles || [],
      enabledChannels: site.contactChannels || [],
    };
  } catch (error) {
    console.error("Error loading site data, using fallback defaults:", error);
    return {
      siteId: null,
      settings: DEFAULT_SETTINGS,
      hero: DEFAULT_HERO,
      introduction: DEFAULT_INTRO,
      statistics: DEFAULT_STATISTICS,
      practiceAreas: DEFAULT_PRACTICE_AREAS,
      articles: [],
      enabledChannels: [],
    };
  }
}

export default async function PublicPage() {
  const data = await getSiteData();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Top Bar & Main Header */}
      <Header />

      {/* 2. Full-Width Navy Hero Section (Standing Lawyer Portrait on Left, Main Title & 4 Badges on Right) */}
      <Hero data={data.hero} />

      {/* 3. Lĩnh Vực Hoạt Động (6 White Cards Grid) */}
      <PracticeAreasSection items={data.practiceAreas} sectionTitle={data.settings?.practiceAreasSectionTitle} />

      {/* 4. Statistics Counter Bar (Full Navy Bar) */}
      <StatisticsSection items={data.statistics} />

      {/* 5. Về Luật Sư Lê Thị Ngọc Lợi (Standalone Introduction Section: Sitting Lawyer Photo on Left, Text & 4 Checkmarks on Right) */}
      <IntroductionSection data={data.introduction} />

      {/* 6. Tin Tức Pháp Luật (4-Card Article Grid) */}
      {data.articles.length > 0 && (
        <LatestArticlesSection articles={data.articles} sectionTitle={data.settings?.newsSectionTitle} />
      )}

      {/* 7. Footer & Quick Consultation Form (Full Navy Footer) */}
      <Footer settings={data.settings} />

      {/* 8. Mobile Floating Contact Bar */}
      <FloatingContact
        enabled={data.settings?.floatingContactEnabled ?? true}
        phone={data.settings?.phone || "0902 081 061"}
        channels={data.enabledChannels}
      />
    </div>
  );
}
