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

export const dynamic = "force-dynamic";

async function getSiteData() {
  try {
    const site = await prisma.site.findUnique({
      where: { slug: "le-thi-ngoc-loi" },
      include: { settings: true },
    });

    if (!site) return null;

    const [
      hero,
      introduction,
      educations,
      experiences,
      practiceAreas,
      commitment,
      enabledChannels,
    ] = await Promise.all([
      getPublishedHero(site.id),
      getPublishedIntroduction(site.id),
      getPublishedEducations(site.id),
      getPublishedExperiences(site.id),
      getPublishedPracticeAreas(site.id),
      getPublishedCommitment(site.id),
      getEnabledContactChannels(site.id),
    ]);

    return {
      site,
      settings: site.settings,
      hero,
      introduction,
      educations,
      experiences,
      practiceAreas,
      commitment,
      enabledChannels,
    };
  } catch (error) {
    console.error("Error loading homepage site data:", error);
    return null;
  }
}

export default async function PublicPage() {
  const data = await getSiteData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-navy font-serif text-xl">
        Chưa tìm thấy dữ liệu trang web. Vui lòng chạy db:seed.
      </div>
    );
  }

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
