/**
 * Lucide icons with a lighter default stroke to match the invitation's
 * fine-line ornaments. Import icons from here, not from lucide-react.
 */
import {
  ArrowUp as LArrowUp,
  CalendarPlus as LCalendarPlus,
  Check as LCheck,
  ChevronLeft as LChevronLeft,
  ChevronRight as LChevronRight,
  Clock as LClock,
  Disc3 as LDisc3,
  LoaderCircle as LLoaderCircle,
  MapPin as LMapPin,
  Navigation as LNavigation,
  Send as LSend,
  VolumeX as LVolumeX,
  X as LX,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

function thin(Icon: LucideIcon) {
  function ThinIcon({ size = 18, strokeWidth = 1.5, ...rest }: LucideProps) {
    return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />;
  }
  ThinIcon.displayName = Icon.displayName;
  return ThinIcon;
}

export const ArrowUp = thin(LArrowUp);
export const CalendarPlus = thin(LCalendarPlus);
export const Check = thin(LCheck);
export const ChevronLeft = thin(LChevronLeft);
export const ChevronRight = thin(LChevronRight);
export const Clock = thin(LClock);
export const Disc3 = thin(LDisc3);
export const LoaderCircle = thin(LLoaderCircle);
export const MapPin = thin(LMapPin);
export const Navigation = thin(LNavigation);
export const Send = thin(LSend);
export const VolumeX = thin(LVolumeX);
export const X = thin(LX);
