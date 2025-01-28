// app/profile/[username]/page.js
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProfilePage from '@/components/ProfilePage'

export async function generateMetadata({ params }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
  })
  

  return {
    title: `${user?.name || 'Profile'} (@${params.username}) - LetsConnect`,
  }
}

export default async function Page({ params }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      skills: {
        include: {
          skill: true
        }
      }
    }
  })

  if (!user) {
    notFound(); // This will trigger the custom 404
  }
  // Transform data for the profile layout
  const profileData = {
    name: user.name,
    username: user.username,
    profile_picture: user.profile_picture,
    bio: user.bio,
    location: user.location,
    email: user.email,
    timezone: user.timezone,
    skills: user.skills.map(us => us.skill.name),
    joinedAt: user.joined_at.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return <ProfilePage data={profileData} />
}