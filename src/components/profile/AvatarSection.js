// components/profile/AvatarSection.js
"use client";

export default function AvatarSection({ data }) {
  return (
    <div 
      className="w-full lg:w-auto lg:min-w-[260px]"
      style={{
        paddingLeft: '20px',
        paddingTop: '50px',
        position: 'sticky',
        top: '80px',
        alignSelf: 'flex-start'
      }}
    >
      <div className="space-y-4">
        <div className="h-48 w-48 rounded-full border-2 border-gray-200 dark:border-gray-600 p-1 mx-auto lg:mx-0">
          <div className="h-full w-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            {data?.profile_picture ? (
              <img
                src={data.profile_picture}
                alt={`${data?.name}'s profile`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400">
                {(data?.name?.[0] || data?.username?.[0] || 'U')}
              </div>
            )}
          </div>
        </div>

        <div className="text-center lg:text-left space-y-1">
          <h1 className="text-2xl font-bold break-words">
            {data?.name || 'Anonymous User'}
          </h1>
          <p className="text-lg text-muted-foreground break-words">
            @{data?.username || 'unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}