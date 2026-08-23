import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import IntroductionSection from "@/components/public/IntroductionSection";
import EducationSection from "@/components/public/EducationSection";
import ExperienceSection from "@/components/public/ExperienceSection";
import PracticeAreasSection from "@/components/public/PracticeAreasSection";
import CommitmentSection from "@/components/public/CommitmentSection";
import Footer from "@/components/public/Footer";
import FloatingContact from "@/components/public/FloatingContact";

import { prisma } from "@/lib/db/prisma";
import { getPublishedHero } from "@/lib/services/hero.service";
import { getPublishedIntroduction } from "@/lib/services/introduction.service";
import { getPublishedEducations } from "@/lib/services/education.service";
import { getPublishedExperiences } from "@/lib/services/experience.service";
import { getPublishedPracticeAreas } from "@/lib/services/practice-area.service";
import { getPublishedCommitment } from "@/lib/services/commitment.service";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";

export const revalidate = 60; // ISR 60s Edge Caching for instantaneous speed

// Production Fallback Defaults (Ensures ZERO missing blocks even if DB is seeding or slow)
const DEFAULT_HERO = {
  subtitle: "Luật sư - Thạc sĩ",
  name: "LÊ THỊ NGỌC LỢI",
  imageUrl: "/customer-reference.png",
};

const DEFAULT_INTRO = {
  title: "GIỚI THIỆU",
  content:
    "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và cơ quan Nội chính Tỉnh ủy, am hiểu sâu sắc pháp luật và thực tiễn áp dụng.\n\nTrên nền tảng kiến thức vững chắc cùng tinh thần trách nhiệm cao, Luật sư luôn tận tâm tư vấn, bảo vệ quyền và lợi ích hợp pháp của khách hàng, đồng hành mang đến giải pháp pháp lý hiệu quả, an toàn và bền vững.",
};

const DEFAULT_EDUCATIONS = [
  { id: "e1", degree: "Cử nhân Luật", institution: "Đại học Cần Thơ" },
  { id: "e2", degree: "Thạc sĩ Luật", institution: "Đại học Luật Thành phố Hồ Chí Minh" },
];

const DEFAULT_EXPERIENCES = [
  {
    id: "ex1",
    startYear: 2011,
    endYear: 2021,
    position: "Công tác trong ngành Kiểm sát tỉnh Đồng Tháp",
    organization: "Ngành Kiểm sát tỉnh Đồng Tháp",
    highlights: [{ id: "h1", content: "Kiểm sát viên giai đoạn 2017 - 2021" }],
  },
  {
    id: "ex2",
    startYear: 2021,
    endYear: 2025,
    position: "Công tác tại Ban Nội chính Tỉnh ủy Đồng Tháp",
    organization: "Ban Nội chính Tỉnh ủy Đồng Tháp",
    highlights: [{ id: "h2", content: "Chuyên lĩnh vực phòng, chống tham nhũng" }],
  },
  {
    id: "ex3",
    startYear: 2025,
    endYear: 2026,
    position: "Luật sư chuyên nghiệp",
    organization: "Luật sư chuyên nghiệp",
    highlights: [],
  },
];

const DEFAULT_PRACTICE_AREAS = [
  { id: "p1", title: "Dân sự – Hình sự – Hành chính" },
  { id: "p2", title: "Doanh nghiệp – Thương mại – Lao động" },
  { id: "p3", title: "Đất đai – Nhà ở" },
  { id: "p4", title: "Ly hôn – Hôn nhân gia đình" },
  { id: "p5", title: "Hợp đồng – Giao dịch dân sự" },
  { id: "p6", title: "Tư vấn pháp lý thường xuyên cho cá nhân, tổ chức" },
  { id: "p7", title: "Đại diện tham gia tố tụng, giải quyết tranh chấp" },
  { id: "p8", title: "Bào chữa người bị buộc tội, bảo vệ quyền và lợi ích hợp pháp cho đương sự" },
];

const DEFAULT_COMMITMENT = {
  heading: "Tận tâm – Chuyên nghiệp – Bảo mật – Hiệu quả",
  content: "Cam kết đồng hành cùng khách hàng bằng sự thấu hiểu và giải pháp pháp lý tối ưu nhất.",
};

