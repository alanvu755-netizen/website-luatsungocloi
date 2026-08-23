import { MapPin, Phone, MessageSquare, Send, Facebook, Globe } from "lucide-react";

interface ContactChannelItem {
  id: string;
  platform: string;
  label: string;
  url: string;
  openInNewTab: boolean;
}

interface FooterProps {
  settings: {
    address: string;
    phone: string;
    siteName: string;
  } | null;
  channels: ContactChannelItem[];
}

export default function Footer({ settings, channels }: FooterProps) {
  const address = settings?.address || "Số 149 đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp";
  const phone = settings?.phone || "0902 081 061";

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "ZALO":
        return <MessageSquare className="w-5 h-5 text-gold" />;
      case "TELEGRAM":
        return <Send className="w-5 h-5 text-gold" />;
      case "FACEBOOK":
        return <Facebook className="w-5 h-5 text-gold" />;
      default:
        return <Globe className="w-5 h-5 text-gold" />;
    }
  };

  return (
    <footer id="lien-he" className="bg-navy-dark text-white pt-10 pb-12 mt-12 border-t-4 border-gold">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Address & Phone Information */}
          <div className="md:col-span-8 space-y-4">
            
            {/* Address Row */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-1" />
              <p className="text-sm sm:text-base font-normal text-slate-100 leading-snug">
                <strong className="font-semibold text-white">Địa chỉ trụ sở:</strong> {address}
              </p>
            </div>

            {/* Phone Row */}
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-white flex-shrink-0" />
              <p className="text-sm sm:text-base font-normal text-slate-100">
                <strong className="font-semibold text-white">Điện thoại:</strong>{" "}
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-gold font-bold hover:underline transition-all"
                >
                  {phone} (Luật sư Lê Thị Ngọc Lợi)
                </a>
              </p>
            </div>

          </div>

          {/* Social / Contact Channels Buttons */}
          <div className="md:col-span-4 flex flex-wrap md:justify-end gap-3">
            {channels.map((ch) => (
              <a
                key={ch.id}
                href={ch.url}
                target={ch.openInNewTab ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-navy/80 hover:bg-navy border border-gold/40 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-xs transition-all hover:scale-105"
              >
                {getPlatformIcon(ch.platform)}
                <span>{ch.label}</span>
              </a>
            ))}
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-slate-300">
          <p>© {new Date().getFullYear()} Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
