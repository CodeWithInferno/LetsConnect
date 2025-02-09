// typeDefs.js
const { gql } = require("graphql-tag");

const typeDefs = gql`
  # -------------------------------
  # Main Project type
  # -------------------------------
  type Project {
    id: ID!
    title: String!
    description: String
    projectType: String
    skillsRequired: [Skill!] # ✅ Add SkillsRequired field
    languages: [ProgrammingLanguage!] # ✅ Add Programming Languages
    deadline: String
    budget: Float
    certificateEligible: Boolean
    bannerImage: String
    githubRepo: String
    # from your Prisma model:
    email: String
    organizationId: String
    createdAt: String
    updatedAt: String

    # Relationships
    owner: User
    organization: Organization
    members: [ProjectMember!]!
  }

  # -------------------------------
  # The join model: ProjectMember
  # -------------------------------
  type ProjectMember {
    id: ID!
    role: String
    joinedAt: String
    user: User
    status: String
  }

  type ProgrammingLanguage {
    id: ID!
    name: String!
  }
  # -------------------------------
  # User type (with the fields you actually need)
  # -------------------------------
  type User {
    id: ID!
    username: String
    name: String
    email: String
    profile_picture: String
    role: String
    organizations: [Organization!]!
    bio: String
    website: String
    location: String
    timezone: String
    qualifications: String
    skills: [UserSkill!]!
    githubUsername: String
    githubAvatar: String
  }
  type UserSkill {
    skill: Skill!
  }
  type Skill {
    id: ID!
    name: String!
  }

  # -------------------------------
  # Organization type
  # -------------------------------
  type Organization {
    id: ID!
    name: String
    logo: String
  }

  # -------------------------------
  # Notification type
  # -------------------------------
  type Notification {
    id: ID!
    message: String!
    createdAt: String!
    read: Boolean!
    type: String
    # if storing projectId, projectMemberId in DB, add them:
    projectId: String
    projectMemberId: String
  }

  # For a "rejectMembership" response
  type RejectResponse {
    success: Boolean!
  }

  # -------------------------------
  # Queries
  # -------------------------------
  type Query {
    # Projects
    myProjects: [Project!]!
    myProject(projectId: String!): Project
    projects(
      projectType: String
      organizationId: String
      skillsRequired: [String!]
    ): [Project!]!

    # User
    myUser: User!

    # Notifications
    myNotifications: [Notification!]!
  }

  # -------------------------------
  # Mutations
  # -------------------------------
  type Mutation {
    inviteMemberToProject(
      projectId: String!
      email: String!
      role: String!
    ): ProjectMember!

    acceptMembership(projectMemberId: String!): ProjectMember!

    markNotificationAsRead(notificationId: String!): Notification!

    rejectMembership(projectMemberId: String!): RejectResponse!
    applyToProject(projectId: String!): ProjectMember!
  }
  type KanbanBoard {
    id: ID!
    project: Project!
    columns: [KanbanColumn!]!
    createdAt: String!
    updatedAt: String!
  }

  type KanbanColumn {
    id: ID!
    title: String!
    color: String!
    order: Int!
    tasks: [KanbanTask!]!
    createdAt: String!
    updatedAt: String!
  }

  type KanbanTask {
    id: ID!
    content: String!
    priority: String!
    dueDate: String
    tags: [String!]!
    column: KanbanColumn!
    project: Project!
    assignee: User
    createdAt: String!
    updatedAt: String!
    lastModifiedByUser: User
  }

  extend type Query {
    kanbanBoard(projectId: ID!): KanbanBoard
  }

  extend type Mutation {
    moveKanbanTask(
      taskId: ID!
      sourceColumnId: ID!
      destinationColumnId: ID!
      newIndex: Int!
      projectId: ID!
    ): KanbanTask

    createKanbanTask(
      projectId: ID!
      columnId: ID!
      content: String!
      priority: String!
    ): KanbanTask

    updateKanbanTask(
      taskId: ID!
      content: String
      priority: String
      dueDate: String
      tags: [String!]
    ): KanbanTask
  }
  extend type Mutation {
    createKanbanTask(
      projectId: ID!
      columnId: ID!
      content: String!
      priority: String!
      dueDate: String
      tags: [String!]
    ): KanbanTask
  }

  extend type Query {
    myProfile: User!
  }

  input UpdateProfileInput {
    name: String
    username: String
    bio: String
    website: String
    location: String
    skills: [String!]
    profile_picture: String
  }

  extend type Mutation {
    updateProfile(input: UpdateProfileInput!): User!
  }

  # -------------------------------
  # Calendar Event Types
  # -------------------------------
  type CalendarEvent {
    id: ID!
    title: String!
    description: String
    startTime: String! # ISO date string
    endTime: String! # ISO date string
    location: String
    recurrence: String
    reminderMinutesBefore: Int
    createdAt: String!
    updatedAt: String!
    priority: String # <-- Add this field
    deadline: String
    # Relationships
    organizer: User!
    project: Project
    assignedTo: User
    participants: [CalendarEventParticipant!]!
  }

  type CalendarEventParticipant {
    event: CalendarEvent!
    user: User!
  }

  # -------------------------------
  # Extend Queries
  # -------------------------------
  extend type Query {
    calendarEvents(projectId: ID!): [CalendarEvent!]!
    calendarEvent(eventId: ID!): CalendarEvent
  }

  # -------------------------------
  # Extend Mutations
  # -------------------------------
  extend type Mutation {
    createCalendarEvent(
      title: String!
      description: String
      startTime: String!
      endTime: String!
      location: String
      recurrence: String
      reminderMinutesBefore: Int
      priority: String # <-- New argument
      deadline: String
      projectId: ID
      assignedTo: ID
    ): CalendarEvent!

    updateCalendarEvent(
      eventId: ID!
      title: String
      description: String
      startTime: String
      endTime: String
      location: String
      recurrence: String
      reminderMinutesBefore: Int
      assignedTo: ID
    ): CalendarEvent!

    deleteCalendarEvent(eventId: ID!): CalendarEvent!
  }
`;

module.exports = typeDefs;