const DEFAULT_SETTINGS = {
  siteName: "Luật sư - Thạc sĩ Lê Thị Ngọc Lợi",
  phone: "0902 081 061",
  address: "Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp",
  floatingContactEnabled: true,
};

async function getSiteData() {
  try {
    // Single consolidated database query
    const site = await prisma.site.findUnique({
      where: { slug: "le-thi-ngoc-loi" },
      include: {
        settings: true,
        hero: true,
        introduction: true,
        education: {
          where: { status: "PUBLISHED" },
          orderBy: { displayOrder: "asc" },
        },
        experience: {
          where: { status: "PUBLISHED" },
          orderBy: { displayOrder: "asc" },
          include: { highlights: { orderBy: { displayOrder: "asc" } } },
        },
        practiceAreas: {
          where: { status: "PUBLISHED" },
          orderBy: { displayOrder: "asc" },
        },
        commitment: true,
        contactChannels: {
          where: { status: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!site) {
      return {
        site: null,
        settings: DEFAULT_SETTINGS,
        hero: DEFAULT_HERO,
        introduction: DEFAULT_INTRO,
        educations: DEFAULT_EDUCATIONS,
        experiences: DEFAULT_EXPERIENCES,
        practiceAreas: DEFAULT_PRACTICE_AREAS,
        commitment: DEFAULT_COMMITMENT,
        enabledChannels: [],
      };
    }

    return {
      site,
      settings: site.settings || DEFAULT_SETTINGS,
      hero: site.hero
        ? {
            subtitle: site.hero.pubSubtitle || DEFAULT_HERO.subtitle,
            name: site.hero.pubName || DEFAULT_HERO.name,
            imageUrl: site.hero.pubImageUrl || DEFAULT_HERO.imageUrl,
          }
        : DEFAULT_HERO,
      introduction: site.introduction
        ? {
            title: site.introduction.pubTitle || DEFAULT_INTRO.title,
            content: site.introduction.pubContent || DEFAULT_INTRO.content,
          }
        : DEFAULT_INTRO,
      educations: site.education.length > 0 ? site.education : DEFAULT_EDUCATIONS,
      experiences: site.experience.length > 0 ? site.experience : DEFAULT_EXPERIENCES,
      practiceAreas: site.practiceAreas.length > 0 ? site.practiceAreas : DEFAULT_PRACTICE_AREAS,
      commitment: site.commitment
        ? {
            heading: site.commitment.pubHeading || DEFAULT_COMMITMENT.heading,
            content: site.commitment.pubContent || DEFAULT_COMMITMENT.content,
          }
        : DEFAULT_COMMITMENT,
      enabledChannels: site.contactChannels || [],
    };
  } catch (error) {
    console.error("Error loading site data, using fallback defaults:", error);
    return {
      site: null,
      settings: DEFAULT_SETTINGS,
      hero: DEFAULT_HERO,
      introduction: DEFAULT_INTRO,
      educations: DEFAULT_EDUCATIONS,
      experiences: DEFAULT_EXPERIENCES,
      practiceAreas: DEFAULT_PRACTICE_AREAS,
      commitment: DEFAULT_COMMITMENT,
      enabledChannels: [],
    };
  }
}

export default async function PublicPage() {
  const data = await getSiteData();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Subtle Header */}
      <Header />

      {/* Hero Section (Includes Introduction Card in Left Column) */}
      <Hero data={data.hero} introduction={data.introduction} />

      {/* Two-Column Desktop Grid Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Education & Experience */}
          <div className="lg:col-span-6 space-y-8">
            <EducationSection items={data.educations} />
            <ExperienceSection items={data.experiences} />
          </div>

          {/* RIGHT COLUMN: Practice Areas (Checklist format) & Commitment (Quote card) */}
          <div className="lg:col-span-6 space-y-8">
            <PracticeAreasSection items={data.practiceAreas} />
            <CommitmentSection data={data.commitment} />
          </div>

        </div>
      </main>

      {/* Footer & Contact */}
      <Footer settings={data.settings} channels={data.enabledChannels} />

      {/* Mobile Floating Contact Bar */}
      <FloatingContact
        enabled={data.settings?.floatingContactEnabled ?? true}
        phone={data.settings?.phone || "0902 081 061"}
        channels={data.enabledChannels}
      />
    </div>
  );
}
