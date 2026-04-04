import Link from "next/link";
import { SETTINGS_MENU } from "@/constants/profile";

export default function SettingsMenu() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <h4 className="font-bold text-on-surface font-headline mb-6">
        Pengaturan
      </h4>

      <div className="space-y-1">
        {SETTINGS_MENU.map((item) => {
          const content = (
            <>
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.danger
                      ? "bg-error/10 text-error"
                      : "bg-primary/10 text-primary group-hover:bg-primary/15"
                  } transition-colors`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {item.icon}
                  </span>
                </div>
                <div className="text-left">
                  <p
                    className={`font-bold text-sm ${
                      item.danger ? "text-error" : "text-on-surface"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-tertiary text-[11px]">
                    {item.description}
                  </p>
                </div>
              </div>
              {!item.danger && (
                <span className="material-symbols-outlined text-outline text-lg group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              )}
            </>
          );

          const className = `w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
            item.danger
              ? "hover:bg-error-container/30"
              : "hover:bg-surface-container-low"
          }`;

          return (
            <div key={item.label}>
              {item.danger && (
                <div className="border-t border-surface-container my-3" />
              )}
              {item.href ? (
                <Link href={item.href} className={className}>
                  {content}
                </Link>
              ) : (
                <button className={className}>{content}</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
