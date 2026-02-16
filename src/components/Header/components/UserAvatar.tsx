import Image from 'next/image';

interface UserAvatarProps {
  avatarURL?: string;
  username?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const UserAvatar = ({
  avatarURL,
  username,
  size = 'md',
  onClick,
}: UserAvatarProps) => {
  const sizeClasses = size === 'sm' ? 'h-11 w-11' : 'h-11 w-11';
  const textSize = size === 'sm' ? 'text-base' : 'text-lg';

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`flex ${sizeClasses} items-center justify-center rounded-full bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-0.5 ${onClick ? 'cursor-pointer transition-transform hover:scale-110 active:scale-95' : ''}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full">
        {avatarURL ? (
          <Image
            src={avatarURL}
            alt="avatar"
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <span
            className={`flex h-full w-full items-center justify-center bg-[var(--sidebar-bg)] ${textSize} font-bold text-[var(--main-text-color)]`}
          >
            {username?.charAt(0).toUpperCase() ?? '?'}
          </span>
        )}
      </div>
    </Component>
  );
};
