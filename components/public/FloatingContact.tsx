import { Phone, MessageSquare, Send, Facebook } from "lucide-react";

interface FloatingContactProps {
  enabled: boolean;
  phone: string;
  channels: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
  }>;
}

export default function FloatingContact({ enabled, phone, channels }: FloatingContactProps) {
  if (!enabled) return null;

  const getIcon = (platform: string) => {
    switch (platform) {
      case "ZALO":
        return <MessageSquare className="w-5 h-5" />;
      case "TELEGRAM":
        return <Send className="w-5 h-5" />;
      case "FACEBOOK":
        return <Facebook className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 sm:hidden">
      {/* Phone Call Float Button */}
      <a
        href={`tel:${phone.replace(/\s+/g, "")}`}
        className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center shadow-lg border-2 border-gold active:scale-95 transition-transform"
        aria-label="Gọi điện thoại"
      >
        <Phone className="w-6 h-6 text-gold animate-bounce" />
      </a>

      {/* Active Channels Buttons */}
      {channels.map((ch) => (
        <a
          key={ch.id}
          href={ch.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-navy/90 text-gold flex items-center justify-center shadow-md border border-white/20 active:scale-95 transition-transform"
          aria-label={ch.label}
        >
          {getIcon(ch.platform)}
        </a>
      ))}
    </div>
  );
}
