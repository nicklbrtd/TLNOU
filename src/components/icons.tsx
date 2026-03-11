import {
  Archive,
  House,
  MessageCircleMore,
  Radio,
  Sparkles,
  UserRound,
} from "lucide-react";

interface IconProps {
  className?: string;
}

export type AppIconName = "feed" | "profile" | "memory" | "channel" | "chats" | "spark";

const iconClasses = "stroke-[1.9]";

function FeedIcon({ className }: IconProps) {
  return <House className={`${iconClasses} ${className ?? ""}`} aria-hidden="true" />;
}

function ProfileIcon({ className }: IconProps) {
  return <UserRound className={`${iconClasses} ${className ?? ""}`} aria-hidden="true" />;
}

function MemoryIcon({ className }: IconProps) {
  return <Archive className={`${iconClasses} ${className ?? ""}`} aria-hidden="true" />;
}

function ChannelIcon({ className }: IconProps) {
  return <Radio className={`${iconClasses} ${className ?? ""}`} aria-hidden="true" />;
}

function ChatsIcon({ className }: IconProps) {
  return <MessageCircleMore className={`${iconClasses} ${className ?? ""}`} aria-hidden="true" />;
}

function SparkIcon({ className }: IconProps) {
  return <Sparkles className={`${iconClasses} ${className ?? ""}`} aria-hidden="true" />;
}

export function AppIcon({ name, className }: { name: AppIconName; className?: string }) {
  switch (name) {
    case "feed":
      return <FeedIcon className={className} />;
    case "profile":
      return <ProfileIcon className={className} />;
    case "memory":
      return <MemoryIcon className={className} />;
    case "channel":
      return <ChannelIcon className={className} />;
    case "chats":
      return <ChatsIcon className={className} />;
    case "spark":
      return <SparkIcon className={className} />;
    default:
      return null;
  }
}
